const index = require('../index');
const config = require('./config');
const chromium = require('chrome-aws-lambda');

(async () => {
    // when running locally, chrome-aws-lambda will use the full puppeteer
    // that is included in the devDependencies
    // see: https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development

    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,

        slowMo: process.env.SLOWMO_MS,
        dumpio: !!config.DEBUG,
    });
    await index.run(browser)
    .then((result) => console.log(result))
    .catch((err) => console.error(err));
    await browser.close();
})();
