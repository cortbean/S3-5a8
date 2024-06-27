package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.*;
import ca.usherbrooke.fgen.api.mapper.ArticleMapper;
import ca.usherbrooke.fgen.api.mapper.CategorieMapper;
import ca.usherbrooke.fgen.api.mapper.PersonMapper;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
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
    @Path("/showVisibleProducts")
    @PermitAll
    public List<Item> showVisibleProducts(@QueryParam("id_categorie") String id_categorie) {
        return articleMapper.selectVisibleArticle(id_categorie);
    }

    @POST
    @Path("/updateVisibleProducts")
    @PermitAll
    public void updateVisibleProducts(List<VisibleProduct> produits) {
        articleMapper.updateVisibleProducts(produits);
    }
}

