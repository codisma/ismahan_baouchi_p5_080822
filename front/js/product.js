// récupération de l'id du produit via l'URL
//-------------------------------------------
const params = new URLSearchParams(document.location.search); 
const id= params.get("_id")
//console.log(id)

//--------------------------------------------------------------------------
// Récupération des produits de l'api et traitement des données (voir script.js)
//-------------------------------------------------------
    fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((objetProduits) => {
            console.log(objetProduits);

            lesProduits(objetProduits);
        })
        .catch((err) => {
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
            console.log("erreur 404, sur ressource api: " + err);
        });

let articleClient = {};
articleClient._id = id;


// fonction d'affichage du produit de l'api
function lesProduits (produit) {
    let imageAlt = document.querySelector ("article div.item__img");
    let titre = document.querySelector ("#title");
    let prix = document.querySelector ("#price");
    let description = document.querySelector ("#description");
    let couleurOption = document.querySelector("#colors")
    for (let choise of produit){
        if (id === choise._id) {
            imageAlt.innerHTML = `<img src ="${choise.imageUrl}" alt= "${choise.altTxt}">`
            titre.textContent = `${choise.name}`;
            prix.textContent = `${choise.price}`;
            description.textContent= `${choise.description}`;
            for (let couleur of choise.colors){
                couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
            }
        }
    }
}

//choix de couleur dynamque
// définition des variables
let choixCouleur = document.querySelector("#colors");
// On écoute ce qu'il se passe dans #colors
choixCouleur.addEventListener("input", (evc) => {
    let couleurProduit;
  // on récupère la valeur de la cible de l'évenement dans couleur
    couleurProduit = evc.target.value;
  // on ajoute la couleur à l'objet panierClient
    articleClient.couleur = couleurProduit;
    console.log(couleurProduit);
})

//choix de quantite dynamique
//definition des variables 
let choixQuantité = document.querySelector("#quantity");
choixQuantité.addEventListener("input", (eq) => {
    let quantitéProduit;
    quantitéProduit = eq.target.value;
    articleClient.quantité = quantitéProduit;
    console.log(quantitéProduit);
})



let choixProduit = document.querySelector("#addToCart");
choixProduit.addEventListener("click", ()=> {
    if (
        articleClient.quantité < 1 ||
        articleClient.quantité >100 ||
        articleClient.quantité === undefined||
        articleClient.couleur === "" ||
        articleClient.couleur === undefined
    ) {
        // active alert
        alert ("pour valider le chois de cet articel, veuillez renseigner une couleur, et /ou une quantité valide entre 1 et 100")
} else  {
        // montre panier 
        Panier();
        console.log ("clic effectué")
}

});

// Déclaration de tableaux utiles (voir mutation)
//------------------------------------------------------------------------
// déclaration tableau qui sera le 1er, unique et destiné à initialiser le panier
let choixProduitClient = [];
// déclaration tableau qui sera ce qu'on récupère du local storage appelé panierStocké et qu'on convertira en JSon (importance dans Panier())
let produitsEnregistrés = [];
// déclaration tableau qui sera un choix d'article/couleur non effectué donc non présent dans le panierStocké
let produitsTemporaires = [];
// déclaration tableau qui sera la concaténation des produitsEnregistrés et de produitsTemporaires
let produitsAPousser = [];

function ajoutPremierProduit() {
    console.log(produitsEnregistrés);
    //si produitsEnregistrés est null c'est qu'il n'a pas été créé
    if (produitsEnregistrés === null) {
      // pousse le produit choisit dans choixProduitClient
        choixProduitClient.push(articleClient);
        console.log(articleClient);
      // dernière commande, envoit choixProduitClient dans le local storage sous le nom de panierStocké de manière JSON stringifié
        return (localStorage.panierStocké = JSON.stringify(choixProduitClient));
    }
}

function ajoutAutreProduit() {
    // vide/initialise produitsAPousser pour recevoir les nouvelles données
    produitsAPousser = [];
    // pousse le produit choisit dans produitsTemporaires
    produitsTemporaires.push(articleClient);
    // combine produitsTemporaires et/dans produitsEnregistrés, ça s'appele produitsAPousser
    // autre manière de faire: produitsAPousser = produitsEnregistrés.concat(produitsTemporaires);
    produitsAPousser = [...produitsEnregistrés, ...produitsTemporaires];
    //fonction pour trier et classer les id puis les couleurs https://www.azur-web.com/astuces/javascript-trier-tableau-objet
    produitsAPousser.sort(function triage(a, b) {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        if (a._id = b._id){
        if (a.couleur < b.couleur) return -1;
        if (a.couleur > b.couleur) return 1;
}
        return 0;
});
    produitsTemporaires = [];
    // dernière commande, envoit produitsAPousser dans le local storage sous le nom de panierStocké de manière JSON stringifié
    return (localStorage.panierStocké = JSON.stringify(produitsAPousser));
    }

    // fonction Panier qui ajuste la quantité si le produit est déja dans le tableau, sinon le rajoute si tableau il y a, ou créait le tableau avec un premier article choisi 
//--------------------------------------------------------------------
function Panier() {
    // variable qui sera ce qu'on récupère du local storage appelé panierStocké et qu'on a convertit en JSon
    produitsEnregistrés = JSON.parse(localStorage.getItem("panierStocké"));
    // si produitEnregistrés existe (si des articles ont déja été choisis et enregistrés par le client)
    if (produitsEnregistrés) {
        for (let choix of produitsEnregistrés) {
            //comparateur d'égalité des articles actuellement choisis et ceux déja choisis
            if (choix._id === id && choix.couleur === articleClient.couleur) {
            //information client
            alert("RAPPEL: Vous aviez déja choisit cet article.");
            // on modifie la quantité d'un produit existant dans le panier du localstorage
            //définition de additionQuantité qui est la valeur de l'addition de l'ancienne quantité parsée et de la nouvelle parsée pour le même produit
            let additionQuantité = parseInt(choix.quantité) 
            // on convertit en JSON le résultat précédent dans la zone voulue
            choix.quantité = JSON.stringify(additionQuantité);
            // dernière commande, on renvoit un nouveau panierStocké dans le localStorage
            return (localStorage.panierStocké = JSON.stringify(produitsEnregistrés));
            }
        }
        // appel fonction ajoutAutreProduit si la boucle au dessus ne retourne rien donc n'a pas d'égalité
        return ajoutAutreProduit();
        }
    // appel fonction ajoutPremierProduit si produitsEnregistrés n'existe pas
    return ajoutPremierProduit();
}

