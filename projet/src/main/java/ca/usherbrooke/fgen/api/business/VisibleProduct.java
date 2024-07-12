package ca.usherbrooke.fgen.api.business;


public class VisibleProduct {
    private int idProduit;
    public String nom;
    public float prix;
    public String image;
    private int quantite;

    // Getters and setters
    public int getIdProduit() {
        return idProduit;
    }

    public void setIdProduit(int idProduit) {
        this.idProduit = idProduit;
    }

    public int getQuantite() {
        return quantite;
    }

    public void setQuantite(int quantite) {
        this.quantite = quantite;
    }
}
