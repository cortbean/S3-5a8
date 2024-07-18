package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.*;
import ca.usherbrooke.fgen.api.mapper.ArticleMapper;
import ca.usherbrooke.fgen.api.mapper.CategorieMapper;
import ca.usherbrooke.fgen.api.mapper.PersonMapper;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArticleService {

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


    public ArticleService() {
        //default constructor
    }

    @GET
    @Path("/getcategorie")
    @PermitAll
    public List<Item> getCategorie() {
        return categorieMapper.allCategorie();
    }

    @GET
    @Path("/selectarticle")
    @PermitAll
    public List<Item> selectArticle(@QueryParam("id_categorie") String id_categorie) {
        return articleMapper.selectArticle(id_categorie);
    }

    @GET
    @Path("/selectarticleadmin")
    @PermitAll
    public List<Item> selectArticleAdmin(@QueryParam("id_categorie") String id_categorie) {
        return articleMapper.selectArticleAdmin(id_categorie);
    }

    @POST
    @Path("/updatestock")
    @RolesAllowed({"admin"})
        @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVisibleStock(VisibleProduct request) {
        try {
            articleMapper.updateVisibleStock(request.getIdProduit(), request.getQuantite());
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }


    @GET
    @Path("/showVisibleProducts")
    @PermitAll
    public List<Item> showVisibleProducts(@QueryParam("id_categorie") String id_categorie) {
        return articleMapper.selectVisibleArticle(id_categorie);
    }

    @POST
    @Path("/updateVisibleProducts")
    @PermitAll
    public Response updateVisibleProducts(ProduitCommander produit) {


        System.out.println("ID: " + produit.idProduit);
        System.out.println("Visible: " + produit.visible);
        try {
            articleMapper.updateVisibleProducts(produit.idProduit, produit.visible);
            return Response.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }
}

