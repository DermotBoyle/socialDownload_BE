'use strict';
const {getChrome} = require('./chrome-script')
const puppeteer = require('puppeteer');


// 'https://twitter.com/shanetodd/status/1493884291838787586'

module.exports.getTwitterMedia = async (event, ctx, done) => {

  const {url: twitterUrl} = event.queryStringParameters;
  const regex = /(?:(?:https?|ftp):\/\/)?[\w\/\-?=%.]+\.[\w\/\-&?=%.]+/gm;
  const chrome = await getChrome();
  let mediaResult = ""; 

  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
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
            mediaResult = url
          }
      })
  
      await page.goto(`${twitterUrl}`,{
          waitUntil: "networkidle0",
          timeout: 0,
      });
  
    await browser.close();
  
  done(null, mediaResult)
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
