document.addEventListener('DOMContentLoaded', function () {
    let keycloak;
    const productDetails = {};
    let cartData = {
        selectedProducts: [],
        cartItems: []
    };

    // Fonctions pour gérer les cookies
    function getCookieAdmin(name) {
        const nameEQAdmin = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQAdmin) === 0) return JSON.parse(c.substring(nameEQAdmin.length, c.length));
        }
        return null;
    }

    function setCookieAdmin(name, value, days) {
        const dateAdmin = new Date();
        dateAdmin.setTime(dateAdmin.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + dateAdmin.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

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

    // Mise à jour des catégories
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
                    div.addEventListener('click', function () {
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
                        image: article.image
                    };
                    // Créez un objet produit correspondant à la structure attendue par generateProductHTML
                    const product = {
                        id: article.id,
                        image: article.image,
                        name: article.nom,
                        price: article.prix + "$",
                        color: article.color || 'rgb(214,232,206)',
                        colorText: article.colorText || '3%'
                    };
                    // Ajoutez le HTML généré à BarreCategorie
                    productContainer.innerHTML += generateProductHTML(product);
                });
                // Mettre à jour les icônes des yeux après avoir généré les produits
                updateEyeIcons();
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
    function initScrollToTopAdmin() {
        const scrollToTopButtonAdmin = document.getElementById('scroll-to-top-button');

        scrollToTopButtonAdmin.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        function toggleScrollToTopButton() {
            console.log(window.scrollY);
            if (window.scrollY > 0) {
                scrollToTopButtonAdmin.style.opacity = '1';
            } else {
                scrollToTopButtonAdmin.style.opacity = '0';
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
                                    <a onclick="toggleProductSelection(${product.id}, this)" type="button" class="sf-pqv__button mb-4" data-id="${product.id}">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="eye-icon eye-open hidden">
                                            <path d="M12 4.5C7.30558 4.5 3.14054 7.157 1.229 11.25C3.14054 15.343 7.30558 18 12 18C16.6944 18 20.8595 15.343 22.771 11.25C20.8595 7.157 16.6944 4.5 12 4.5ZM12 15.75C9.65279 15.75 7.75 13.8472 7.75 11.5C7.75 9.15279 9.65279 7.25 12 7.25C14.3472 7.25 16.25 9.15279 16.25 11.5C16.25 13.8472 14.3472 15.75 12 15.75ZM12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75Z" fill="currentColor"/>
                                        </svg>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="eye-icon eye-closed">
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

    window.toggleProductSelection = function (idProduit, element) {
        const eyeOpen = element.querySelector('.eye-open');
        const eyeClosed = element.querySelector('.eye-closed');
        const index = cartData.selectedProducts.indexOf(idProduit);

        if (eyeOpen.classList.contains('hidden')) {
            eyeOpen.classList.remove('hidden');
            eyeClosed.classList.add('hidden');
            if (index === -1) {
                cartData.selectedProducts.push(idProduit);
                addToCart(idProduit); // Ajoutez cette ligne pour ajouter au panier
            }
        } else {
            eyeOpen.classList.add('hidden');
            eyeClosed.classList.remove('hidden');
            if (index !== -1) {
                cartData.selectedProducts.splice(index, 1);
                removeFromCart(idProduit); // Ajoutez cette ligne pour retirer du panier
            }
        }

        saveCartDataToStorage();
        updateCartCount(); // Assurez-vous de mettre à jour le compteur du panier
        generatePanierHTML(); // Mettre à jour le HTML du panier
    };

    // Fonction pour ouvrir la modale du panier
    function openPanierModal() {
        closeDashboardModal(); // Fermer la modale du tableau de bord si ouverte
        document.getElementById('ical').style.display = 'block';
        document.body.classList.add('modal-open');
        generatePanierHTML();
    }

    // Fonction pour fermer la modale du panier
    function closePanierModal() {
        document.getElementById('ical').style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // Gestionnaire pour le bouton du panier
    document.getElementById('panier-button').addEventListener('click', function() {
        openPanierModal();
    });

    // Gestionnaire pour le bouton de fermeture de la modale du panier
    document.getElementById('close-modal-button').addEventListener('click', function() {
        closePanierModal();
    });

    // Fonction pour sauvegarder les données du panier dans un cookie
    function saveCartDataToStorage() {
        setCookieAdmin('panierData', cartData, 7); // Sauvegarder pour 7 jours
    }

    // Fonction pour récupérer les données du panier depuis un cookie
    function getCartDataFromStorage() {
        const data = getCookieAdmin('panierData');
        return data ? data : { selectedProducts: [], cartItems: [] };
    }


    /*---------------------------------------------------Tableau de Bord-------------------------------------------------------------*/
    document.getElementById('admin-dashboard').addEventListener('click', function() {
        getAllCommandes().then(function (data) {
            console.log("Données reçues de l'API:", data);
            data.forEach(commande => {
                console.log("ID Commande dans les données reçues:", commande.idCommande);
                openDashboardModal(commande.idCommande);
            });
        }).catch(function (error) {
            console.error("Erreur lors de la récupération de toutes les commandes:", error);
        });
    });

    function openDashboardModal(idCommande) {
        if (!idCommande) {
            console.error("ID Commande manquant.");
            return;
        }
        closePanierModal();
        document.getElementById('ical0').style.display = 'block';
        document.body.classList.add('modal-open');
        generateDashboardHTML(idCommande);
    }

    function closeDashboardModal() {
        document.getElementById('ical0').style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    document.getElementById('close-modal-button0').addEventListener('click', function() {
        closeDashboardModal();
    });

    function storeCommandesTerminees(commandesTerminees) {
        const now = new Date();
        const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 mois
        const data = {
            commandes: commandesTerminees,
            expiry: expiryDate
        };
        setCookieAdmin('commandesTerminees', JSON.stringify(data), 30);
    }

    function getCommandesTerminees() {
        const data = getCookieAdmin('commandesTerminees');
        if (data) {
            const parsedData = JSON.parse(data);
            const now = new Date();
            if (new Date(parsedData.expiry) > now) {
                return parsedData.commandes;
            } else {
                setCookieAdmin('commandesTerminees', {}, -1); // Expire le cookie
                return [];
            }
        }
        return [];
    }

    function getAllCommandes() {
        return axios.get("http://localhost:8888/api/getAllCommandesWithProduits", {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(function (response) {
            console.log("Réponse de l'API:", response.data);
            return response.data;
        }).catch(function (error) {
            console.error("Erreur lors de la récupération des commandes:", error);
            return keycloak.updateToken(5).then(function () {
                console.log('Token rafraîchi et nouvelle tentative de récupération des commandes.');
                return getAllCommandes();
            }).catch(function () {
                console.error('Échec du rafraîchissement du token et de la récupération des commandes.');
            });
        });
    }

    function generateDashboardHTML(idCommande) {
        const icalPanierContainer = document.getElementById('ical-panier0');
        icalPanierContainer.innerHTML = '';

        console.log("ID Commande reçu:", idCommande);
        if (!idCommande) {
            icalPanierContainer.innerHTML = 'ID Commande manquant.';
            console.error("ID Commande manquant.");
            return;
        }

        getAllCommandes().then(function (data) {
            console.log("Données reçues de l'API:", data);

            const commandesUnique = [...new Map(data.map(item => [item.idCommande, item])).values()];
            console.log("Commandes uniques:", commandesUnique);

            const commande = commandesUnique.find(c => c.idCommande === idCommande);
            console.log("Commande trouvée:", commande);

            if (!commande) {
                icalPanierContainer.innerHTML = 'Aucune commande trouvée.';
                console.log("Aucune commande trouvée.");
                return;
            }

            const produits = commande.produits;
            console.log("Produits reçus pour la commande:", produits);

            if (!commande || !produits || produits.length === 0) {
                icalPanierContainer.innerHTML = 'Aucune commande trouvée.';
                return;
            }

            console.log("Statut de la commande:", commande.status);

            const commandesTerminees = commande.status === 'terminee' ? [commande] : [];
            const commandesEnCours = commande.status === 'en cours' ? [commande] : [];

            console.log("Commandes Terminées:", commandesTerminees);
            console.log("Commandes en Cours:", commandesEnCours);

            const storedCommandesTerminees = getCommandesTerminees();
            const allCommandesTerminees = [...new Set([...storedCommandesTerminees, ...commandesTerminees])];
            storeCommandesTerminees(allCommandesTerminees);

            if (allCommandesTerminees.length === 0 && commandesEnCours.length === 0) {
                icalPanierContainer.innerHTML = 'Votre tableau de bord est actuellement vide.';
                console.log("Aucune commande trouvée. Message affiché.");
            } else {
                if (allCommandesTerminees.length > 0) {
                    icalPanierContainer.innerHTML += '<h2>Commandes Terminées</h2>';
                    allCommandesTerminees.forEach(commande => {
                        icalPanierContainer.appendChild(createCommandeItem(commande, true));
                    });
                }

                if (commandesEnCours.length > 0) {
                    icalPanierContainer.innerHTML += '<h2>Commandes en Cours</h2>';
                    commandesEnCours.forEach(commande => {
                        icalPanierContainer.appendChild(createCommandeItem(commande, false));
                    });
                }
            }

        }).catch(function (error) {
            console.error("Erreur lors de la récupération des commandes:", error);
            icalPanierContainer.innerHTML = 'Erreur lors de la récupération des commandes.';
        });
    }

    function markAsCompleted(idCommande) {
        console.log(`Commande ${idCommande} marquée comme terminée.`);

        axios.post(`http://localhost:8888/api/markAsCompleted/${idCommande}`, {}, {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(function (response) {
            console.log(`Commande ${idCommande} mise à jour avec succès.`);
            // Mettre à jour l'interface utilisateur après la mise à jour de la commande
            getAllCommandes().then(data => {
                generateDashboardHTML(idCommande);
            });
        }).catch(function (error) {
            console.error(`Erreur lors de la mise à jour de la commande ${idCommande}:`, error);
        });
    }

    function createCommandeItem(commande, isCompleted) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('commande-item');
        itemDiv.setAttribute('data-id', commande.idCommande);
        itemDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 15px;">
            <div style="flex-grow: 1;">
                <p style="margin: 0;">ID Commande: ${commande.idCommande}</p>
                <p style="margin: 0;">Date Commande: ${commande.dateCommande}</p>
                <p style="margin: 0;">Produits:</p>
                <ul>
                    ${commande.produits.map(p => `<li>${p.nom} - Quantité: ${p.quantite} - Prix: ${p.prix}</li>`).join('')}
                </ul>
                <p style="margin: 0;">Quantité Total: ${commande.produits.reduce((total, p) => total + p.quantite, 0)}</p>
                ${isCompleted ? '' : `<button onclick="markAsCompleted('${commande.idCommande}')">Marquer comme terminée</button>`}
            </div>
        </div>
    `;
        return itemDiv;
    }

    /*----------------------------------------------------Fin-----------------------------------------------------------*/

    // Fonction pour supprimer un article du panier
    function removeFromCart(idProduit) {
        cartData.cartItems = cartData.cartItems.filter(item => item.idProduit !== idProduit);
        cleanCartItems();
        saveCartDataToStorage();
        updateCartCount();
        generatePanierHTML(); // Mettre à jour le HTML après la suppression
    }

    // Fonction pour nettoyer les articles avec un identifiant null ou undefined
    function cleanCartItems() {
        cartData.cartItems = cartData.cartItems.filter(item => item.idProduit !== null && item.idProduit !== undefined);
        saveCartDataToStorage();
    }

    // Initialiser les articles du panier depuis le cookie
    cartData = getCartDataFromStorage();
    cleanCartItems();

    function addToCart(idProduit) {
        if (!productDetails[idProduit]) {
            console.warn(`Produit avec ID ${idProduit} n'existe pas dans les détails du produit.`);
            return;
        }

        const cartItems = cartData.cartItems;

        // Vérifier si le produit est déjà dans le panier
        const existingItem = cartItems.find(item => item.idProduit === idProduit);
        if (!existingItem) {
            // Ajouter le produit au panier avec un indicateur de vue
            cartItems.push({ idProduit, viewed: true });
        }

        saveCartDataToStorage();
        updateCartCount();
        generatePanierHTML();
    }

    function generatePanierHTML(successMessage) {
        const icalPanierContainer = document.getElementById('ical-panier');
        icalPanierContainer.innerHTML = '';

        const cartItems = cartData.cartItems;
        if (cartItems.length === 0) {
            icalPanierContainer.innerHTML = successMessage ? successMessage : 'Votre vue est actuellement vide.';
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
                    </div>
                `;
                icalPanierContainer.appendChild(itemDiv);
            });
        }
    }

    // Fonction pour gérer les changements de quantité d'un produit
    window.changementProduit = function (idProduit, changement) {
        // Vérifier si l'idProduit est null ou undefined
        if (idProduit === null || idProduit === undefined) {
            console.warn("Produit avec un ID null ne peut pas être ajouté");
            return;
        }

        idProduit = parseInt(idProduit);

        const existingItem = cartData.cartItems.find(item => item.idProduit === idProduit);

        if (existingItem) {
            // Mettre à jour la quantité si le produit est déjà dans le panier
            existingItem.quantity += changement;
            if (existingItem.quantity < 1) {
                removeFromCart(existingItem.idProduit);
            }
        } else {
            // Ajouter le produit au panier avec la quantité spécifiée
            if (changement > 0) {
                cartData.cartItems.push({ idProduit, quantity: changement });
            }
        }

        cleanCartItems();
        console.log(cartData.cartItems);
        saveCartDataToStorage(); // Assurez-vous de sauvegarder les articles après modification
        updateCartCount();
        generatePanierHTML();
    }

    document.getElementById('update-products-button').addEventListener('click', function() {
        console.log("Produits sélectionnés à envoyer pour mise à jour :", cartData.selectedProducts);

        if (cartData.selectedProducts.length === 0) {
            console.log("Aucun produit sélectionné pour mise à jour.");
            const messageContainer = document.getElementById('messageContainer');
            messageContainer.textContent = "";
            messageContainer.style.display = 'block';
            generatePanierHTML("Aucun produit n'est sélectionné pour la mise à jour.");
            return;
        }

        const produitsPayload = cartData.selectedProducts.map(id => ({ idProduit: id }));
        console.log("Payload envoyé au serveur :", produitsPayload);

        axios.post("http://localhost:8888/api/updateVisibleProducts", produitsPayload, {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            console.log("Réponse du serveur après mise à jour des produits :", response.data);

            cartData.selectedProducts = [];
            cartData.cartItems = [];

            saveCartDataToStorage();
            updateCartCount();

            const messageContainer = document.getElementById('messageContainer');
            messageContainer.textContent = "";
            messageContainer.style.display = 'block';
            generatePanierHTML("Mise à jour effectuée avec succès !");

            // Fermer les yeux de tous les produits sélectionnés
            document.querySelectorAll('.eye-open').forEach(eye => eye.classList.add('hidden'));
            document.querySelectorAll('.eye-closed').forEach(eye => eye.classList.remove('hidden'));

        }).catch(function(error) {
            console.error("Erreur lors de la mise à jour des produits :", error);

            const messageContainer = document.getElementById('messageContainer');
            messageContainer.textContent = "";
            messageContainer.style.display = 'block';
            generatePanierHTML("Erreur lors de la mise à jour. Veuillez réessayer.");

            keycloak.updateToken(5).then(function() {
                console.log('Token rafraîchi et nouvelle tentative d\'envoi.');
            }).catch(function() {
                console.error('Échec du rafraîchissement du token et de la mise à jour des produits.');
            });
        });
    });

    // Fonction pour mettre à jour le compteur du panier
    function updateCartCount() {
        const cartItems = cartData.cartItems;
        const cartCount = cartItems.length;
        const cartCountElement = document.querySelector('sup[data-cart-count]');
        if (cartCount > 0) {
            cartCountElement.classList.remove('!hidden');
            cartCountElement.textContent = cartCount;
        } else {
            cartCountElement.classList.add('!hidden');
            cartCountElement.textContent = '0';
        }
    }

    function updateEyeIcons() {
        const cartItems = cartData.cartItems;
        cartItems.forEach(item => {
            if (!productDetails[item.idProduit]) {
                console.warn(`Produit avec ID ${item.idProduit} n'existe pas dans les détails du produit.`);
                return;
            }

            const eyeIcon = document.querySelector(`a[data-id="${item.idProduit}"]`);
            if (eyeIcon) {
                const eyeOpen = eyeIcon.querySelector('.eye-open');
                const eyeClosed = eyeIcon.querySelector('.eye-closed');
                if (item.viewed) {
                    eyeOpen.classList.remove('hidden');
                    eyeClosed.classList.add('hidden');
                } else {
                    eyeOpen.classList.add('hidden');
                    eyeClosed.classList.remove('hidden');
                }
            }
        });
    }

    // Initialiser l'horloge
    function initHorlogeAdmin() {
        function getTimeAdmin() {
            const now = new Date();
            const heures = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const secondes = String(now.getSeconds()).padStart(2, '0');
            return `${heures}:${minutes}:${secondes}`;
        }

        function afficherHeure() {
            const horloge = document.getElementById('horloge');
            horloge.textContent = getTimeAdmin();
        }

        afficherHeure();
        setInterval(afficherHeure, 1000);
    }

    // Initialiser les fonctions
    initKeycloak();
    initScrollToTopAdmin();
    initHorlogeAdmin();
    updateCartCount();
    showArticles("Alcool fort");
});
