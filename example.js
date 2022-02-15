const puppeteer = require('puppeteer');
const fs = require('fs');


async function getMyAmazon(data) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--window-position=0,0 --window-size=1,1']
    });
    const page = await browser.newPage();
    console.log(data);
    await page.goto(data);
    // const response = await page.goto(data);
    // const data1 = await response.buffer();
    //console.log(page);
    //storeData(await data1.toString('utf8'), "amazon.html");
    const myproductPrice = await page.$eval('#twister-plus-price-data-price', el => el.value);
    const myproductID = await page.$eval('#ASIN', el => el.value);
    const myproductName = await page.$eval('#productTitle', el => el.textContent);
    const jsonMyProduct = {
        productName: myproductName.trim(),
        productID: myproductID,
        productPrice: myproductPrice
    };
    console.log(jsonMyProduct);

    await sleep(5000);
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

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async () => {

    const myProductsCheck = [
        "https://www.amazon.com.br/dp/B07FNFPSWL",
        "https://www.amazon.com.br/dp/B07LB6XSZJ",
        "https://www.amazon.com.br/dp/B0823BN8FR",
        "https://www.amazon.com.br/dp/B07FN7T3WD/"
    ]

    var arrMyAmazon = [];
    myProductsCheck.forEach(element => {
        console.log(element);
        arrMyAmazon.push(await getMyAmazon(element));
        sleep(5000);
    });


    //arrMyAmazon.push(await getMyAmazon(testeaqui[1]));
    console.log("tentou merge: ", arrMyAmazon);

    console.log("Voltou:", arrMyAmazon);

    storeData(arrMyAmazon, "sample.json");

    console.log(loadData("sample.json"));


})();
//FUTURE
//Slack notify
//https://blog.nodeswat.com/simple-node-js-and-slack-webhook-integration-d87c95aa9600