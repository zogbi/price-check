var files = require('./services/files.js');
var myBrowse = require('./services/getBrowse.js');
var utils = require('./services/utils.js');
var slack = require('./services/slack.js');
var keys = require('./configs/keys.local.js');

(async () => {
    var arrMyAmazon = [];

    // O arquivo referencePrice.json guarda os produtos que vão ser checados pelo sistema e o preço alvo para disparar o aviso.
    const myReferencePrices = files.loadData("./config/referencePrice.local.json");

    for (const index in myReferencePrices) {
        urlProduct = myReferencePrices[index].productURL;
        const objProduct = await myBrowse.getMyAmazon(urlProduct);
        arrMyAmazon.push(objProduct);
        const results = myReferencePrices.filter(obj => {
            return obj.productID === objProduct.productID;
        });
        console.log("referencia: ", results);
        console.log("atual: ", objProduct);
        if (results[0].productPrice > objProduct.productPrice) {
            console.log("hora de comprar: ", objProduct.productName)

            // a Função esperpera os seguintes parametros slack.makeMyMessage(Canal ou usuário, nome textual do produto, preço atual do produto, URL da loja direto do produto) 
            myMessage = slack.makeMyMessage("@fabricio.zogbi", objProduct.productName, objProduct.productPrice, urlProduct);

            slack.sendNotify(keys.slack, myMessage);
        } else {
            console.log("não ta valendo a pena")
        }
        console.log("--------------------------------");
        console.log("--------------------------------");
    }

    console.log("Resposta completa:", arrMyAmazon);

    files.storeData(arrMyAmazon, "./debug/stored-result.json");
})();