package ca.usherbrooke.fgen.api.business;

import java.util.List;
import java.time.LocalDateTime;

// définit la date et le Id commande de l'usager qui utilise le site

public class Commande {
    public String idCommande;
    public LocalDateTime dateCommande;
    public String cip;



    public String getIdCommande() {
        return idCommande;
    }
    public void setIdCommande(String idCommande) {
        this.idCommande = idCommande;
    }



}