package ca.usherbrooke.fgen.api.service;


import ca.usherbrooke.fgen.api.business.Commande;
import ca.usherbrooke.fgen.api.business.commandeView;
import ca.usherbrooke.fgen.api.business.Produit;
import ca.usherbrooke.fgen.api.mapper.CommandeMapper;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.PermitAll;
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
import java.util.Map;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

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
    @Path("/IdCommande")
    @RolesAllowed({"client"})
    public Commande Ajoutcommande() {
        Commande c = new Commande();
        c.cip = this.securityContext.getUserPrincipal().getName();
        c.idCommande = UUID.randomUUID().toString();
        c.dateCommande = LocalDateTime.now();
        commandeMapper.insertCommande(c);
        return c;
    }

    @GET
    @Path("/addProduit")
    @RolesAllowed({"client"})
    public Produit Ajoutproduit(
            @QueryParam("idProduit") int idProduit,
            @QueryParam("idCommande") String idCommande,
            @QueryParam("quantite") String quantite) {
        Produit p = new Produit();
        p.idProduit = idProduit;
        p.idCommande = idCommande;
        p.quantite = quantite;
        commandeMapper.insertProduit(p);
        return p;
    }

    @GET
    @Path("/getCommandeProduits")
    @RolesAllowed({"client"})
    public List<commandeView> getCommandeProduits(@QueryParam("idCommande") String idCommande) {
        return commandeMapper.selectFromCommandeProduits(idCommande);
    }

}
