const setup = require('./starter-kit/setup');

// this handler signature requires AWS Lambda Nodejs v8.1
exports.handler = async (event, context) => {
  const browser = await setup.getBrowser();

  return await exports.run(browser);
};

exports.run = async (browser) => {
  // implement here
  // this is sample
  const page = await browser.newPage();
  await page.goto('https://www.google.co.jp',
   {waitUntil: ['domcontentloaded', 'networkidle0']}
  );
  console.log((await page.content()).slice(0, 500));

  await page.type('input[name=q]', 'aaaaa');
  // avoid to timeout waitForNavigation() after click()
  await Promise.all([
    // avoid to
    // 'Cannot find context with specified id undefined' for localStorage
    page.waitForNavigation(),

    // puppeteer v1.3.0 seems to have a problem with SVG buttons
    // when using page.click() it errors with ""
    // see: https://github.com/GoogleChrome/puppeteer/issues/2977
    // a workaround is to execute the click in the browser
    //
    // page.click("input[name=btnK]"),
    page.evaluate(() => document.querySelector('input[name=btnK]').click()),
  ]);

  console.log(`page url after search: ${page.url()}`);

/* screenshot
  await page.screenshot({path: '/tmp/screenshot.png'});
  const aws = require('aws-sdk');
  const s3 = new aws.S3({apiVersion: '2006-03-01'});
  const fs = require('fs');
  const screenshot = await new Promise((resolve, reject) => {
    fs.readFile('/tmp/screenshot.png', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
  await s3.putObject({
    Bucket: '<bucket name>',
    Key: 'screenshot.png',
    Body: screenshot,
  }).promise();
*/

  // cookie and localStorage
  await page.setCookie({name: 'name', value: 'cookieValue'});
  console.log(await page.cookies());
  console.log(await page.evaluate(() => {
    localStorage.setItem('name', 'localStorageValue');
    return localStorage.getItem('name');
  }));
  await page.close();
  return 'done';
};
