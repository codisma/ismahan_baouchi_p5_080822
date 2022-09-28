// récupération du LocalStorage
let localPanier = getPanier();
//recupération de l'API
function getProduitById(id) {
    //console.log(id);
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(function (res) {
            return res.json();
        })
        .catch((err) => {
            //une erreur est survenue
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>Suite à un problème technique le canapé ne s'affiche pas correctement, veuillez essai plus tard</h1>";
            //console.log("erreur 404, sur ressource api: " + err);
        })
        .then(function (response) {
            return response;
        })
};

async function affichageProduit() {
    const panierCart = document.getElementById("cart__items");
    let panierHtml = [];

    // si il y a un panier avec une taille differente de 0 (donc supérieure à 0)
    if (localPanier && localPanier.length > 0) {
        //Si panier pas vide alors rajoute un produit
        for (i = 0; i < localPanier.length; i++) {
            const produit = await getProduitById(localPanier[i].id);
            const TailleProduit = Object.entries(produit).length;
            //console.log(TailleProduit)
            panierHtml += `
                <article class="cart__item" data-id=${localPanier[i].id}>
                <div class="cart__item__img">
                    <img src=${produit.imageUrl} alt=${produit.altTxt}>
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${produit.name}</h2>
                        <p>${localPanier[i].couleur}</p>
                        <p>${produit.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input data-id=${localPanier[i].id}  data-color=${localPanier[i].couleur} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${localPanier[i].quantite}>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p data-id=${localPanier[i].id}  data-color=${localPanier[i].couleur} class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
                </article>`;
        }
        panierCart.insertAdjacentHTML("beforeend", panierHtml);

        AffichagetotalProduit();


        GestionQuantity();
        deleteProduct();

    } else {
        // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML =
            "Vous n'avez pas d'article dans votre panier";

    }

}
affichageProduit();

/*Gestion modification quantité canapé*/
function GestionQuantity() {
    let itemQuantity = document.querySelectorAll(".itemQuantity");

    for (i = 0; i < itemQuantity.length; i++) {
        let input = itemQuantity[i];
        input.addEventListener("change", (event) => {
            let input = event.target;
            // console.log(input.attributes['data-color'].value);
            let quantity = event.target.closest('.itemQuantity').value
            let quantityNumber = parseInt(quantity)
            let item = event.target.closest('[data-id]')
            let couleur = input.attributes['data-color'].value
            let product = item.dataset

            if (input.value <= 0) {
                alert("Il n'est pas possible d'avoir moins de zéro kanap. Veuillez supprimer le Kanap");
                location.reload();
            } else {

                productID = {
                    id: product.id,
                    quantite: quantityNumber,
                    couleur: couleur
                }
                //console.log(productID)

                // ajout de la quantité s'il n'y a pas d'anomalie 
                addQuantity(productID)


                // affichage de la quantité et du prix total
                AffichagetotalProduit()


            }
        })
    }
}




// fonction ajout nombre total produit et coût total
function AffichagetotalProduit() {
    let objetProduits;
    fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((objetProduits) => {
            //console.log(objetProduits);
            let panier = getPanier();
            // déclaration variable en tant que nombre
            let totalArticle = 0;
            let prixCombine = 0;
            let totalPrix = 0;
            //console.log(panier)
            // zone de correspondance clef/valeur de l'api et du panier
            for (let produitCourant of panier) {
                for (let i = 0, h = objetProduits.length; i < h; i++) {
                    if (produitCourant.id === objetProduits[i]._id) {
                        // calcule la somme/prix total
                        totalArticle += JSON.parse(produitCourant.quantite);
                        prixCombine = JSON.parse(produitCourant.quantite) * JSON.parse(objetProduits[i].price);
                        totalPrix += prixCombine;
                    }
                }
            }
            document.getElementById("totalQuantity").textContent = totalArticle;
            document.getElementById("totalPrice").textContent = totalPrix;
        })
        .catch((err) => {
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>Suite à un problème technique le canapé ne s'affiche pas correctement, veuillez essai plus tard</h1>";
            //console.log("erreur 404, sur ressource api: " + err);
        });


}

function deleteProduct() {
    document.querySelectorAll(".deleteItem").forEach(item => item.addEventListener("click", (e) => {
        let deletItem = e.target.closest('[data-id]')

        id = deletItem.attributes['data-id'].value
        couleur = deletItem.attributes['data-color'].value

        product = {
            id: id,
            couleur: couleur
        }

        removeFromPanier(product)
        window.location.assign("cart.html")
    }));
}

let commandeProducts = JSON.parse(localStorage.getItem("commandes"))
//order kanaps

const prenom = document.getElementById("firstName")
const nom = document.getElementById("lastName")
const ville = document.getElementById("city")
const address = document.getElementById("address")
const email = document.getElementById("email")


let valueFirstName, valuelastName, valueCity, valueAddress, valueEmail;

prenom.addEventListener("input", function (e) {
    valueFirstName;
    if (e.target.value.match(/^[a-z A-Z]{1,50}$/)) {
        firstNameErrorMsg.innerHTML = "";
        valueFirstName = e.target.value;
        //console.log("succes");
        //console.log(valueFirstName)
    } else {
        firstNameErrorMsg.innerHTML =
            "Prénom doit être composé par des lettres,pas de caratére spécial ou accent"
        valueFirstName = null;
    
    }

});

nom.addEventListener("input", function (e) {
    valuelastName;
        //console.log(valuelastName)
        if (e.target.value.match(/^[a-z A-Z]{1,50}$/)) {
            lastNameErrorMsg.innerHTML  = "";
            valuelastName = e.target.value;
            //console.log("succes");
            //console.log(valuelastName)
        } else {
            lastNameErrorMsg.innerHTML  =
                "Nom doit être composé par des lettres , pas de caratére spécial ou accent" 
                valuelastName = null;
        
        }
});

ville.addEventListener("input", function (e) {
    valueCity;
        if (e.target.value.match(/^[a-z A-Z]{1,50}$/)) {
        cityErrorMsg.innerHTML  = "";
        valueCity = e.target.value;
        //console.log("succes");
        //console.log(valueCity )
    } else {
        cityErrorMsg.innerHTML =
            "Ville doit être composé par des lettres, pas de caratére spécial ou accent" 
        valueCity = null;
    }
});




address.addEventListener("input", function (e) {
    valueAddress;

    if (e.target.value.match(/^[0-9 a-z A-Z]{1,80}$/)) {
        addressErrorMsg.innerHTML = "";
        valueAddress = e.target.value;
        //console.log("succes");
        //console.log(valueAddress)
    } else {
        addressErrorMsg.innerHTML =
            " Adress doit compose par des chiffre et des lettre  pas de caratére spécial ou accent"
        valueAddress = null;
        //console.log("")
    }

});




email.addEventListener("input", (e) => {
    if (e.target.value.length == 0) {
        emailErrorMsg.innerHTML = "";
        valueEmail = null;
        //console.log(valueEmail);
    }
    else if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        emailErrorMsg.innerHTML = ""
        valueEmail = e.target.value;
        //console.log(valueEmail)
    }
    if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) &&
        !e.target.value.length == 0) {
        emailErrorMsg.innerHTML = "Email incorrect  ex:bob@hotmail.fr"
        valueEmail = null;

    }
});
//cart__order__form"

cartorderform.addEventListener("submit", (e) => {
    e.preventDefault();
    //console.log(stop)

    if (valueFirstName && valuelastName && valueCity && valueAddress && valueEmail) {
        //console.log("cest bon envoie");
        const commandeFinal = JSON.parse(localStorage.getItem("produit"))
        let commandeID = [];
        //console.log(commandeFinal)
        //console.log(commandeID)

        commandeFinal.forEach((commande) => {
            commandeID.push(commande.id);
        });
        //console.log(commandeID);

        const data = {
            contact: {
                firstName: valueFirstName,
                lastName: valuelastName,
                address: valueAddress,
                city: valueCity,
                email: valueEmail,
            },
            products: commandeID
        };
        //console.log(data);



        ///////////////////////////////// fetch post ////////////////////////
        let reponseServers = [];
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

            .then((res) => res.json())
            .then((promise) => {
                reponseServers = promise;
                //console.log(reponseServers)

                const dataCommande = {
                    contact: reponseServers.contact,
                    order: reponseServers.orderId,
                };

                if (commandeProducts == null) {
                    commandeProducts = []
                    commandeProducts.push(dataCommande)
                    localStorage.setItem("commandes", JSON.stringify(commandeProducts));
                } else if (commandeProducts != null) {
                    commandeProducts.push(dataCommande)
                    localStorage.setItem("commandes", JSON.stringify(commandeProducts));
                }

                localStorage.removeItem("produit");
                location.href = "confirmation.html";
            });

        firstName.value = "",
            lastName.value = "",
            email.value = "",
            address.value = "",
            city.value = "",
            valueAddress = null;
        valueCity = null;
        valueFirstName = null;
        valuelastName = null;
        valueEmail = null;


    } else {
        alert("remplir le formulaire correctement")
    }

});
//console.log(commandeProducts)