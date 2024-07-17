document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
    fetch('/api/stats/produits-faculte')
        .then(response => {
            console.log('API response received');
            return response.json();
        })
        .then(data => {
            console.log('Data parsed as JSON:', data);
            const tableBody = document.getElementById('statsTable').getElementsByTagName('tbody')[0];
            console.log('Table body found:', tableBody);
            data.forEach(stat => {
                console.log('Processing stat:', stat);
                const row = tableBody.insertRow();
                const produitCell = row.insertCell(0);
                const faculteCell = row.insertCell(1);
                const nombreCommandesCell = row.insertCell(2);

                produitCell.textContent = stat.produit_nom;
                faculteCell.textContent = stat.faculte;
                nombreCommandesCell.textContent = stat.nombre_commandes;
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des statistiques:', error);
        });
});
