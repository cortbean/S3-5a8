package ca.usherbrooke.fgen.api.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;
import java.util.Map;

@Mapper
public interface StatistiqueMapper {
 @Select("SELECT * FROM projet.top5_produit")
 List<Map<String, Object>> getTop5Produit();

 @Select("SELECT * FROM projet.top5_programmes")
 List<Map<String, Object>> getTop5Programmes();
}
