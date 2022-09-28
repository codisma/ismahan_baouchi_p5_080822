function savePanier(produit) {
    localStorage.setItem("produit", JSON.stringify(produit))
}

function getPanier() {
    let panier = localStorage.getItem("produit")
    if (panier == null) {
        return []
    } else {
        return JSON.parse(panier)
    }
}
//ajout du produit 
function addPanier(produit) {
    let panier = getPanier()
    //console.log(panier)
    //console.log(produit)
    let foundProduct = panier.find(p => p.id == produit.id) && panier.find(p => p.couleur == produit.couleur)
    if (foundProduct != undefined) {
        foundProduct.quantite += produit.quantite
    } else {
        panier.push(produit)
    }
    savePanier(panier)
}
//supression du produit 
function removeFromPanier(produit) {
    let panier = getPanier()
    panier = panier.filter(p => p.id !== produit.id || p.couleur !== produit.couleur)
    savePanier(panier)
}

// gestion de l'ajout de quantité 
function addQuantity(produit) {
    let panier = getPanier()
    //console.log(panier)
    let findProduit = panier.find(p => p.id == produit.id) && panier.find(p => p.couleur == produit.couleur)
    if (findProduit != undefined) {
        findProduit.quantite = produit.quantite
    }
    savePanier(panier)
}