// pour différancier la page confirmation et panier
const page = document.location.href;
//----------------------------------------------------------------
// Récupération des produits de l'api
//----------------------------------------------------------------
// appel de la ressource api product (voir script.js) si on est sur la page panier
fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((objetProduits) => {
        console.log(objetProduits);
        // appel de la fonction affichagePanier
        affichagePanier(objetProduits);
    })
    .catch((err) => {
        document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api: " + err);
    });
//--------------------------------------------------------------
// Fonction détermine les conditions d'affichage des produits du panier
//--------------------------------------------------------------
function affichagePanier(index) {
  // on récupère le panier converti
    let panier = JSON.parse(localStorage.getItem("panierStocké"));
    // si il y a un panier avec une taille differante de 0 (donc supérieure à 0)
    if (panier && panier.length != 0) {
        // zone de correspondance clef/valeur de l'api et du panier grâce à l'id produit choisit dans le localStorage
        for (let choise of panier) {
        console.log(choise);
        for (let g = 0, h = index.length; g < h; g++) {
            if (choise._id === index[g]._id) {
            // création et ajout de valeurs à panier qui vont servir pour les valeurs dataset
            choise.name = index[g].name;
            choise.prix = index[g].price;
            choise.image = index[g].imageUrl;
            choise.description = index[g].description;
            choise.alt = index[g].altTxt;
            }
        }
        }
    
    } else {
    // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
        "Vous n'avez pas d'article dans votre panier";
}
  // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage
    //modifQuantité();
    //suppression();
}
function affiche(indexé) {
    // on déclare et on pointe la zone d'affichage
    let zonePanier = document.querySelector("#cart__items");
    // on créait les affichages des produits du panier via un map et introduction de dataset dans le code
    zonePanier.innerHTML += indexé.map((choise) => 
    `<article class="cart__item" data-id="${choise._id}" data-couleur="${choise.couleur}" data-quantité="${choise.quantité}" data-prix="${choise.prix}"> 
        <div class="cart__item__img">
        <img src="${choise.image}" alt="${choise.alt}">
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
            <h2>${choise.name}</h2>
            <span>couleur : ${choise.couleur}</span>
            <p data-prix="${choise.prix}">${choise.prix} €</p>
            </div>
            <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choise.quantité}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem" data-id="${choise._id}" data-couleur="${choise.couleur}">Supprimer</p>
            </div>
            </div>
        </div>
    </article>`
      ).join(""); //on remplace les virgules de jonctions des objets du tableau par un vide
    // reste à l'écoute des modifications de quantité pour l'affichage et actualiser les données
    totalProduit();
}