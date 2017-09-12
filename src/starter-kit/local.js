const index = require('../index');
const util = require('./util');

index.run({
    headless: false,
    slowMo: process.env.SLOWMO_MS,
    dumpio: !!util.DEBUG,
    // use chrome installed by puppeteer
}).then(
    (result) => console.log(result)
).catch(
    (err) => console.error(err)
);
