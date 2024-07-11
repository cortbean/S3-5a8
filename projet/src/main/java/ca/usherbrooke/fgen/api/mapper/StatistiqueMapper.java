package ca.usherbrooke.fgen.api.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;
import java.util.Map;

@Mapper
public interface StatistiqueMapper {
   // @Select("SELECT * FROM projet.statistique_par_faculte")
    List<Map<String, Object>> getStatistiqueParFaculte();
}
