package ca.usherbrooke.fgen.api.mapper;

import ca.usherbrooke.fgen.api.business.Commande;
import ca.usherbrooke.fgen.api.business.ProduitCommander;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommandeMapper {

    void insertCommande(@Param("commande") Commande commande);

    void insertProduit(@Param("produitCommander") ProduitCommander produitCommander);

    @Select("SELECT nextval('projet.commande_id_seq')")
    String getNextCommandeId();

    Commande selectCommande(@Param("idCommande") String idCommande);

    List<ProduitCommander> selectFromCommandeProduits(@Param("idCommande") String idCommande);

    void insertIntoCommandeVueAdmin(@Param("idCommande") String idCommande);
}