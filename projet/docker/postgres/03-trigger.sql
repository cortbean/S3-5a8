-- trigger pour écrire les logs
CREATE TRIGGER programme_log
    AFTER INSERT OR UPDATE OR DELETE ON projet.Programme
    FOR EACH ROW EXECUTE FUNCTION projet.log_changes();

CREATE TRIGGER commande_log
    AFTER INSERT OR UPDATE OR DELETE ON projet.commande
    FOR EACH ROW EXECUTE FUNCTION projet.log_changes();

CREATE TRIGGER categorie_log
    AFTER INSERT OR UPDATE OR DELETE ON projet.Categorie
    FOR EACH ROW EXECUTE FUNCTION projet.log_changes();

CREATE TRIGGER utilisateur_log
    AFTER INSERT OR UPDATE OR DELETE ON projet.Utilisateur
    FOR EACH ROW EXECUTE FUNCTION projet.log_changes();

CREATE TRIGGER produit_log
    AFTER INSERT OR UPDATE OR DELETE ON projet.Produit
    FOR EACH ROW EXECUTE FUNCTION projet.log_changes();

CREATE TRIGGER plusieurs_log
    AFTER INSERT OR UPDATE OR DELETE ON projet.plusieurs
    FOR EACH ROW EXECUTE FUNCTION projet.log_changes();

-- trigger pour faire les commandes
CREATE TRIGGER trigger_update_stock_on_insert
    AFTER INSERT ON projet.Plusieurs
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_on_insert();
