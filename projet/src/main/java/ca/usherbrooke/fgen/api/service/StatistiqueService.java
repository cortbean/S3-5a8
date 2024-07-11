package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.mapper.StatistiqueMapper;
import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class StatistiqueService {
    @Inject
    StatistiqueMapper statistiqueMapper;

    @GET
    @Path("/stats/produits-faculte")
    @RolesAllowed({"admin"})
    public Response getStatistiqueParFaculte() {
        /*try {
            List<Map<String, Object>> stats = statistiqueMapper.getStatistiqueParFaculte();
            return Response.ok(stats).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }*/
        try {
            List<Map<String, Object>> stats = statistiqueMapper.getStatistiqueParFaculte();
            System.out.println("Statistiques renvoyées : " + stats);
            return Response.ok(stats).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }
}


