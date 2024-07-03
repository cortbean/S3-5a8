package ca.usherbrooke.fgen.api.business;

import javax.json.bind.annotation.JsonbDateFormat;
import java.time.LocalDateTime;
import java.util.List;

public class Commande {
    public String idCommande;
    public String cip;

    @JsonbDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    public LocalDateTime dateCommande;
    public List<ProduitCommander> produits;
    public String status;

    // Ajoutez une méthode toString pour faciliter le débogage
    @Override
    public String toString() {
        return "Commande{" +
                "idCommande='" + idCommande + '\'' +
                ", cip='" + cip + '\'' +
                ", dateCommande=" + dateCommande +
                ", produits=" + produits +
                ", status='" + status + '\'' +
                '}';
    }
}
