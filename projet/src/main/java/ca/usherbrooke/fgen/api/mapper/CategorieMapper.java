package ca.usherbrooke.fgen.api.mapper;


import ca.usherbrooke.fgen.api.business.Item;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategorieMapper {

    List<Item> allCategorie();
}