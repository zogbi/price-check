var files = require('./services/files.js');
var slack = require('./services/slack.js');
var keys = require('./config/keys.local.js');
const arrTest = files.loadData("stored-result.json");
const arrTestReference = files.loadData("referencePrice.json");

console.log(arrTest);

const results = arrTest.filter(obj => {
    return obj.productID === "B07LB6XSZJ";
});

console.log("--------------------------------");
console.log(results);

console.log("--------------------------------");
console.log(Number(results[0].productPrice) > 1000);

for (const key in arrTest) {
    if (Object.hasOwnProperty.call(arrTest, key)) {
        const element = arrTest[key];

        const results = arrTestReference.filter(obj => {
            return obj.productID === element.productID;
        });
        console.log("referencia: ", results);
        console.log("atual: ", element);

        console.log(results[0].productPrice, " x ", element.productPrice);
        if (results[0].productPrice > element.productPrice) {
            console.log("hora de comprar: ", element.productName)
            myMessage = slack.makeMyMessage("@fabricio.zogbi", element.productName, element.productPrice, "https://www.youtube.com/");

            slack.sendNotify(keys.slack, myMessage);
        } else {
            console.log("não ta valendo a pena")
        }
        console.log("--------------------------------");
        console.log("--------------------------------");
    }
}