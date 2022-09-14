
// récupération du LocalStorage
let localPanier = getPanier();
//recupération de l'API
function getProduitById(id) {
    console.log(id);
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(function (res) {
            return res.json();
        })
        .catch((err) => {
            //une erreur est survenue
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
            console.log("erreur 404, sur ressource api: " + err);
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
            console.log(TailleProduit)
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

            let quantity = event.target.closest('.itemQuantity').value
            let quantityNumber = parseInt(quantity)
            let item = event.target.closest('[data-id]')
            let product = item.dataset

            if (input.value <= 0) {
                alert("Il n'est pas possible d'avoir moins de zéro kanap. Veuillez supprimer le Kanap");
                location.reload();
            } else {

                productID = {
                    id: product.id,
                    quantite: quantityNumber
                }
                console.log(productID)

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
            document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
            console.log("erreur 404, sur ressource api: " + err);
        });


}

/*Gestion bouton supprimer*/
function deleteProduct() {
    document.querySelectorAll(".deleteItem").forEach(item => item.addEventListener("click", (e) => {
        let deletItem = e.target.closest('[data-id]')
        let product = deletItem.dataset
        removeFromPanier(product)
        window.location.assign("cart.html")
    }));
}


//order kanaps

function checkInput ( element, regex , errorMessage){
    element.addEventListener("change", () =>{
        if (!regex.test(element.value)){
            errorMessage.innerHTML = "plaese add correct data"
        }
    })
}
const firstName = document.getElementById("firstName")
const lastName = document.getElementById("lastName")
const address = document.getElementById("address")
const city = document.getElementById("city")
const email= document.getElementById("email")

const input = [firstName, lastName, address, city, email]

/*spaceInput.forEach((element  => {
element.addEventListener("keyup", (e) =>{
    checkInput(e.target)
})
}))*/

function checkInPut(element){
    const [regex, errorMessage] = choseRgex(element)
    const errorspan = getErrorSpan(element)
    showErrorMessage(element, rgex,errorMessage,errorspan)
    return regex.test(element.value)
}
function getErrorSpan(element) {
    if (element === firstName) return document.getElementById("firstNameErrorMsg")
    if (element === lastName) return document.getElementById("lastNameErrorMsg")
    if (element=== address) return document.getElementById("addressErrorMsg")
    if (element=== city) return document.getElementById("cityErrorMsg")
    if (element=== email) return document.getElementById("emailErrorMsg")
    throw new Error ("no HTML element found for error message")
}


function chooseRegex(element) {
    const emailRag = new RegExp (/^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/)
    const noSpaceCharacters = new RegExp (/^[a-zA-z0-9 ]*$/)
    const emailMessage = "Please add correct email"
    const noSpaceCharactersMessage = " No spiecail charcters allowed"
    if( element === email)return [emailRag, emailMessage]
    return [noSpaceCharacters,noSpaceCharactersMessage ]
}
 
document.getElementById("order").addEventListener("click", (e) => {
    const areAllInputIsVAlid = spaceInput.every(checkInput)
    if (!areAllInputIsVAlid) {
        e.preventDefault()
    }return
    window.location.href = "../html/comfirmation.html"
})
function sendOrder() {
const body = {
    contact:{
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email : email.value,

    }, 
    products: getIdsFromCart (cart)
}
fetch("http://localhost:3000/api/products/order")
}
function getIdsFromCart (cart) {
    const ids = []
    for ( const kanaps of cart) {
        ids.push(kanaps._id)
    }
    return ids
}




function showErrorMessage ( element, regex, errorMessage,errorspan){
    errorspan.innerText = regex.test(element.value) ? "" : errorMessage
}






