
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

var panier = {};
localStorage.panier = JSON.stringify(panier);
var prenom = document.querySelector("#firstName");
prenom.classList.add("regex_texte");
var nom = document.querySelector("#lastName");
nom.classList.add("regex_texte");
var ville = document.querySelector("#city");
ville.classList.add("regex_texte");
// on pointe l'input adresse
var adresse = document.querySelector("#address");
adresse.classList.add("regex_adresse");
// on pointe l'input email
var email = document.querySelector("#email");
email.classList.add("regex_email");
// on pointe les élément qui ont la classe .regex_texte
var regexTexte = document.querySelectorAll(".regex_texte");
// modification du type de l'input type email à text à cause d'un comportement de l'espace blanc non voulu vis à vis de la regex 
document.querySelector("#email").setAttribute("type", "text");

//--------------------------------------------------------------
//regex 
//--------------------------------------------------------------
// /^ début regex qui valide les caratères a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 31 caratères (nombre de caractère maximum sur carte identité) {1,31} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
let regexLettre = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
// /^ début regex qui valide les caratères chiffre lettre et caratères spéciaux a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 60 caratères (nombre de caractère maximum sur carte identité) {1,60} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
let regValideEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
//--------------------------------------------------------------
{
    regexTexte.forEach((regexTexte) =>
        regexTexte.addEventListener("input", (e) => {
            // valeur sera la valeur de l'input en dynamique
            valeur = e.target.value;
            // regNormal sera la valeur de la réponse regex, 0 ou -1
            let regNormal = valeur.search(regexLettre);
            if (regNormal === 0) {
                contactClient.firstName = prenom.value;
                contactClient.lastName = nom.value;
                contactClient.city = ville.value;
            }
            if (
                contactClient.city !== "" &&
                contactClient.lastName !== "" &&
                contactClient.firstName !== "" &&
                regNormal === 0
            ) {
                contactClient.regexNormal = 3;
            } else {
                contactClient.regexNormal = 0;
            }
            localStorage.contactClient = JSON.stringify(contactClient);
            couleurRegex(regNormal, valeur, regexTexte);
            valideClic();
        })
    );

    //------------------------------------
    // le champ écouté via la regex regexLettre fera réagir, grâce à texteInfo, la zone concernée
    //------------------------------------
    texteInfo(regexLettre, "#firstNameErrorMsg", prenom);
    texteInfo(regexLettre, "#lastNameErrorMsg", nom);
    texteInfo(regexLettre, "#cityErrorMsg", ville);
    //--------------------------------------------------------------
    // Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
    //--------------------------------------------------------------
    if (page.match("cart")) {
        let regexAdresse = document.querySelector(".regex_adresse");
        regexAdresse.addEventListener("input", (e) => {
            // valeur sera la valeur de l'input en dynamique
            valeur = e.target.value;
            // regNormal sera la valeur de la réponse regex, 0 ou -1
            let regAdresse = valeur.search(regexChiffreLettre);
            if (regAdresse == 0) {
                contactClient.address = adresse.value;
            }
            if (contactClient.address !== "" && regAdresse === 0) {
                contactClient.regexAdresse = 1;
            } else {
                contactClient.regexAdresse = 0;
            }
            localStorage.contactClient = JSON.stringify(contactClient);
            couleurRegex(regAdresse, valeur, regexAdresse);
            valideClic();
        });
    }
    //------------------------------------
    // le champ écouté via la regex regexChiffreLettre fera réagir, grâce à texteInfo, la zone concernée
    //------------------------------------
    texteInfo(regexChiffreLettre, "#addressErrorMsg", adresse);
    //--------------------------------------------------------------
    // Ecoute et attribution de point(pour sécurité du clic) si ce champ est ok d'après les regex
    //--------------------------------------------------------------

    let regexEmail = document.querySelector(".regex_email");
    regexEmail.addEventListener("input", (e) => {
        // valeur sera la valeur de l'input en dynamique
        valeur = e.target.value;
        // https://webdevdesigner.com/q/what-characters-are-allowed-in-an-email-address-65767/ mon adresse doit avoir cette forme pour que je puisse la valider
        let regMatch = valeur.match(regMatchEmail);
        // quand le resultat sera correct, le console log affichera une autre réponse que null; regValide sera la valeur de la réponse regex, 0 ou -1
        let regValide = valeur.search(regValideEmail);
        if (regValide === 0 && regMatch !== null) {
            panier.email = email.value;
            panier.regexEmail = 1;
        } else {
            panier.regexEmail = 0;
        }
        localStorage.panier = JSON.stringify(panier);
        couleurRegex(regValide, valeur, regexEmail);
        valideClic();
    });

    //------------------------------------
    // texte sous champ email
    //------------------------------------
    email.addEventListener("input", (e) => {
        // valeur sera la valeur de l'input en dynamique
        valeur = e.target.value;
        let regMatch = valeur.match(regMatchEmail);
        let regValide = valeur.search(regValideEmail);
        // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
        if (valeur === "" && regMatch === null) {
            document.querySelector("#emailErrorMsg").textContent = "Veuillez renseigner votre email.";
            document.querySelector("#emailErrorMsg").style.color = "white";
            // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
        } else if (regValide !== 0) {
            document.querySelector("#emailErrorMsg").innerHTML = "Caractère non valide";
            document.querySelector("#emailErrorMsg").style.color = "white";
            // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
        } else if (valeur != "" && regMatch == null) {
            document.querySelector("#emailErrorMsg").innerHTML = "Caratères acceptés pour ce champ. Forme email pas encore conforme";
            document.querySelector("#emailErrorMsg").style.color = "white";
        } else {
            document.querySelector("#emailErrorMsg").innerHTML = "Forme email conforme.";
            document.querySelector("#emailErrorMsg").style.color = "white";
        }
    });

    //--------------------------------------------------------------
    // fonction couleurRegex qui modifira la couleur de l'input par remplissage tapé, aide visuelle et accessibilité
    //--------------------------------------------------------------
    // on détermine une valeur de départ à valeur qui sera un string
    let valeurEcoute = "";
    // fonction à 3 arguments réutilisable, la regex, la valeur d'écoute, et la réponse à l'écoute
    function couleurRegex(regSearch, valeurEcoute, inputAction) {
        // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
        if (valeurEcoute === "" && regSearch != 0) {
            inputAction.style.backgroundColor = "white";
            inputAction.style.color = "black";
            // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
        } else if (valeurEcoute !== "" && regSearch != 0) {
            inputAction.style.backgroundColor = "rgb(220, 50, 50)";
            inputAction.style.color = "white";
            // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
        } else {
            inputAction.style.backgroundColor = "rgb(0, 138, 0)";
            inputAction.style.color = "white";
        }
    }
    //--------------------------------------------------------------
    // fonction d'affichage individuel des paragraphes sous input sauf pour l'input email
    //--------------------------------------------------------------
    function texteInfo(regex, pointage, zoneEcoute) {
        if (page.match("cart")) {
            zoneEcoute.addEventListener("input", (e) => {
                // valeur sera la valeur de l'input en dynamique
                valeur = e.target.value;
                index = valeur.search(regex);
                // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
                if (valeur === "" && index != 0) {
                    document.querySelector(pointage).textContent = "Veuillez renseigner ce champ.";
                    document.querySelector(pointage).style.color = "white";
                    // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
                } else if (valeur !== "" && index != 0) {
                    document.querySelector(pointage).innerHTML = "Reformulez cette donnée";
                    document.querySelector(pointage).style.color = "white";
                    // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
                } else {
                    document.querySelector(pointage).innerHTML = "Caratères acceptés pour ce champ.";
                    document.querySelector(pointage).style.color = "white";
                }
            });
        }
    }
    //--------------------------------------------------------------
    // Fonction de validation/d'accés au clic du bouton du formulaire
    //--------------------------------------------------------------
    let commande = document.querySelector("#order");
    // la fonction sert à valider le clic de commande de manière interactive
    function valideClic() {
        let contactRef = JSON.parse(localStorage.getItem("contactClient"));
        let somme =
            contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
        if (somme === 5) {
            commande.removeAttribute("disabled", "disabled");
            document.querySelector("#order").setAttribute("value", "Commander !");
        } else {
            commande.setAttribute("disabled", "disabled");
            document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
        }
    }
    //----------------------------------------------------------------
    // Envoi de la commande
    //----------------------------------------------------------------
    if (page.match("cart")) {
        commande.addEventListener("click", (e) => {
            // empeche de recharger la page on prévient le reload du bouton
            e.preventDefault();
            valideClic();
            envoiPaquet();
        });
    }
    //----------------------------------------------------------------
    // fonction récupérations des id puis mis dans un tableau
    //----------------------------------------------------------------
    // définition du panier quine comportera que les id des produits choisi du local storage
    let panierId = [];
    function tableauId() {
        // appel des ressources
        let panier = JSON.parse(localStorage.getItem("panier"));
        // récupération des id produit dans panierId
        if (panier && panier.length > 0) {
            for (let indice of panier) {
                panierId.push(indice._id);
            }
        } else {
            console.log("le panier est vide");
            document.querySelector("#order").setAttribute("value", "Panier vide!");
        }
    }
    //----------------------------------------------------------------
    // fonction récupération des donnée client et panier avant transformation
    //----------------------------------------------------------------
    let contactRef;
    let commandeFinale;
    function paquet() {
        contactRef = JSON.parse(localStorage.getItem("panier"));
        // définition de l'objet commande
        commandeFinale = {
            contact: {
                firstName: contactRef.firstName,
                lastName: contactRef.lastName,
                address: contactRef.address,
                city: contactRef.city,
                email: contactRef.email,
            },
            products: panierId,
        };
    }
    //----------------------------------------------------------------
    // fonction sur la validation de l'envoi
    //----------------------------------------------------------------
    function envoiPaquet() {
        tableauId();
        paquet();
        // vision sur le paquet que l'on veut envoyer
        console.log(commandeFinale);
        let somme = contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
        // si le panierId contient des articles et que le clic est autorisé
        if (panierId.length != 0 && somme === 5) {
            // envoi à la ressource api
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commandeFinale),
            })
                .then((res) => res.json())
                .then((data) => {
                    // envoyé à la page confirmation, autre écriture de la valeur "./confirmation.html?commande=${data.orderId}"
                    window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
                })
                .catch(function (err) {
                    console.log(err);
                    alert("erreur");
                });
        }
    };
