var keycloak;
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
    const BarreCategorie = document.getElementById('BarreCategorie');
    BarreCategorie.innerHTML = "";
    axios.get("http://localhost:8888/api/getcategorie", {
        headers: {
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(function (response) {
            console.log("Response: ", response.status);
            for (let i in response.data) {
                const button = document.createElement('button'); // Créez une nouvelle division pour chaque catégorie
                button.textContent = response.data[i].nom;
                button.addEventListener('click', function() {
                    showArticles(response.data[i].id);
                });
                BarreCategorie.appendChild(button);
            }
        })
        .catch(function (error) {
            console.log('Erreur: ', error);
            keycloak.updateToken(5).then(function () {
                console.log('Token rafraîchi');
                updateCategorie();
            }).catch(function () {
                console.log('Échec du rafraîchissement du token');
            });
        });
}

function showArticles(id_categorie) {
    const BarreCategorie = document.getElementById('BarreCategorie');
    BarreCategorie.innerHTML = "";
    axios.get("http://localhost:8888/api/selectarticle?id_categorie=" + id_categorie, {
        headers: {
            'Authorization': 'Bearer ' + keycloak.token
        }
    })
        .then(function (response) {
            console.log("Response: ", response.status);
            console.log(response.data);
            for (let i in response.data) {
                const div = document.createElement('div'); // Créez une nouvelle division pour chaque article
                div.className = 'sf-header__mobile_item';
                div.textContent = response.data[i].nom;
                console.log(response.data[i].nom);
                div.addEventListener('click', function() {
                    // Appelez votre fonction JavaScript ici
                });
                BarreCategorie.appendChild(div);
            }
        })
        .catch(function (error) {
            console.log('Erreur: ', error);
            keycloak.updateToken(5).then(function () {
                console.log('Token rafraîchi');
                showArticles(id_categorie);
            }).catch(function () {
                console.log('Échec du rafraîchissement du token');
            });
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const scrollToTopButton = document.getElementById('scroll-to-top-button');

    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    function toggleScrollToTopButton() {
        console.log(window.scrollY);
        if (window.scrollY > 0) { // Vérifie si la position de défilement verticale est supérieure à zéro
            scrollToTopButton.style.opacity = '1'; // Affiche le bouton
        } else {
            scrollToTopButton.style.opacity = '0'; // Masque le bouton
        }
    }
    toggleScrollToTopButton();
    window.addEventListener('scroll', toggleScrollToTopButton);
});