const puppeteer = require('puppeteer');
const config = require('./starter-kit/config');
const util = require('./starter-kit/util');

exports.handler = async (event, context, callback) => {
  exports.run({
    headless: true,
    executablePath: await util.setupChrome(),
    args: config.launchOptionForLambda,
    dumpio: !!util.DEBUG,
  }).then(
    (result) => callback(null, result)
  ).catch(
    (err) => callback(err)
  );
};

exports.run = async (launchOption) => {
  const browser = await puppeteer.launch(launchOption);

  util.debugLog(`Chrome launched, version ${await browser.version()}`);

  const page = await browser.newPage();
  await page.goto('https://www.google.co.jp');
  browser.close();

  return 'done';
};
