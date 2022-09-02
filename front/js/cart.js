
const page = document.location.href;

//----------------------------------------------------------------
// Récupération des produits de l'api
//----------------------------------------------------------------
// appel de la ressource api product (voir script.js) si on est sur la page panier
if (page.match("cart")) {
fetch("http://localhost:3000/api/products/")
    .then((res) => res.json())
    .then((objetProduits) => {
        console.log(objetProduits);
      // appel de la fonction affichagePanier
        affichagePanier(objetProduits);
})
} else {
    console.log("sur page confirmation");
}


function affichagePanier(index) {
    // on déclare et on pointe la zone d'affichage
    let zonePanier = document.querySelector("#cart__items");
    // on créait les affichages des produits du panier via un map et introduction de dataset dans le code
    for (let choix of index)  {zonePanier.innerHTML +=
    `<article class="cart__item" data-id="${choix._id}" data-couleur="${choix.colors}" data-quantité="${choix.Quantite}" data-prix="${choix.price}"> 
        <div class="cart__item__img">
        <img src="${choix.imageUrl}" alt="${choix.alt}">
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
            <h2>${choix.name}</h2>
            <span>couleur : ${choix.colors}</span>
            <p data-prix="${choix.price}">${choix.price} €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choix.Quantite}">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${choix._id}" data-couleur="${choix.colors}">Supprimer</p>
            </div>
        </div>
        </div>
    </article>`}
    }

    function affiche(index) {
        // on récupère le panier converti
        let panier = JSON.parse(localStorage.getItem("panierStocke"));
        // si il y a un panier avec une taille differante de 0 (donc supérieure à 0)
            if (panier && panier.length != 0) {
            // zone de correspondance clef/valeur de l'api et du panier grâce à l'id produit choisit dans le localStorage
            for (let choix of panier) {
                console.log(choix);
                for (let g = 0, h = index.length; g < h; g++) {
                if (choix._id === index[g]._id) {
                    // création et ajout de valeurs à panier qui vont servir pour les valeurs dataset
                    choix.name = index[g].name;
                    choix.prix = index[g].price;
                    choix.image = index[g].imageUrl;
                    choix.description = index[g].description;
                    choix.alt = index[g].altTxt;
                }
                }
            }   affiche(panier);
        } else {
          // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
                "Vous n'avez pas d'article dans votre panier";
            }
        }