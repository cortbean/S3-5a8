package ca.usherbrooke.fgen.api.business;

public class Item {
    public String id;
    public String nom;
    public float prix;
    public String image;
    public int quantiteStock;
    public boolean visible;

    @Override
    public String toString() {
        return "Item{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", prix=" + prix +
                ", image='" + image + '\'' +
                '}';
    }
}
