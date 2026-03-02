const { setWorldConstructor, Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');
const envConfig = require('../../utils/envConfig');

setDefaultTimeout(30_000);

class CustomWorld {
  constructor({ attach, log, parameters }) {
    this.attach = attach;
    this.log = log;
    this.parameters = parameters;
    this.browser = null;
    this.context = null;
    this.page = null;
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  logger.info(`Launching browser (env: ${envConfig.env}, headed: ${envConfig.headed})`);
  this.browser = await chromium.launch({ headless: !envConfig.headed });

  const videoDir = path.resolve('reports/videos');
  fs.mkdirSync(videoDir, { recursive: true });

  this.context = await this.browser.newContext({
    recordVideo: { dir: videoDir },
  });
  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
});

After(async function ({ result, pickle }) {
  const isFailed = result?.status === Status.FAILED;
  const timestamp = Date.now();
  const safeName = pickle.name.replace(/[^a-zA-Z0-9]/g, '_');

  if (isFailed) {
    const screenshotDir = path.resolve('reports/screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, `${safeName}_${timestamp}.png`);
    const screenshot = await this.page.screenshot({ fullPage: true });
    fs.writeFileSync(screenshotPath, screenshot);
    this.attach(screenshot, 'image/png');
    logger.error(`Screenshot saved: ${screenshotPath}`);


    const traceDir = path.resolve('reports/traces');
    fs.mkdirSync(traceDir, { recursive: true });
    const tracePath = path.join(traceDir, `${safeName}_${timestamp}.zip`);
    await this.context.tracing.stop({ path: tracePath });
    logger.error(`Trace saved: ${tracePath}`);
  } else {
    await this.context.tracing.stop();
  }

  const video = this.page.video();
  await this.page.close();

  if (video) {
    if (isFailed) {
      const videoDir = path.resolve('reports/videos');
      const newVideoPath = path.join(videoDir, `${safeName}_${timestamp}.webm`);
      await video.saveAs(newVideoPath);
      logger.error(`Video saved: ${newVideoPath}`);
    } else {
      await video.delete();
    }
  }

  logger.info('Closing browser');
  if (this.browser) {
    await this.browser.close();
  }
});
