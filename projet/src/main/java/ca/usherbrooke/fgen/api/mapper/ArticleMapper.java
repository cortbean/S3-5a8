
package ca.usherbrooke.fgen.api.mapper;


import ca.usherbrooke.fgen.api.business.Item;
import ca.usherbrooke.fgen.api.business.ProduitCommander;
import ca.usherbrooke.fgen.api.business.VisibleProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ArticleMapper {

    List<Item> selectArticle(@Param("id_categorie") String id_categorie);
    Item getProductDetails(@Param("id_item") int id_item);
    List<Item> selectArticleAdmin(@Param("id_categorie") String id_categorie);
    List<Item> selectVisibleArticle(@Param("id_categorie") String id_categorie);
    void updateVisibleProducts(@Param("id") int id, @Param("visible") boolean visible);
    void updateVisibleStock(@Param("id") int id, @Param("quantite") int quantite);

}
