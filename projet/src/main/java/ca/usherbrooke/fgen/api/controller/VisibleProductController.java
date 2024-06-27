package ca.usherbrooke.fgen.api.controller;

import ca.usherbrooke.fgen.api.business.VisibleProduct;
import ca.usherbrooke.fgen.api.mapper.VisibleProductMapper;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/api")
@Tag(name = "API des Produits Visibles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class VisibleProductController {
    @Inject
    private VisibleProductMapper visibleProductMapper;

    @POST
    @Path("/updateVisibleProducts")
    public void updateVisibleProducts(List<VisibleProduct> produits) {
        visibleProductMapper.updateVisibleProducts(produits);
    }

    @GET
    @Path("/getVisibleProducts")
    public List<VisibleProduct> getVisibleProducts() {
        return visibleProductMapper.getVisibleProducts();
    }
}
