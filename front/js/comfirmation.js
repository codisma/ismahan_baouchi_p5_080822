const commandes = JSON.parse(localStorage.getItem("commandes"));

const commandeDisplay = async () => {
    //console.log ("function");

    if (commandes) {
        await commandes;
        const dernierElement = commandes[commandes.length - 1];
        //console.log (dernierElement);

        limitedWidthBlock.innerHTML = `<div class="limitedWidthBlock" id="limitedWidthBlock">
    <div class="confirmation">
    <p>Commande validée ! <br>Votre numéro de commande est : ${dernierElement.order} </p>
    </div>`
    }
};
commandeDisplay();