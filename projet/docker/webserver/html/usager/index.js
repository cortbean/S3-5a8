document.addEventListener('DOMContentLoaded', function () {
    let keycloak;
    let cartItems = getCartItemsFromCookie();
    const productDetails = {};

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
                    requestClient();
                    document.getElementById('user-role').textContent = 'Client';
                } else if (keycloak.hasRealmRole('admin')) {
                    window.location.href = 'admin.html'; // Redirige vers la page admin
                }
                updateCategorie();
                fetchVisibleProducts("Cocktail");
            }
        }).catch(function (error) {
            console.error('Échec de l\'initialisation de Keycloak', error);
        });
    }

    // Fonction pour s'assurer que le token est valide
    function ensureToken(callback) {
        if (keycloak.token) {
            keycloak.updateToken(5).then(callback).catch(function() {
                console.error('Échec du rafraîchissement du token');
            });
        } else {
            console.error('Pas de token Keycloak disponible');
        }
    }

    // Requête pour le rôle client
    function requestClient() {
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

    // Récupérer les produits visibles
    function fetchVisibleProducts(id_categorie) {
        const productContainer = document.getElementById("product-container");
        productContainer.innerHTML = "";
        axios.get("http://localhost:8888/api/showVisibleProducts?id_categorie=" + id_categorie, {
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
                    // Ajoutez le HTML généré à productContainer
                    productContainer.innerHTML += generateProductHTML(product);
                });

            })
            .catch(function (error) {
                console.log('Erreur: ', error);
                keycloak.updateToken(5).then(function () {
                    console.log('Token rafraîchi');
                    fetchVisibleProducts(id_categorie);
                }).catch(function () {
                    console.log('Échec du rafraîchissement du token');
                });
            });
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
                        fetchVisibleProducts(response.data[i].id);
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

    // Initialiser le bouton de retour en haut
    function initScrollToTopClient() {
        const scrollToTopButtonClient = document.getElementById('scroll-to-top-button');

        scrollToTopButtonClient.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        function toggleScrollToTopButton() {
            console.log(window.scrollY);
            if (window.scrollY > 0) {
                scrollToTopButtonClient.style.opacity = '1';
            } else {
                scrollToTopButtonClient.style.opacity = '0';
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
                                <div class="sf__pcard-action hidden md:block z-10"></div>
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

    // Fonction pour ajouter un produit au panier
    function addToCart(idProduit) {
        if (!productDetails[idProduit]) {
            console.warn(`Produit avec ID ${idProduit} n'existe pas dans les détails du produit.`);
            return;
        }

        const cartItems = getCartItemsFromCookie();
        const existingItem = cartItems.find(item => item.idProduit === idProduit);
        if (!existingItem) {
            cartItems.push({ idProduit, quantity: 1 });
        } else {
            existingItem.quantity++;
        }
        setCookieClient('cartItems', cartItems, 7);
        updateCartCount();
        generatePanierHTML();
    }

    // Fonction pour retirer un produit du panier
    function removeFromCart(idProduit) {
        let cartItems = getCartItemsFromCookie();
        cartItems = cartItems.filter(item => item.idProduit !== idProduit);
        setCookieClient('cartItems', cartItems, 7);
        updateCartCount();
        generatePanierHTML();
    }

    // Gestionnaire pour le bouton du panier
    document.getElementById('panier-button').addEventListener('click', function() {
        const paniersectionClient = document.getElementById('panier-section');
        if (paniersectionClient.classList.contains('hidden')) {
            paniersectionClient.classList.remove('hidden');
            paniersectionClient.classList.add('visible');
            generatePanierHTML();
        } else {
            paniersectionClient.classList.remove('visible');
            paniersectionClient.classList.add('hidden');
        }
    });

    // Fonction pour récupérer les articles du panier depuis les cookies
    function getCartItemsFromCookie() {
        const cartItems = getCookieClient('cartItems');
        return cartItems ? cartItems : [];
    }

    // Fonction pour sauvegarder les articles du panier dans les cookies
    function setCookieClient(name, value, days) {
        const dateClient = new Date();
        dateClient.setTime(dateClient.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + dateClient.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

    function getCookieClient(name) {
        const nameEQClient = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQClient) === 0) return JSON.parse(c.substring(nameEQClient.length, c.length));
        }
        return null;
    }

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
            existingItem.quantity += changement;
            if (existingItem.quantity < 1) {
                // Supprimer le produit du panier si la quantité est inférieure à 1
                cartItems = cartItems.filter(item => item.idProduit !== idProduit);
            }
        } else if (changement > 0) {
            cartItems.push({ idProduit, quantity: changement });
        }

        setCookieClient('cartItems', cartItems, 7);
        updateCartCount();
        generatePanierHTML();
    }

    // Fonction pour générer le HTML du panier
    function generatePanierHTML(successMessage) {
        const icalPanierContainer = document.getElementById('ical-panier');
        icalPanierContainer.innerHTML = '';

        const cartItems = getCartItemsFromCookie();
        if (cartItems.length === 0) {
            icalPanierContainer.innerHTML = successMessage ? successMessage : 'Votre panier est actuellement vide.';
        } else {
            cartItems.forEach(item => {
                const product = productDetails[item.idProduit];
                if (!product) {
                    console.warn(`Les détails du produit pour l'ID: ${item.idProduit} ne sont pas trouvés.`);
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
                        <p style="margin: 0;">${item.idProduit}</p>
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
        updateSubtotal();
    }

    // Fonction pour mettre à jour le sous-total avec la taxe
    function updateSubtotal() {
        const cartItems = getCartItemsFromCookie();
        const subtotal = cartItems.reduce((total, item) => {
            const product = productDetails[item.idProduit];
            if (product) {
                return total + (parseFloat(product.price.replace('$', '')) * item.quantity);
            }
            return total;
        }, 0);
        const taxRate = 0.15; // 15% taxe
        const totalWithTax = subtotal * (1 + taxRate);
        const subtotalElement = document.getElementById('cart-subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = `Sous-total (avec taxe de 15%) : ${totalWithTax.toFixed(2)} $`;
        }
    }

    // Fonction pour mettre à jour le compteur du panier
    function updateCartCount() {
        const cartItems = getCartItemsFromCookie();
        const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('sup[data-cart-count]');
        if (cartCount > 0) {
            cartCountElement.classList.remove('!hidden');
            cartCountElement.textContent = cartCount;
        } else {
            cartCountElement.classList.add('!hidden');
            cartCountElement.textContent = '0';
        }
    }

    // Initialiser l'horloge
    function initHorlogeClient() {
        function getTimeClient() {
            const now = new Date();
            const heures = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const secondes = String(now.getSeconds()).padStart(2, '0');
            return `${heures}:${minutes}:${secondes}`;
        }

        function afficherHeure() {
            const horloge = document.getElementById('horloge');
            horloge.textContent = getTimeClient();
        }

        afficherHeure();
        setInterval(afficherHeure, 1000);
    }

    // Initialiser la modale
    function initModal() {
        function openModalClient() {
            document.getElementById('ical').style.display = 'block';
            document.body.classList.add('modal-open');
            generatePanierHTML(); // Appeler generatePanierHTML pour mettre à jour la modale
        }

        function closeModalClient() {
            document.getElementById('ical').style.display = 'none';
            document.body.classList.remove('modal-open');
        }

        window.onclick = function(event) {
            if (event.target === document.getElementById('ical')) {
                closeModalClient();
            }
        }

        const cartButton = document.querySelector('a[data-event-button="panier-button"]');
        if (cartButton) {
            cartButton.addEventListener('click', function(event) {
                event.preventDefault();
                openModalClient();
            });
        }

        const closeModalButton = document.getElementById('close-modal-button');
        if (closeModalButton) {
            closeModalButton.addEventListener('click', function(event) {
                event.preventDefault();
                closeModalClient();
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

    function generateOrderId() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function passerCommandeClient() {
        ensureToken(function() {
            const produitsPayload = cartItems.map(item => ({
                idProduit: item.idProduit,
                quantite: item.quantity
            }));

            // Utiliser le format de date avec millisecondes et 'Z'
            const pad = (num) => (num < 10 ? '0' : '') + num;
            const date = new Date();
            const dateCommande = date.getUTCFullYear() +
                '-' + pad(date.getUTCMonth() + 1) +
                '-' + pad(date.getUTCDate()) +
                'T' + pad(date.getUTCHours()) +
                ':' + pad(date.getUTCMinutes()) +
                ':' + pad(date.getUTCSeconds()) +
                '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';

            const orderData = {
                idCommande: generateOrderId(),
                cip: keycloak.tokenParsed.preferred_username,
                dateCommande: dateCommande,
                status: 'en cours', // Ajout du statut de la commande
                produits: produitsPayload
            };

            console.log("Données de la commande envoyée :", JSON.stringify(orderData, null, 2));

            if (orderData.produits.length === 0) {
                console.log("Aucun produit sélectionné pour la commande.");

                const messageContainer = document.getElementById('messageContainer');
                messageContainer.textContent = "";
                messageContainer.style.display = 'block';
                generatePanierHTML("Aucun produit n'est sélectionné pour la commande.");
                return;
            }

            function envoyerCommande() {
                axios.post("http://localhost:8888/api/commande", orderData, {
                    headers: {
                        'Authorization': 'Bearer ' + keycloak.token,
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    console.log("Réponse du serveur après passage de la commande :", response.data);
                    cartItems = [];
                    setCookieClient('cartItems', cartItems, 7);
                    updateCartCount();

                    const messageContainer = document.getElementById('messageContainer');
                    messageContainer.textContent = "";
                    messageContainer.style.display = 'block';
                    generatePanierHTML("Commande effectuée avec succès Merci! <br> Le Numero de la commande est : " + orderData.idCommande);

                }).catch(function(error) {
                    console.error("Erreur lors du passage de la commande :", error);

                    const messageContainer = document.getElementById('messageContainer');
                    messageContainer.textContent = "";
                    messageContainer.style.display = 'block';
                    generatePanierHTML("Erreur lors du passage de la commande. Veuillez réessayer.");

                    if (error.response && error.response.status === 401) {
                        ensureToken(envoyerCommande);
                    }
                });
            }

            envoyerCommande();
        });
    }

    document.getElementById('passer-commande-client-button').addEventListener('click', function() {
        passerCommandeClient();
    });

    // Initialiser les fonctions
    initKeycloak();
    initScrollToTopClient();
    initHorlogeClient();
    initModal();
    fetchVisibleProducts("Alcool fort");
    updateCartCount();
});
