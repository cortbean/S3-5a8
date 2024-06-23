document.addEventListener('DOMContentLoaded', function () {
    let keycloak;
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
                                        <a onclick="toggleEyeIcon(this)" type="button" class="sf-pqv__button mb-4">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="eye-icon eye-open">
                                                <path d="M12 4.5C7.30558 4.5 3.14054 7.157 1.229 11.25C3.14054 15.343 7.30558 18 12 18C16.6944 18 20.8595 15.343 22.771 11.25C20.8595 7.157 16.6944 4.5 12 4.5ZM12 15.75C9.65279 15.75 7.75 13.8472 7.75 11.5C7.75 9.15279 9.65279 7.25 12 7.25C14.3472 7.25 16.25 9.15279 16.25 11.5C16.25 13.8472 14.3472 15.75 12 15.75ZM12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75Z" fill="currentColor"/>
                                            </svg>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="eye-icon eye-closed hidden">
                                                <path d="M11.9998 4.5C16.6942 4.5 20.8593 7.157 22.7708 11.25C21.6671 13.4651 20.0496 15.2957 18.0794 16.5525L19.5245 17.9975C21.8292 16.4788 23.646 14.2027 24.7708 11.25C22.8593 7.157 18.6942 4.5 13.9998 4.5C9.30541 4.5 5.14036 7.157 3.22884 11.25C4.13608 13.4208 5.66302 15.2493 7.56238 16.4175L9.00835 14.9725C7.33034 13.9297 6.13608 12.4651 5.22984 10.5C7.24967 6.85707 10.7864 4.5 14.9998 4.5H12H11.9998ZM12.9998 13.2422L14.0586 14.3011C13.5633 14.5704 13.0185 14.75 12.4998 14.75C10.1526 14.75 8.24976 12.8472 8.24976 10.5C8.24976 9.98133 8.42935 9.43648 8.69868 8.94118L9.75757 10L12.9998 13.2422ZM19.292 3.70711L18.2929 2.70711L2.29291 18.7071L3.29291 19.7071L19.292 3.70711Z" fill="currentColor"/>
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

    // Fonction pour basculer entre les icônes de l'œil ouvert et fermé
    window.toggleEyeIcon = function (element) {
        const eyeOpen = element.querySelector('.eye-open');
        const eyeClosed = element.querySelector('.eye-closed');

        if (eyeOpen.classList.contains('hidden')) {
            eyeOpen.classList.remove('hidden');
            eyeClosed.classList.add('hidden');
        } else {
            eyeOpen.classList.add('hidden');
            eyeClosed.classList.remove('hidden');
        }
    }

    // Gestionnaire pour le bouton du panier
    document.getElementById('panier-button').addEventListener('click', function() {
        const paniersection = document.getElementById('panier-section');
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
        updateCartCount();
        generatePanierHTML(); // Mettre à jour le HTML après la suppression
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
        updateCartCount();
        generatePanierHTML();
    }

    // Fonction pour nettoyer les articles avec un identifiant null ou undefined
    function cleanCartItems() {
        cartItems = cartItems.filter(item => item.idProduit !== null && item.idProduit !== undefined);
        saveCartItemsToStorage(cartItems);
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

            // Ajouter le sous-total avec la taxe
            updateSubtotal();
        }
    }

    // Fonction pour mettre à jour le sous-total avec la taxe
    function updateSubtotal() {
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
    updateCartCount();
});
