package ca.usherbrooke.fgen.api.mapper;


import ca.usherbrooke.fgen.api.business.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ArticleMapper {

    List<Item> selectArticle(@Param("id_categorie") String id_categorie);
}