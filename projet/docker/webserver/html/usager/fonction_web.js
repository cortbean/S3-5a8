var keycloak;
let idCommande = ''; // Variable to store the idCommande
function initKeycloak() {
    keycloak = new Keycloak({
        "realm": "usager",
        "auth-server-url": "http://localhost:8180/",
        "ssl-required": "external",
        "clientId": "frontend",
        "public-client": true,
        "confidential-port": 0
    });
    keycloak.init({onLoad: 'login-required'}).then(function (authenticated) {
        console.log(authenticated ? 'authenticated' : 'not authenticated');
        if (authenticated) {
            if (keycloak.hasRealmRole('client')) {
                requestclient();
            }
            if (keycloak.hasRealmRole('admin')) {
                requestadmin();
            }
            updateCategorie();
        }
    }).catch(function (error) {
        console.error('Failed to initialize Keycloak', error);
    });
}

function requestclient() {
    axios.get("http://localhost:8888/api/client", {
        headers: {
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(function (response) {
            console.log("Response: ", response.status);
        })
        .catch(function (error) {
            console.log('refreshing');
            keycloak.updateToken(5).then(function () {
                console.log('Token refreshed');
            }).catch(function () {
                console.log('Failed to refresh token');
            })
        });
}

function requestadmin() {
    axios.get("http://localhost:8888/api/admin", {
        headers: {
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(function (response) {
            console.log("Response: ", response.status);
        })
        .catch(function (error) {
            console.log('refreshing');
            keycloak.updateToken(5).then(function () {
                console.log('Token refreshed');
            }).catch(function () {
                console.log('Failed to refresh token');
            })
        });
}

function logout() {
    //   let logoutURL = "http://localhost:8080//realms/usager/protocol/openid-connect/logout"
    //   window.location.href = logoutURL;
}

function updateCategorie() {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = "";
    axios.get("http://localhost:8888/api/getcategorie", {
        headers: {
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(function (response) {
            console.log("Response: ", response.status);
            for (let i in response.data) {
                const button = document.createElement('button');
                button.className = 'grid-item'; // Set the class name
                button.textContent = response.data[i].nom; // Set the text content
                button.addEventListener('click', function() {
                    // Call your JavaScript function here
                    showArticles(response.data[i].id)
                });
                gridContainer.appendChild(button); // Append the button to the container
            }
        })
        .catch(function (error) {
            console.log('refreshing');
            keycloak.updateToken(5).then(function () {
                console.log('Token refreshed');
            }).catch(function () {
                console.log('Failed to refresh token');
            })
        });
}

function showArticles(id_categorie) {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = "";
    axios.get("http://localhost:8888/api/selectarticle?id_categorie=" + id_categorie, {
        headers: {
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(function (response) {
            console.log("Response: ", response.status);
            console.log(response.data)
            for (let i in response.data) {
                const button = document.createElement('button');
                button.className = 'grid-item'; // Set the class name
                button.textContent = response.data[i].nom; // Set the text content
                console.log(response.data[i].nom)
                button.addEventListener('click', function () {
                    // Call your JavaScript function here
                });
                gridContainer.appendChild(button); // Append the button to the container
            }
        })
        .catch(function (error) {
            console.log('refreshing');
            keycloak.updateToken(5).then(function () {
                console.log('Token refreshed');
            }).catch(function () {
                console.log('Failed to refresh token');
            })
        });
}

function AjoutCommande() {
    axios.get("http://localhost:8888/api/IdCommande", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(response => {
            idCommande = response.data; // Store the idCommande in the variable
            document.getElementById('result').innerText = 'Commande ID: ' + idCommande;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function AjoutProduit() {
    if (!idCommande) {
        alert('Please create a Commande first.');
        return;
    }

    const idProduit = Math.floor(Math.random() * 10) + 1; // Example product ID
    const quantite = Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10

    axios.get(`http://localhost:8888/api/addProduit?idProduit=${idProduit}&idCommande=${idCommande}&quantite=${quantite}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(response => {
            const data = response.data;
            document.getElementById('result').innerText += `\nProduit ajouté: ${data.idProduit}, Quantité: ${data.quantite}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
