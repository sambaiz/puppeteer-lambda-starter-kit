const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const fs = require('fs');
const tar = require('tar');
const puppeteer = require('puppeteer');
const config = require('./config');

exports.getBrowser = (() => {
  let browser;
  return async () => {
    if (typeof browser === 'undefined') {
      await setupChrome();
      browser = await puppeteer.launch({
        headless: true,
        executablePath: config.executablePath,
        args: config.launchOptionForLambda,
        dumpio: !!exports.DEBUG,
      });
      debugLog(`launch done: ${await browser.version()}`);
    }
    return browser;
  };
})();

const setupChrome = async () => {
  if (!await existsExecutableChrome()) {
    if (await existsLocalChrome()) {
      debugLog('setup local chrome');
      await setupLocalChrome();
    } else {
      debugLog('setup s3 chrome');
      await setupS3Chrome();
    }
    debugLog('setup done');
  }
};

const existsLocalChrome = () => {
  return new Promise((resolve, reject) => {
    fs.exists(config.localChromePath, (exists) => {
      resolve(exists);
    });
  });
};

const existsExecutableChrome = () => {
  return new Promise((resolve, reject) => {
    fs.exists(config.executablePath, (exists) => {
      resolve(exists);
    });
  });
};

const setupLocalChrome = () => {
    return new Promise((resolve, reject) => {
      fs.createReadStream(config.localChromePath)
      .on('error', (err) => reject(err))
      .pipe(tar.x({
        C: config.setupChromePath,
      }))
      .on('error', (err) => reject(err))
      .on('end', () => resolve());
    });
};

const setupS3Chrome = () => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: config.remoteChromeS3Bucket,
        Key: config.remoteChromeS3Key,
      };
      s3.getObject(params)
      .createReadStream()
      .on('error', (err) => reject(err))
      .pipe(tar.x({
        C: config.setupChromePath,
      }))
      .on('error', (err) => reject(err))
      .on('end', () => resolve());
    });
};

const debugLog = (log) => {
    if (config.DEBUG) console.log(log);
};
