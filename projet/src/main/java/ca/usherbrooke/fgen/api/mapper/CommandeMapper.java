package ca.usherbrooke.fgen.api.mapper;

import ca.usherbrooke.fgen.api.business.Commande;
import ca.usherbrooke.fgen.api.business.Person;
import ca.usherbrooke.fgen.api.business.ProduitCommander;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommandeMapper {

    void insertCommande(@Param("commande") Commande commande);

    void insertProduit(@Param("produitCommander") ProduitCommander produitCommander);

    void insertIntoCommandeVueAdmin(@Param("idCommande") String idCommande);

    void markAsCompleted(@Param("idCommande") String idCommande);

    Commande selectCommandeDetails(@Param("idCommande") String idCommande);

    List<ProduitCommander> selectFromCommandeProduits(@Param("idCommande") String idCommande);

    List<Commande> selectAllCommandesWithProduits();

    Person selectPersonDetails(@Param("cip") String cip);

    ProduitCommander selectProductDetails(@Param("idProduit") int idProduit);
}
