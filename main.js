var files = require('./functions/files.js');
var myBrowse = require('./functions/getBrowse.js');
var utils = require('./functions/utils.js');
var slack = require('./functions/slack.js');
var keys = require('./functions/keys.local.js');

(async () => {
    var arrMyAmazon = [];
    const arrMyProducts = [
        "https://www.amazon.com.br/dp/B07FNFPSWL",
        "https://www.amazon.com.br/dp/B07LB6XSZJ",
        "https://www.amazon.com.br/dp/B0823BN8FR",
        "https://www.amazon.com.br/dp/B07FN7T3WD/"
    ];
    const myReferencePrices = files.loadData("referencePrice.json");


    for (const index in arrMyProducts) {
        urlProduct = arrMyProducts[index];
        const objProduct = await myBrowse.getMyAmazon(urlProduct);
        arrMyAmazon.push(objProduct);
        const results = myReferencePrices.filter(obj => {
            return obj.productID === objProduct.productID;
        });
        console.log("referencia: ", results);
        console.log("atual: ", objProduct);
        if (results[0].productPrice > objProduct.productPrice) {
            console.log("hora de comprar: ", objProduct.productName)
            myMessage = slack.makeMyMessage("@fabricio.zogbi", objProduct.productName, objProduct.productPrice, urlProduct);

            slack.sendNotify(keys.slack, myMessage);
        } else {
            console.log("não ta valendo a pena")
        }
        console.log("--------------------------------");
        console.log("--------------------------------");
    }

    console.log("Resposta completa:", arrMyAmazon);

    // files.storeData(arrMyAmazon, "stored-result.json");

    // console.log(files.loadData("stored-result.json"));


})();