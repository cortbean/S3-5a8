package ca.usherbrooke.fgen.api.test;

import ca.usherbrooke.fgen.api.business.Commande;
import ca.usherbrooke.fgen.api.business.Item;
import ca.usherbrooke.fgen.api.mapper.ArticleMapper;
import ca.usherbrooke.fgen.api.mapper.CategorieMapper;
import ca.usherbrooke.fgen.api.mapper.PersonMapper;
import ca.usherbrooke.fgen.api.service.CommandeService;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;


public class test {
    public static void main(String[] args){
        Commande commande = new Commande();
        commande.setIdCommande("1");
        commande.dateCommande = LocalDateTime.now();
        commande.cip = "mahf0901";













    }

}
