package ca.usherbrooke.fgen.api.mapper;


import ca.usherbrooke.fgen.api.business.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategorieMapper {

    List<Item> select(@Param("description") String description);

    // Inserer un usager a la base de donne
    //void insertPerson(Person person);
    List<Item> allCategorie();
}