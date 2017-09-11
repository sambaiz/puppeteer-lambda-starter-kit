const index = require('../index');
const util = require('./util');

index.run({
    headless: false,
    slowMo: 250,
    dumpio: !!util.DEBUG,
    // use chrome installed by puppeteer
}).then(
    (result) => console.log(result)
).catch(
    (err) => console.error(err)
);
