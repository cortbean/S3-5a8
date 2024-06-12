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

        // Ajoutez la logique pour afficher ou cacher la section en fonction de l'événement du clic sur le bouton "Bière"
        const annonceSection = document.querySelector('.CollectionProductGrid');
        annonceSection.style.display = 'none'; // Cachez la section par défaut

        const boutonBiere = document.querySelector('button'); // Sélectionne le premier bouton dans le document
        boutonBiere.addEventListener('click', function() {
            annonceSection.style.display = 'block'; // Affichez la section lorsque le bouton "Bière" est cliqué
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

    initKeycloak(); // Initialiser Keycloak au chargement de la page
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
    // Tableau d'objets de produits
    const products = [
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "3 $",
            color: "rgb(214,232,206)",
            colorText: "3%"
        },
        {
            image: "images/Biere.png",
            name: "Offre Spéciale 5à8",
            price: "5 $",
            color: "rgb(214,232,206)",
            colorText: "5%"
        },
        // Ajoutez d'autres produits ici
    ];

    // Conteneur de produits
    const productContainer = document.getElementById("product-container");

    // Fonction pour générer le HTML pour un produit
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
                                        <span class="sf__tooltip-content" data-revert-text="Remove from wishlist">Add favoris</span>
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
                                    <a type="button" class="sf-pqv__button sf__btn-bag-icon mb-4" data-id="" data-fav-id="" data-fav-sku="" data-product-url="" data-product-handle="">
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

    // Générer le HTML pour chaque produit et l'insérer dans le conteneur
    products.forEach(product => {
        productContainer.innerHTML += generateProductHTML(product);
    });
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




