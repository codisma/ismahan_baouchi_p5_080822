

function savePanier(panier) {
    localStorage.setItem("panier", JSON.stringify(panier))
}

function getPanier() {
    let panier = localStorage.getItem("panier")
    if (panier == null) {
        return []
    } else {
        return JSON.parse(panier)
    }
}
//ajout du produit 
function addPanier(produit) {
    let panier = getPanier()
    let foundProduit = panier.find(p => p.id == produit.id) && panier.find(p => p.color == produit.color)
    if (foundProduit != undefined) {
        foundProduit.quantite += produit.quantite
    } else {
        panier.push(produit)
    }
    savePanier(panier)
}
//supression du produit 
function removeFromPanier(produit) {
    let panier = getPanier()
    // a tester 
    // panier.filter(p => p.id !== produit.id && p => p.color !== produit.color)
    panier = panier.filter(p => p.trueId != produit.id)
    savePanier(panier)
}

 // gestion de l'ajout de quantité 
function addQuantity(produit) {
    let panier = getPanier()
    //console.log(panier)
    let findProduit = panier.find(p => p.trueId == produit.id)
    if (findProduit  != undefined) {
        findProduit.quantity = produit.quantity
    }
    savePanier(panier)
}