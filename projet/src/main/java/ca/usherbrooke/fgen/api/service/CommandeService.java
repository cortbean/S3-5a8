package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.Commande;
import ca.usherbrooke.fgen.api.business.Person;
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

            // Log details of the order received
            System.out.println("Received Order: " + commande);

            // Use the provided order ID or generate a unique ID
            if (commande.idCommande == null || commande.idCommande.isEmpty()) {
                commande.idCommande = UUID.randomUUID().toString();
            }

            // Update order information
            commande.cip = principal.getName();
            commande.dateCommande = LocalDateTime.now();
            commande.status = "en cours";

            // Retrieve user's first name and last name from the Utilisateur table
            Person person = commandeMapper.selectPersonDetails(principal.getName());
            if (person == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("User details not found").build();
            }

            commande.Nom = person.firstName;
            commande.Prenom = person.lastName;

            // Insert the order into the project.Commande table
            System.out.println("Inserting order: " + commande);
            commandeMapper.insertCommande(commande);

            // Retrieve product details and insert products into the project.Plusieurs table
            for (ProduitCommander produit : commande.produits) {
                produit.idCommande = commande.idCommande;

                // Retrieve product details
                ProduitCommander productDetails = commandeMapper.selectProductDetails(produit.idProduit);
                if (productDetails != null) {
                    produit.nomProduit = productDetails.nomProduit;
                    produit.PrixProduit = productDetails.PrixProduit;
                } else {
                    return Response.status(Response.Status.BAD_REQUEST).entity("Product details not found for product ID: " + produit.idProduit).build();
                }

                // Log the product details, including price
                System.out.println("Inserting product: " + produit);
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
    @Path("/getAllCommandesWithProduits")
    @RolesAllowed({"admin"})
    public Response getAllCommandesWithProduits() {
        try {
            List<Commande> commandes = commandeMapper.selectAllCommandesWithProduits();
            // Ajoutez un log pour vérifier les commandes retournées
            System.out.println("Commandes retournées par selectAllCommandesWithProduits: " + commandes);
            return Response.ok(commandes).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/markAsCompleted/{idCommande}")
    @RolesAllowed({"admin"})
    public Response markAsCompleted(@PathParam("idCommande") String idCommande) {
        try {
            commandeMapper.markAsCompleted(idCommande);
            return Response.ok("Commande marquée comme terminée").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }
}
