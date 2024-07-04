package ca.usherbrooke.fgen.api.business;

import java.math.BigDecimal;

public class ProduitCommander {
    public int idProduit;
    public String idCommande;
    public int quantite;
    public String nomProduit;
    public BigDecimal PrixProduit;

    // Ajoutez une méthode toString pour faciliter le débogage
    @Override
    public String toString() {
        return "ProduitCommander{" +
                "idProduit=" + idProduit +
                ", idCommande='" + idCommande + '\'' +
                ", quantite=" + quantite +
                ", nomProduit='" + nomProduit + '\'' +
                ", PrixProduit=" + PrixProduit +
                '}';
    }
}
