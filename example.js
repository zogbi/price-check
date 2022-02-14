const puppeteer = require('puppeteer');
const fs = require('fs');
const merge = require('lodash.merge');



async function getMyAmazon(data) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(data);
    await page.goto(data);
    const myproductPrice = await page.$eval('#twister-plus-price-data-price', el => el.value);
    const myproductID = await page.$eval('#ASIN', el => el.value);
    const myproductName = await page.$eval('#productTitle', el => el.textContent);
    const jsonMyProduct = {
        productName: myproductName.trim(),
        productID: myproductID,
        productPrice: myproductPrice
    };
    console.log(jsonMyProduct);
    await browser.close();
    return jsonMyProduct;
}

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

const loadData = (path) => {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) {
        console.error(err)
        return false
    }
}


(async () => {

    const testeaqui = [
        "https://www.amazon.com.br/dp/B07FNFPSWL",
        "https://www.amazon.com.br/dp/B07LB6XSZJ",
        "https://www.amazon.com.br/dp/B0823BN8FR",
        "https://www.amazon.com.br/dp/B07FN7T3WD/"
    ]

    const objMyAmazon = {};
    objMyAmazon = Object.assign(objMyAmazon, await getMyAmazon(testeaqui[0]));

    objMyAmazon = Object.assign(objMyAmazon, await getMyAmazon(testeaqui[1]));
    console.log("tentou merge: ", objMyAmazon);

    console.log("Voltou:", objMyAmazon);

    storeData(objMyAmazon, "sample.json");

    console.log(loadData("sample.json"));


})();
//FUTURE
//Slack notify
//https://blog.nodeswat.com/simple-node-js-and-slack-webhook-integration-d87c95aa9600