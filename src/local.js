const index = require('./index');

index.run({
    headless: false,
    slowMoMs: 250,
    // use chrome installed by puppeteer
}).then(
    (result) => console.log(result)
).catch(
    (err) => console.error(err)
);
