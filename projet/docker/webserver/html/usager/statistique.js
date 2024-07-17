document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
    let keycloak;
    function initKeycloak() {
        keycloak = new Keycloak({
            "realm": "usager",
            "auth-server-url": "http://localhost:8180/",
            "ssl-required": "external",
            "clientId": "frontend",
            "public-client": true,
            "confidential-port": 0
        });
        keycloak.init({ onLoad: 'login-required' }).then(function (authenticated) {
            console.log(authenticated ? 'authenticated' : 'not authenticated');
            if (authenticated) {
                if (keycloak.hasRealmRole('admin')) {
                    requestadmin();
                    document.getElementById('user-role').textContent = 'Admin';
                } else if (keycloak.hasRealmRole('client')) {
                    window.location.href = 'index.html'; // Redirige vers la page client
                }
                updateCategorie();
            }
        }).catch(function (error) {
            console.error('Échec de l\'initialisation de Keycloak', error);
        });
    }

    axios.get('http://localhost:8888/api/stats/produits-faculte')
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
