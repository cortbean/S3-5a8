
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
    let keycloak;
    // Initialiser Keycloak
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

                if (keycloak.hasRealmRole('admin')) {
                    //fetchstatistique();
                    fetchTop5Produit();
                    fetchTop5Programmes();
                    /*requestadmin();
                    document.getElementById('user-role').textContent = 'Admin';*/
                } else if (keycloak.hasRealmRole('client')) {
                    window.location.href = '../../'; // Redirige vers la page client
                }
        }).catch(function (error) {
            console.error('Échec de l\'initialisation de Keycloak', error);
        });
    }
        // Fetch statistics from API
    function fetchstatistique() {
        console.log('Fetching statistics...');
        axios.get('http://localhost:8888/api/stats/produits-faculte', {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        })
            .then(response => {
                console.log('Response received from API:', response); // Log the entire response
                console.log('Response status:', response.status); // Log the response status
                const data = response.data;
                console.log('Data received:', data); // Log the data received
                const tableBody = document.getElementById('statsTable').getElementsByTagName('tbody')[0];
                console.log('Table body found:', tableBody); // Log if table body is found
                data.forEach(stat => {
                    console.log('Processing stat:', stat); // Log each stat object
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
                console.log('Rafraîchissement du token');
                keycloak.updateToken(5).then(function () {
                    console.log('Token rafraîchi');
                }).catch(function () {
                    console.log('Échec du rafraîchissement du token');
                });
                console.error('Error fetching statistics:', error); // Log any errors
            });

    }
    function fetchTop5Programmes() {
        axios.get('http://localhost:8888/api/stats/top-programmes', {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        })
            .then(response => {
                const data = response.data;
                const tableBody = document.getElementById('topProgrammesTable').getElementsByTagName('tbody')[0];
                data.forEach(stat => {
                    const row = tableBody.insertRow();
                    const programmeCell = row.insertCell(0);
                    const nombreCommandesCell = row.insertCell(1);

                    programmeCell.textContent = stat.programme;
                    nombreCommandesCell.textContent = stat.nombre_commandes;
                });
            })
            .catch(error => {
                    console.log('Rafraîchissement du token');
                    keycloak.updateToken(5).then(function () {
                        console.log('Token rafraîchi');
                    }).catch(function () {
                        console.log('Échec du rafraîchissement du token');
                    });
                    console.error('Error fetching statistics:', error); // Log any errors
                });
                console.error('Erreur lors de la récupération des statistiques des programmes:', error);

}

function fetchTop5Produit() {
    axios.get('http://localhost:8888/api/stats/top-produit', {
        headers: {
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(response => {
            const data = response.data;
            const tableBody = document.getElementById('topProduitTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';  // Clear existing rows
            data.forEach(stat => {
                const row = tableBody.insertRow();
                const produitCell = row.insertCell(0);
                const nombreCommandesCell = row.insertCell(1);

                produitCell.textContent = stat.produit_nom;
                nombreCommandesCell.textContent = stat.total_quantite;
            });
        })
        .catch(error => {
            console.log('Rafraîchissement du token');
            keycloak.updateToken(5).then(function () {
                console.log('Token rafraîchi');
            }).catch(function () {
                console.log('Échec du rafraîchissement du token');
            });
            console.error('Error fetching statistics:', error); // Log any errors
        });
}


    initKeycloak();
});
