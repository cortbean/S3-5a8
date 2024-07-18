package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.mapper.StatistiqueMapper;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class StatistiqueService {
    @Context
    SecurityContext securityContext;

    @Inject
    JsonWebToken jwt;

    @Inject
    StatistiqueMapper statistiqueMapper;

    @GET
    @Path("/stats/top-programmes")
    @RolesAllowed({"admin"})
    public Response getTop5Programmes() {
        try {
            List<Map<String, Object>> stats = statistiqueMapper.getTop5Programmes();
            return Response.ok(stats).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @GET
    @Path("/stats/top-produit")
    @RolesAllowed({"admin"})
    public Response getTop5Produit() {
        try {
            List<Map<String, Object>> stats = statistiqueMapper.getTop5Produit();
            return Response.ok(stats).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }
}