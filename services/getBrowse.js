const puppeteer = require('puppeteer');
var files = require('./files.js');
var utils = require('./utils.js');

module.exports = {
    getMyAmazon: async function (data) {
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await utils.sleep(12000);
        console.log(data);
        await page.goto(data);
        const response = await page.goto(data);
        const data1 = await response.buffer();
        //console.log(page);
        try {
            files.storeData(data1.toString('utf8'), "./debug/debug-amazon-last-response.html");
        } catch (error) {
            console.log(error);
        }
        const myproductPrice = await page.$eval('#twister-plus-price-data-price', el => el.value);
        const myproductID = await page.$eval('#ASIN', el => el.value);
        const myproductName = await page.$eval('#productTitle', el => el.textContent);
        const jsonMyProduct = {
            productName: myproductName.trim(),
            productID: myproductID,
            productPrice: myproductPrice
        };
        console.log(jsonMyProduct);
        utils.sleep(10000);
        await browser.close();
        return jsonMyProduct;
    }
}