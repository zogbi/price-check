const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com.br/dp/B07ZHFM7JK/');
    const myproductPrice = await page.$eval('#twister-plus-price-data-price', el => el.value);
    const myproductID = await page.$eval('#ASIN', el => el.value);
    const myproductName = await page.$eval('#productTitle', el => el.textContent);
    //console.log(element);
    const jsonMyProduct = {
        productName: myproductName.trim(),
        productID: myproductID,
        productPrice: myproductPrice
    };

    storeData(jsonMyProduct, "sample.json");

    await browser.close();
})();

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

const loadData = (path) => {
    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        console.error(err)
        return false
    }
}

//FUTURE
//Slack notify
//https://blog.nodeswat.com/simple-node-js-and-slack-webhook-integration-d87c95aa9600