package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.*;
import ca.usherbrooke.fgen.api.mapper.ArticleMapper;
import ca.usherbrooke.fgen.api.mapper.CategorieMapper;
import ca.usherbrooke.fgen.api.mapper.CommandeMapper;
import ca.usherbrooke.fgen.api.mapper.PersonMapper;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import javax.ws.rs.Consumes;

import static io.smallrye.openapi.runtime.io.IoLogging.logger;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class CommandeService {

    @Context
    SecurityContext securityContext;

    @Inject
    JsonWebToken jwt;

    @Inject
    CommandeMapper commandeMapper;

    public CommandeService() {
        // Constructeur par défaut
    }

    @GET
    @Path("/IdCommande")
    public Response Ajoutcommande() {
        Principal principal = securityContext.getUserPrincipal();
        if (principal == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("User not authenticated").build();
        }

        Commande c = new Commande();
        c.cip = principal.getName();
        c.idCommande = commandeMapper.getNextCommandeId();
        c.dateCommande = LocalDateTime.now();
        commandeMapper.insertCommande(c);
        return Response.ok(c.idCommande).build();
    }

    @GET
    @Path("/CommandePourAdmin") // retourne le numero de la commande qu'on ouvre pour ajouter des produits dedans
    @RolesAllowed({"admin"})
    public void AfficheCommandeAdmin(@QueryParam("idCommande") String idCommande) {
        commandeMapper.insertIntoCommandeVueAdmin(idCommande);
    }

    @GET
    @Path("/addProduit") // Ajoute un produit dans dans le id commande
    public Produit Ajoutproduit(
            @QueryParam("idProduit") int idProduit,
            @QueryParam("idCommande") String idCommande,
            @QueryParam("quantite") int quantite) {
        Principal principal = securityContext.getUserPrincipal();
        if (principal == null) {
            throw new SecurityException("User not authenticated");
        }
        Produit p = new Produit();
        p.idProduit = idProduit;
        p.idCommande = idCommande;
        p.quantite = quantite;
        commandeMapper.insertProduit(p);
        return p;
    }

    @GET
    @Path("/getCommandeProduits") // va chercher la commande du Id_commande
    @RolesAllowed({"admin"})
    public List<CommandeView> getCommandeProduits(@QueryParam("idCommande") String idCommande) {
        return commandeMapper.selectFromCommandeProduits(idCommande);
    }

}

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ConnectionService {

    @Context
    SecurityContext securityContext;

    @Inject
    JsonWebToken jwt;

    @Inject
    PersonMapper personMapper;

    @Inject
    CategorieMapper categorieMapper;

    @Inject
    ArticleMapper articleMapper;

    @GET
    @Path("/client")
    @RolesAllowed({"client"})
    public Person client() {
        Person p = new Person();
        p.cip = this.securityContext.getUserPrincipal().getName();
        p.lastName = (String) this.jwt.getClaim("family_name");
        p.firstName = (String) this.jwt.getClaim("given_name");
        p.email = (String) this.jwt.getClaim("email");
        p.role = "client";
        personMapper.insertPerson(p);
        return p;
    }

    @GET
    @Path("/admin")
    @RolesAllowed({"admin"})
    public Person admin() {
        Person p = new Person();
        p.cip = this.securityContext.getUserPrincipal().getName();
        p.lastName = (String) this.jwt.getClaim("family_name");
        p.firstName = (String) this.jwt.getClaim("given_name");
        p.email = (String) this.jwt.getClaim("email");
        p.role = "admin";
        personMapper.insertPerson(p);

        return p;
    }

    @GET
    @Path("/getcategorie")
    @PermitAll
    public List<Item> getCategorie() {
        List<Item> item = categorieMapper.allCategorie();
        return item;
    }

    @GET
    @Path("/selectarticle")
    @PermitAll
    public List<Item> selectArticle(@QueryParam("id_categorie") String id_categorie) {
        List<Item> item = articleMapper.selectArticle(id_categorie);
        return item;
    }

    @GET
    @Path("/any")
    @PermitAll
    public Person me() {
        Person p = new Person();
        p.cip = this.securityContext.getUserPrincipal().getName();
        p.lastName = (String) this.jwt.getClaim("family_name");
        p.firstName = (String) this.jwt.getClaim("given_name");
        p.email = (String) this.jwt.getClaim("email");
        personMapper.insertPerson(p);
        return p;
    }

    @GET
    @Path("/test")
    public String test() {
        return "ok";
    }
}
