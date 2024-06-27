package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.Commande;
import ca.usherbrooke.fgen.api.business.ProduitCommander;
import ca.usherbrooke.fgen.api.mapper.CommandeMapper;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
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

    @POST
    @Path("/commande")
    @RolesAllowed({"client"})
    public Response passerCommande(Commande commande) {
        try {
            Principal principal = securityContext.getUserPrincipal();
            if (principal == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("User not authenticated").build();
            }

            if (commande.produits == null || commande.produits.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST).entity("No products specified").build();
            }

            // Ajoutez des logs pour vérifier les valeurs reçues
            System.out.println("ID Commande: " + commande.idCommande);
            System.out.println("CIP: " + commande.cip);
            System.out.println("Date Commande: " + commande.dateCommande);
            System.out.println("Produits: " + commande.produits);

            // Utiliser l'ID de commande fourni par le client
            if (commande.idCommande == null || commande.idCommande.isEmpty()) {
                commande.idCommande = UUID.randomUUID().toString();
            }

            // Génération d'un ID unique pour la commande
            commande.cip = principal.getName();
            commande.dateCommande = LocalDateTime.now();

            // Insertion de la commande dans la table projet.commande
            commandeMapper.insertCommande(commande);

            // Insertion des produits dans la table projet.plusieurs
            for (ProduitCommander produit : commande.produits) {
                produit.idCommande = commande.idCommande;
                System.out.println("Inserting product: " + produit);  // Ajoutez cette ligne pour le log
                commandeMapper.insertProduit(produit);
            }

            return Response.ok("Commande reçue").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }


    @GET
    @Path("/CommandePourAdmin")
    @RolesAllowed({"admin"})
    public Response afficheCommandeAdmin(@QueryParam("idCommande") String idCommande) {
        try {
            commandeMapper.insertIntoCommandeVueAdmin(idCommande);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/addProduit")
    public Response ajoutProduit(
            @QueryParam("idProduit") int idProduit,
            @QueryParam("idCommande") String idCommande,
            @QueryParam("quantite") int quantite) {
        try {
            Principal principal = securityContext.getUserPrincipal();
            if (principal == null) {
                throw new SecurityException("User not authenticated");
            }
            ProduitCommander produitCommander = new ProduitCommander();
            produitCommander.idProduit = idProduit;
            produitCommander.idCommande = idCommande;
            produitCommander.quantite = quantite;
            commandeMapper.insertProduit(produitCommander);
            return Response.ok(produitCommander).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/getCommandeProduits")
    @RolesAllowed({"admin"})
    public Response getCommandeProduits(@QueryParam("idCommande") String idCommande) {
        try {
            List<ProduitCommander> produits = commandeMapper.selectFromCommandeProduits(idCommande);
            return Response.ok(produits).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }
}
