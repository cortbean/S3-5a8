document.addEventListener("DOMContentLoaded", function() {
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
        keycloak.init({ onLoad: 'login-required' }).then(function (authenticated) {
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
    initKeycloak(); // Initialiser Keycloak au chargement de la page


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
        // let logoutURL = "http://localhost:8080//realms/usager/protocol/openid-connect/logout"
        // window.location.href = logoutURL;
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
                    const div = document.createElement('button'); // Créez une nouvelle division pour chaque catégorie
                    div.className = 'sf-header__mobile_item';
                    div.textContent = response.data[i].nom;
                    div.addEventListener('click', function() {
                        showArticles(response.data[i].id);
                    });
                    BarreCategorie.appendChild(div);
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

        // Ajoutez la logique pour afficher ou cacher la section en fonction de l'événement du clic sur le bouton "Bière"
        const annonceSection = document.querySelector('.CollectionProductGrid');
        annonceSection.style.display = 'none'; // Cachez la section par défaut

        const boutonBiere = document.querySelector('button'); // Sélectionne le premier bouton dans le document
        boutonBiere.addEventListener('click', function() {
            annonceSection.style.display = 'block'; // Affichez la section lorsque le bouton "Bière" est cliqué
        });
    }

    function showArticles(id_categorie) {
        const productContainer = document.getElementById("product-container");
        productContainer.innerHTML = "";
        axios.get("http://localhost:8888/api/selectarticle?id_categorie=" + id_categorie, {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        })
            .then(function (response) {
                console.log("Response: ", response.status);
                console.log(response.data);
                response.data.forEach(article => {
                    // Create a product object that matches the structure expected by generateProductHTML
                    const product = {
                        image: article.image || "images/Biere.png",
                        name: article.nom,
                        price: article.prix + "$",
                        color: article.color || 'rgb(214,232,206)',
                        colorText: article.colorText || '3%'
                    };
                    // Append the generated HTML to BarreCategorie
                    productContainer.innerHTML += generateProductHTML(product);
                });
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

    function generateProductHTML(product) {
        return `
        <div class="sf__col-item">
                <div data-view="Panier">
                            <div class="overflow-hidden relative">
                                <div class="flex justify-center items-center">
                                    <a href="#" data-gtag-selector="product_image">
                                            <div data-image-id=""  data-image-wrapper="" data-image-loading="" style="--aspect-ratio: 3/4;">
                                                <img class="sf-image" src="${product.image}" alt="Product Image">
                                            </div>
                                    </a>
                                </div>
                            </div>
                        </div>
    
                        <div>
                                <div class="fl-panier">
                                    <p class="panier-text" style="background-color: ${product.color}">
                                        ${product.colorText}
                                    </p>
                                    <div data-id="" data-fav-id="" data-fav-sku="" data-product-url="" data-product-handle="">
                                        <svg class="button_img" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="color:#000000;">
                                            <path d="M352 128C352 57.42 294.579 0 224 0 153.42 0 96 57.42 96 128H0v304c0 44.183 35.817 80 80 80h288c44.183 0 80-35.817 80-80V128h-96zM224 48c44.112 0 80 35.888 80 80H144c0-44.112 35.888-80 80-80zm176 384c0 17.645-14.355 32-32 32H80c-17.645 0-32-14.355-32-32V176h48v40c0 13.255 10.745 24 24 24s24-10.745 24-24v-40h160v40c0 13.255 10.745 24 24 24s24-10.745 24-24v-40h48v256z"></path>
                                        </svg>
                                    </div>
                                </div>
                                
                                <a href="#" class="panier-text"> ${product.name} </a>
    
                                <p class="panier-text">${product.price}</p>
                        </div>
                    </form>
                </div>
            </div>
    `;
    }

    document.getElementById('panier-button').addEventListener('click', function() {
        var paniersection = document.getElementById('panier-section');
        if (paniersection.classList.contains('hidden')) {
            paniersection.classList.remove('hidden');
            paniersection.classList.add('visible');
        } else {
            paniersection.classList.remove('visible');
            paniersection.classList.add('hidden');
        }
    });
});

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

document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour afficher le tiroir du panier
    function showCartDrawer() {
        document.getElementById('cart-drawer-container').classList.remove('hidden');
    }

    // Fonction pour masquer le tiroir du panier
    function hideCartDrawer() {
        document.getElementById('cart-drawer-container').classList.add('hidden');
    }

    // Fonction pour gérer les clics des boutons
    function handleButtonClick(event) {
        event.preventDefault(); // Prévenir le comportement par défaut du lien
        const buttonType = event.currentTarget.getAttribute('data-event-button');

        switch(buttonType) {
            case 'wish-count':
                console.log('Bouton de souhait cliqué');
                alert('Article ajouté à votre liste de souhaits !');
                break;
            case 'account':
                console.log('Bouton de compte cliqué');
                alert('Tentative de connexion !');
                break;
            case 'cart':
                console.log('Bouton de panier cliqué');
                showCartDrawer(); // Afficher le tiroir du panier
                break;
            default:
                console.log('Bouton inconnu cliqué');
        }
    }

    // Sélectionner tous les boutons avec l'attribut data-event-button
    const buttons = document.querySelectorAll('a[data-event-button]');

    // Ajouter un événement 'click' à chaque bouton
    buttons.forEach(function(button) {
        button.addEventListener('click', handleButtonClick);
    });

    // Ajouter un événement 'click' à l'icône de fermeture du tiroir du panier
    const closeIcon = document.getElementById('close-cart-drawer');
    if (closeIcon) {
        closeIcon.addEventListener('click', function(event) {
            hideCartDrawer(); // Masquer le tiroir du panier
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    function getTime() {
        const now = new Date();
        const heures = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const secondes = String(now.getSeconds()).padStart(2, '0');
        return `${heures}:${minutes}:${secondes}`;
    }

    function afficherHeure() {
        const horloge = document.getElementById('horloge');
        horloge.textContent = getTime();
    }
    afficherHeure();
    setInterval(afficherHeure, 1000);

    function getTimeDifference() {
        const now = new Date();
        const tutoratFin = getNextTutoratTimeStamp();

        const difference = tutoratFin - now;

        if (difference > 86400000) {
            const heures = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) /(1000 * 60));
            const secondes = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('time_difference').textContent =
                `${heures} heures, ${minutes} minutes, ${secondes} secondes`;
        }
        else {
            document.getElementById('submit_exchange_button_id').disabled = true;
            document.getElementById('submit_exchange_button_id').classList.add('disabled');

            if (difference > 0) {
                const heures = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) /(1000 * 60));
                const secondes = Math.floor((difference % (1000 * 60)) / 1000);

                document.getElementById('time_difference').textContent =
                    `${heures} heures, ${minutes} minutes, ${secondes} secondes`;
            }
        }
    }

    getTimeDifference();
    function submitExchangeRequest() {
        alert("Request submitted");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartModal = document.getElementById('close-cart-modal');

    console.log('DOM fully loaded and parsed');
    console.log('cartIcon:', cartIcon);
    console.log('cartModal:', cartModal);
    console.log('closeCartModal:', closeCartModal);

    if (cartIcon && cartModal && closeCartModal) {
        cartIcon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('Cart icon clicked');
            cartModal.classList.remove('hidden');
        });

        closeCartModal.addEventListener('click', function () {
            console.log('Close cart modal clicked');
            cartModal.classList.add('hidden');
        });

        // Fermer le modal en cliquant en dehors de celui-ci
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                cartModal.classList.add('hidden');
            }
        });
    } else {
        console.log('One or more elements are missing');
    }
});




