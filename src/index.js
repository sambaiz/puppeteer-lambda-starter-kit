const puppeteer = require('puppeteer');
const config = require('./config');
const util = require('./util');

exports.handler = async (event, context, callback) => {
  exports.run({
    headless: true,
    chromePath: await util.setupChrome(),
  }).then(
    (result) => callback(null, result)
  ).catch(
    (err) => callback(err)
  );
};

exports.run = async (option) => {
  const browser = await puppeteer.launch({
    headless: option.headless,
    executablePath: option.chromePath,
    slowMo: option.slowMoMs,
    args: config.launchOptionForLambda,
    dumpio: !!util.DEBUG,
  });

  util.debugLog(`Chrome launched, version ${await browser.version()}`);

  const page = await browser.newPage();
  await page.goto('https://www.google.co.jp');
  browser.close();

  return 'done';
};
