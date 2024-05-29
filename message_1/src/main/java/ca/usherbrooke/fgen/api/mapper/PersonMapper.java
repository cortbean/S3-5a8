package ca.usherbrooke.fgen.api.mapper;

import ca.usherbrooke.fgen.api.business.Person;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import javax.print.DocFlavor;
import java.util.List;

@Mapper
public interface PersonMapper {
    List<Person> select(@Param("cip") String cip,
                        @Param("first_name") String last_name,
                        @Param("email") String email);

    // Inserer un usager a la base de donne
    //void insertPerson(Person person);
    void insertPerson(@Param("person") Person person);
    // Aller chercher un usager
    Person selectPerson(@Param("cip") String cip);

}
