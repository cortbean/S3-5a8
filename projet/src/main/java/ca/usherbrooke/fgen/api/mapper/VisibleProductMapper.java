package ca.usherbrooke.fgen.api.mapper;

import ca.usherbrooke.fgen.api.business.VisibleProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface VisibleProductMapper {
    void updateVisibleProducts(@Param("produits") List<VisibleProduct> produits);
    List<VisibleProduct> getVisibleProducts();
}
