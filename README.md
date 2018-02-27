# Puppeteer Lambda Starter Kit

Starter Kit for running Headless-Chrome by [Puppeteer](https://github.com/GoogleChrome/puppeteer) on AWS Lambda.

It can use alone and also supported [Serverless Framework](https://github.com/serverless/serverless).

## Download

### Use alone

This is simple and don't need IAM role but you have to deploy package by yourself. Don't worry, even if you will become to use Serverless in the future, what you should do for migration is little.

```
$ git clone -o starter-kit https://github.com/sambaiz/puppeteer-lambda-starter-kit.git your_project_name
```

### Use with Serverless Framework

Serverless Framework can manage settings with CloudFormation and deploy.

```
$ serverless install --url https://github.com/sambaiz/puppeteer-lambda-starter-kit --name your_project_name
```

## Run on local

By executing `SLOWMO_MS=250 npm run local`, you can check the operation while actually viewing the chrome (non-headless, slowmo).

## Packaging & Deploy

Lambda's memory needs to be set to at least 384 MB, but the more memory, the better the performance of any operations.

```
512MB -> goto(youtube): 6.481s
1536MB -> goto(youtube): 2.154s
```

### chrome in package (recommended)

If you use alone, run `npm run package`, and deploy the package.zip. 

If you use with Serverless, run `serverless deploy` (this runs `npm run package` when packaging).

### chrome NOT in package

Due to the large size of Chrome, it may exceed the [Lambda package size limit](http://docs.aws.amazon.com/lambda/latest/dg/limits.html) (50MB) depending on the other module to include. 
In that case, put Chrome in S3 and download it at container startup so startup time will be longer.

Run `npm run package-nochrome`, deploy the package.zip, and set following env valiables on Lambda.

- `CHROME_BUCKET`(required): S3 bucket where Chrome is put
- `CHROME_KEY`(optional): S3 key. default: `headless-chromium.tar.gz`

## Build Headless Chromium (optional)

This kit includes Chromium built using [serverless-chrome](https://github.com/adieuadieu/serverless-chrome)'s [ec2-build.sh](https://github.com/adieuadieu/serverless-chrome/blob/master/docs/chrome.md#with-aws-ec2) script because official build Chrome installed by Puppeteer has problems about running on Lambda (missing shared library etc.).

If you want to use own build, link to `headless-chromium.tar.gz` in `chrome` dir.

## Article

[Lambda上でPuppeteer/Headless Chromeを動かすStarter Kitを作った - sambaiz-net](https://www.sambaiz.net/article/132/)
