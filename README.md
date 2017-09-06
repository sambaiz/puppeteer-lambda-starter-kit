# puppteeer-lambda-boilerplate

Boilerplate for running Headless-Chrome by [Puppeteer](https://github.com/GoogleChrome/puppeteer) on AWS Lambda.

## Packaging & Deploy

Lambda's memory is set to 384 MB or more.

### chrome in package (recommend)

Run `npm run package`, and deploy the package.zip.

### chrome NOT in package

Due to the large size of Chrome, it may exceed the [Lambda package size limit](http://docs.aws.amazon.com/lambda/latest/dg/limits.html) (50 MB) depending on the other module to include. 
In that case, put Chrome in S3 and download it at container startup so startup time will be longer.

Run `npm run package-nochrome`, deploy the package.zip, and set following env valiables on Lambda.

- `CHROME_BUCKET`(required): S3 bucket where Chrome is put
- `CHROME_KEY`(optional): S3 key. default: headless_shell.tar.gz

## Build Headless-Chrome (optional)

If you want to use latest chrome, run chrome/buildChrome.sh on EC2 having at least 16GB memory and 30GB volume. 
See also [serverless-chrome](https://github.com/adieuadieu/serverless-chrome/blob/master/chrome/README.md).
Once you build it, link to headless_shell.tar.gz in /chrome.

## Reference

[記事](https://www.sambaiz.net/article/132/)
