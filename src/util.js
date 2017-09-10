const CHROME_BUCKET = process.env.CHORME_BUCKET;
const CHROME_KEY = process.env.CHROME_KEY || 'headless_shell.tar.gz';
const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const fs = require('fs');
const tar = require('tar');
const path = require('path');

const localChromePath = path.join('headless_shell.tar.gz');
const setupChromePath = path.join(path.sep, 'tmp');

exports.DEBUG = process.env.DEBUG;

exports.setupChrome = async () => {
  if (!await existsExecutableChrome()) {
    if (await existsLocalChrome()) {
      exports.debugLog('setup local chrome');
      await setupLocalChrome();
    } else {
      exports.debugLog('setup s3 chrome');
      await setupS3Chrome();
    }
    exports.debugLog('setup done');
  }
  return executablePath;
};

const executablePath = path.join(
  setupChromePath,
  'headless_shell'
);

const existsLocalChrome = () => {
  return new Promise((resolve, reject) => {
    fs.exists(localChromePath, (exists) => {
      resolve(exists);
    });
  });
};

const existsExecutableChrome = () => {
  return new Promise((resolve, reject) => {
    fs.exists(executablePath, (exists) => {
      resolve(exists);
    });
  });
};

const setupLocalChrome = () => {
    return new Promise((resolve, reject) => {
      console.log(localChromePath);
      fs.createReadStream(localChromePath)
      .on('error', (err) => reject(err))
      .pipe(tar.x({
        C: setupChromePath,
      }))
      .on('error', (err) => reject(err))
      .on('end', () => resolve());
    });
};

const setupS3Chrome = () => {
    return new Promise((resolve, reject) => {
      const params = {Bucket: CHROME_BUCKET, Key: CHROME_KEY};
      s3.getObject(params)
      .createReadStream()
      .on('error', (err) => reject(err))
      .pipe(tar.x({
        C: setupChromePath,
      }))
      .on('error', (err) => reject(err))
      .on('end', () => resolve());
    });
};

exports.debugLog = (log) => {
    if (exports.DEBUG) console.log(log);
};
