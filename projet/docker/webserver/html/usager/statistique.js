document.addEventListener('DOMContentLoaded', function () {
    // Fonction pour récupérer les statistiques des produits par faculté
    function fetchStats() {
        fetch('/api/stats/produits-faculte')
            .then(response => response.json())
            .then(data => {
                console.log("Données reçues : ", data);
                const tableBody = document.getElementById('stats-table').getElementsByTagName('tbody')[0];
                data.forEach(stat => {
                    const row = tableBody.insertRow();
                    const produitCell = row.insertCell(0);
                    const faculteCell = row.insertCell(1);
                    const nombreCommandesCell = row.insertCell(2);

                    produitCell.textContent = stat.produit_nom;
                    faculteCell.textContent = stat.faculte;
                    nombreCommandesCell.textContent = stat.nombre_commandes;
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des statistiques :', error));


        // Appeler la fonction fetchStats lors du chargement de la page
        fetchStats();
    }
});
