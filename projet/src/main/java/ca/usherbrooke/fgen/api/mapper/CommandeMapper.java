package ca.usherbrooke.fgen.api.mapper;

import ca.usherbrooke.fgen.api.business.Commande;
import ca.usherbrooke.fgen.api.business.CommandeView;
import ca.usherbrooke.fgen.api.business.Produit;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
@Mapper
public interface CommandeMapper {

    List<Commande> select(@Param("Idcommande") String Idcommande,
                          @Param("datecommande") String datecommande,
                          @Param("cip") String cip);

    // Inserer une command et un produit a la base de donne
    void insertCommande(@Param("commande") Commande commande);
    void insertProduit(@Param("produit") Produit produit);

    // aller chercher la prochaine commande dans la base de donnee
    @Select("SELECT nextval('projet.commande_id_seq')")
    String getNextCommandeId();

    // Aller chercher une commande
    Commande selectCommande(@Param("idCommande") String idCommande);

    // Select from commande_produits view
    List<CommandeView> selectFromCommandeProduits(@Param("idCommande") String idCommande);

    void insertIntoCommandeVueAdmin(@Param("idCommande") String idCommande);
}
