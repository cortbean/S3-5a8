package ca.usherbrooke.fgen.api.service;


import ca.usherbrooke.fgen.api.business.Commande;
import ca.usherbrooke.fgen.api.business.CommandeView;
import ca.usherbrooke.fgen.api.business.Produit;
import ca.usherbrooke.fgen.api.mapper.CommandeMapper;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import java.util.List;
import java.time.LocalDateTime;
import java.util.UUID;

import static io.smallrye.openapi.runtime.io.IoLogging.logger;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class CommandeService {
    @Context
    SecurityContext securityContext;

    @Inject
    JsonWebToken jwt;

    @Inject
    CommandeMapper commandeMapper;

    @GET
    @Path("/IdCommande") //retourne le numero de la commande qu'on ouvre pour ajouter des produits dedans
    @RolesAllowed({"client"})
    public String Ajoutcommande() {
        Commande c = new Commande();
        c.cip = this.securityContext.getUserPrincipal().getName();
        c.idCommande = commandeMapper.getNextCommandeId();
        System.out.println("Generated Commande ID: " + c.idCommande);
        c.dateCommande = LocalDateTime.now();
        commandeMapper.insertCommande(c);
        System.out.println("Inserted Commande: " + c);
        return c.idCommande;

    }

    @GET
    @Path("/CommandePourAdmin") //retourne le numero de la commande qu'on ouvre pour ajouter des produits dedans
    @RolesAllowed({"client"})
    public void AfficheCommandeAdmin(@QueryParam("idCommande") String idCommande) {
        commandeMapper.insertIntoCommandeVueAdmin(idCommande);
    }


    @GET
    @Path("/addProduit") //Ajoute un produit dans dans le id commande
    @RolesAllowed({"client"})
    public Produit Ajoutproduit(
            @QueryParam("idProduit") int idProduit,
            @QueryParam("idCommande") String idCommande,
            @QueryParam("quantite") int quantite) {
        Produit p = new Produit();
        p.idProduit = idProduit;
        p.idCommande = idCommande;
        p.quantite = quantite;
        commandeMapper.insertProduit(p);
        return p;
    }

    @GET
    @Path("/getCommandeProduits") //va chercher la commande du Id_commande
    @RolesAllowed({"client"})
    public List<CommandeView> getCommandeProduits(@QueryParam("idCommande") String idCommande) {
        return commandeMapper.selectFromCommandeProduits(idCommande);
    }

}
