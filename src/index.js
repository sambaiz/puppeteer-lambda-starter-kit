const puppeteer = require('puppeteer'),
      config = require('./config'),
      util = require('./util');

exports.handler = async (event, context, callback) => {
  run().then(
    (result) => { callback(null, result); }
  ).catch(
    (err)    => { callback(err); }
  )
}


const run = async () => {

  const chromePath = await util.setupChrome();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: config.launchOptionForLambda,
    dumpio: !!util.DEBUG,
  });  

  util.debugLog(`Chrome launched, version ${await browser.version()}`)
  
  const page = await browser.newPage();
  await page.goto('https://www.google.co.jp');
  browser.close();

  return 'done'
}