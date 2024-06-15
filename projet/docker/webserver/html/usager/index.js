document.addEventListener('DOMContentLoaded', function () {
    var keycloak;
    var productDetails = {};

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
            if (authenticated) {
                if (keycloak.hasRealmRole('client')) {
                    requestclient();
                    document.getElementById('user-role').textContent = 'Client';
                }
                if (keycloak.hasRealmRole('admin')) {
                    requestadmin();
                    document.getElementById('user-role').textContent = 'Admin';
                }
                updateCategorie();
            }
        }).catch(function (error) {
            console.error('Échec de l\'initialisation de Keycloak', error);
        });
    }

    // Requête pour le rôle client
    function requestclient() {
        axios.get("http://localhost:8888/api/client", {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        })
            .then(function (response) {
                console.log("Réponse: ", response.status);
            })
            .catch(function (error) {
                console.log('Rafraîchissement du token');
                keycloak.updateToken(5).then(function () {
                    console.log('Token rafraîchi');
                }).catch(function () {
                    console.log('Échec du rafraîchissement du token');
                })
            });
    }

    // Requête pour le rôle admin
    function requestadmin() {
        axios.get("http://localhost:8888/api/admin", {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        })
            .then(function (response) {
                console.log("Réponse: ", response.status);
            })
            .catch(function (error) {
                console.log('Rafraîchissement du token');
                keycloak.updateToken(5).then(function () {
                    console.log('Token rafraîchi');
                }).catch(function () {
                    console.log('Échec du rafraîchissement du token');
                })
            });
    }

    function logout() {
        // let logoutURL = "http://localhost:8080//realms/usager/protocol/openid-connect/logout"
        // window.location.href = logoutURL;
    }

    function updateCategorie() {
        const BarreCategorie = document.getElementById('BarreCategorie');
        if (!BarreCategorie) {
            console.error('BarreCategorie élément non trouvé');
            return;
        }
        BarreCategorie.innerHTML = "";
        axios.get("http://localhost:8888/api/getcategorie", {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        })
            .then(function (response) {
                console.log("Réponse: ", response.status);
                for (let i in response.data) {
                    const div = document.createElement('div'); // Créez une nouvelle division pour chaque catégorie
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
    }

    // Afficher les articles de la catégorie sélectionnée
    function showArticles(id_categorie) {
        const productContainer = document.getElementById("product-container");
        productContainer.innerHTML = "";
        axios.get("http://localhost:8888/api/selectarticle?id_categorie=" + id_categorie, {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        })
            .then(function (response) {
                console.log("Réponse: ", response.status);
                console.log(response.data);
                response.data.forEach(article => {
                    // Stocker les détails du produit dans l'objet global
                    productDetails[article.id] = {
                        name: article.nom,
                        price: article.prix + "$",
                        image: article.image || "images/Biere.png"
                    };
                    // Créez un objet produit correspondant à la structure attendue par generateProductHTML
                    const product = {
                        id: article.id,
                        image: article.image || "images/Biere.png",
                        name: article.nom,
                        price: article.prix + "$",
                        color: article.color || 'rgb(214,232,206)',
                        colorText: article.colorText || '3%'
                    };
                    // Ajoutez le HTML généré à BarreCategorie
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

    // Initialiser le bouton de retour en haut
    function initScrollToTop() {
        const scrollToTopButton = document.getElementById('scroll-to-top-button');

        scrollToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        function toggleScrollToTopButton() {
            console.log(window.scrollY);
            if (window.scrollY > 0) {
                scrollToTopButton.style.opacity = '1';
            } else {
                scrollToTopButton.style.opacity = '0';
            }
        }

        toggleScrollToTopButton();
        window.addEventListener('scroll', toggleScrollToTopButton);
    }

    // Générer le HTML pour un produit
    function generateProductHTML(product) {
        return `
            <div class="sf__col-item">
                <div class="sf__pcard sf__pcard--onsale cursor-pointer sf-prod__block sf__pcard-style-1" data-view="Panier">
                    <form method="post" action="/Panier/add" accept-charset="UTF-8" class="product-form form initialized" enctype="multipart/form-data" novalidate="novalidate" data-product-id="${product.image}" data-product-handle="">
                        <div class="sf__pcard-image">
                            <div class="overflow-hidden cursor-pointer relative sf__image-box">
                                <div class="flex justify-center items-center">
                                    <a href="${product.image}" data-gtag-selector="product_image" class="select_item_image block w-full">
                                        <div class="spc__main-img">
                                            <div data-image-id="" class="sf-image" data-image-wrapper="" data-image-loading="" style="--aspect-ratio: 3/4;">
                                                <img src="${product.image}" alt="Product Image">
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="sf__pcard-action hidden md:block z-10">
                                    <a class="sf__tooltip-item sf__btn-icon sf__tooltip-left sf__tooltip-style-1" data-product-handle="${product.image}" data-id="" data-fav-id="" data-fav-sku="" data-gtag-selector="wishlist" data-event-button="wish" type="button">
                                        <span class="sf__tooltip-icon block">
                                            <svg class="w-[20px] h-[20px]" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                <path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path>
                                            </svg>
                                        </span>
                                        <span class="sf__tooltip-content" data-revert-text="Remove from wishlist">Ajouter aux favoris</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="sf__pcard-content text-left">
                            <div class="mt-3 lg:mt-5">
                                <div class="flex items-start justify-between">
                                    <div class="flex flex-1 flex-wrap ProductColorShow" data-id="">
                                        <div class="sf__pcard-color-excess">
                                            <span class="block w-6 h-6 rounded-circle mr-4 mb-4" style="background-color: ${product.color}">${product.colorText}</span>
                                        </div>
                                    </div>
                                    <a onclick="changementProduit(${product.id}, 1)" type="button" class="sf-pqv__button mb-4">
                                        <svg class="w-[20px] h-[20px]" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="color:#000000;">
                                            <path d="M352 128C352 57.42 294.579 0 224 0 153.42 0 96 57.42 96 128H0v304c0 44.183 35.817 80 80 80h288c44.183 0 80-35.817 80-80V128h-96zM224 48c44.112 0 80 35.888 80 80H144c0-44.112 35.888-80 80-80zm176 384c0 17.645-14.355 32-32 32H80c-17.645 0-32-14.355-32-32V176h48v40c0 13.255 10.745 24 24 24s24-10.745 24-24v-40h160v40c0 13.255 10.745 24 24 24s24-10.745 24-24v-40h48v256z"></path>
                                        </svg>
                                    </a>
                                </div>
                                <div class="max-w-full w-full">
                                    <h3 class="block text-base">
                                        <a href="#" data-id="" data-gtag-selector="product_title" data-fav-id="" class="select_item_button block mb-[5px] leading-normal sf__pcard-name font-medium truncate-lines hover:text-color-secondary uppercase">
                                            ${product.name}
                                        </a>
                                    </h3>
                                </div>
                                <div class="sf__pcard-price leading-normal">
                                    <div class="product-prices inline-flex items-center flex-wrap">
                                        <span class="prod__price text-color-regular-price">
                                            <span class="money">
                                                <span class="transcy-money">${product.price}</span>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Gestionnaire pour le bouton du panier
    document.getElementById('panier-button').addEventListener('click', function() {
        var paniersection = document.getElementById('panier-section');
        if (paniersection.classList.contains('hidden')) {
            paniersection.classList.remove('hidden');
            paniersection.classList.add('visible');
            generatePanierHTML();
        } else {
            paniersection.classList.remove('visible');
            paniersection.classList.add('hidden');
        }
    });

    // Fonction pour récupérer les articles du panier depuis le localStorage
    function getCartItemsFromStorage() {
        const cartItemsJson = localStorage.getItem('cartItems');
        const cartItems = cartItemsJson ? JSON.parse(cartItemsJson) : [];
        // Filtrer les articles avec un identifiant null
        return cartItems.filter(item => item.idProduit !== null && item.idProduit !== undefined);
    }

    // Fonction pour sauvegarder les articles du panier dans le localStorage
    function saveCartItemsToStorage(cartItems) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Fonction pour supprimer un article du panier
    function removeFromCart(idProduit) {
        cartItems = cartItems.filter(item => item.idProduit !== idProduit);
        cleanCartItems();
        saveCartItemsToStorage(cartItems);
        generatePanierHTML(); // Mettre à jour le HTML après la suppression
    }

    // Fonction pour nettoyer les articles avec un identifiant null
    function cleanCartItems() {
        cartItems = cartItems.filter(item => item.idProduit !== null && item.idProduit !== undefined);
        saveCartItemsToStorage(cartItems);
    }

    // Initialiser les articles du panier depuis le localStorage
    let cartItems = getCartItemsFromStorage();
    cleanCartItems();

    // Fonction pour gérer les changements de quantité d'un produit
    window.changementProduit = function (idProduit, changement) {
        // Vérifier si l'idProduit est null ou undefined
        if (idProduit === null || idProduit === undefined) {
            console.warn("Produit avec un ID null ne peut pas être ajouté");
            return;
        }

        idProduit = parseInt(idProduit);

        const existingItem = cartItems.find(item => item.idProduit === idProduit);

        if (existingItem) {
            // Mettre à jour la quantité si le produit est déjà dans le panier
            existingItem.quantity += changement;
            if (existingItem.quantity < 1) {
                removeFromCart(existingItem.idProduit);
            }
        } else {
            // Ajouter le produit au panier avec la quantité spécifiée
            if (changement > 0) {
                cartItems.push({ idProduit, quantity: changement });
            }
        }

        cleanCartItems();
        console.log(cartItems);
        saveCartItemsToStorage(cartItems); // Assurez-vous de sauvegarder les articles après modification
        generatePanierHTML();
    }

    // Fonction pour générer le HTML du panier
    function generatePanierHTML() {
        const icalPanierContainer = document.getElementById('ical-panier');
        icalPanierContainer.innerHTML = '';

        if (cartItems.length === 0) {
            icalPanierContainer.innerHTML = 'Votre panier est actuellement vide.';
        } else {
            // Parcourir les articles du panier et générer le HTML pour chaque article
            cartItems.forEach(item => {
                const product = productDetails[item.idProduit]; // Utiliser les détails du produit stockés précédemment
                console.log("Produit dans le panier:", product); // Ajout de logs pour débogage

                // Vérifier si product est défini
                if (!product) {
                    console.warn(`Les détails du produit pour ID: ${item.idProduit} ne sont pas trouvés.`);
                    return;
                }

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');

                itemDiv.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 15px;">
                        <div style="width: 150px;">
                            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; margin-bottom: 10px;">
                        </div>
                        <div style="flex-grow: 1;">
                            <p style="margin: 0;">${product.name}</p>
                            <p style="margin: 0;">${product.price}</p>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <button class="button_img button_center" onclick="changementProduit(${item.idProduit}, -1)">-</button>
                            <p class="button_img button_center" style="margin: 0 10px;">${item.quantity}</p>
                            <button class="button_img button_center" onclick="changementProduit(${item.idProduit}, 1)">+</button>
                        </div>
                    </div>
                `;
                icalPanierContainer.appendChild(itemDiv);
            });
        }
    }

    // Initialiser l'horloge
    function initHorloge() {
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
    }

    // Initialiser la modale
    function initModal() {
        function openModal() {
            document.getElementById('ical').style.display = 'block';
            document.body.classList.add('modal-open');
            generatePanierHTML(); // Appeler generatePanierHTML pour mettre à jour la modale
        }

        function closeModal() {
            document.getElementById('ical').style.display = 'none';
            document.body.classList.remove('modal-open');
        }

        window.onclick = function(event) {
            if (event.target === document.getElementById('ical')) {
                closeModal();
            }
        }

        const cartButton = document.querySelector('a[data-event-button="panier-button"]');
        if (cartButton) {
            cartButton.addEventListener('click', function(event) {
                event.preventDefault();
                openModal();
            });
        }

        const closeModalButton = document.getElementById('close-modal-button');
        if (closeModalButton) {
            closeModalButton.addEventListener('click', function(event) {
                event.preventDefault();
                closeModal();
            });
        }

        const otherButtons = document.querySelectorAll('a[data-event-button]:not([data-event-button="panier-button"])');
        otherButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                event.preventDefault();
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
                    default:
                        console.log('Bouton inconnu cliqué');
                }
            });
        });
    }

    // Initialiser les fonctions
    initKeycloak();
    initScrollToTop();
    initHorloge();
    initModal();
    showArticles(1);
});
