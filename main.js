var files = require('./functions/files.js');
var myBrowse = require('./functions/getBrowse.js');
var utils = require('./functions/utils.js');
var slack = require('./functions/slack.js');

(async () => {

    const arrMyProducts = [
        "https://www.amazon.com.br/dp/B07FNFPSWL",
        "https://www.amazon.com.br/dp/B07LB6XSZJ",
        "https://www.amazon.com.br/dp/B0823BN8FR",
        "https://www.amazon.com.br/dp/B07FN7T3WD/"
    ]

    var arrMyAmazon = [];
    for (const index in arrMyProducts) {
        arrMyAmazon.push(await myBrowse.getMyAmazon(arrMyProducts[index]));
        await utils.sleep(12000);
    }
    //arrMyAmazon.push(await getMyAmazon(arrMyProducts[1]));
    console.log("tentou merge: ", arrMyAmazon);

    console.log("Voltou:", arrMyAmazon);

    files.storeData(arrMyAmazon, "stored-result.json");

    console.log(files.loadData("stored-result.json"));


})();