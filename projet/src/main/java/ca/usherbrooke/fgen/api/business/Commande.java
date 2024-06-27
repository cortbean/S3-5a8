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
}

