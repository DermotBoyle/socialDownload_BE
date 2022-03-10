const puppeteer = require('puppeteer');
const regex = /(?:(?:https?|ftp):\/\/)?[\w\/\-?=%.]+\.[\w\/\-&?=%.]+/gm;

(async () => {
const browser = await puppeteer.launch({
  headless: false
});

const page = await browser.newPage(); 

    page.on('response', async response => {

        if (response.request().resourceType() === 'xhr' && response.url().includes("https://twitter.com/i/api/graphql")) {
           const textResponse = await response.text()
           const arrayOfData = textResponse.split(',')

           const [ _, url, ...rest] = arrayOfData.filter((item) => typeof item === 'string' && item.includes("video.twimg.com")).flatMap((el) => {
            const url = el.match(regex)
                return url 
            })

          console.log(url);
        }
    })

    await page.goto('https://twitter.com/shanetodd/status/1493884291838787586',{
        waitUntil: "networkidle0",
        timeout: 0,
    });

  await browser.close();
    
})()
