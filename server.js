const express = require('express');
const puppeteer = require('puppeteer');
const downloadPdf = require('./util/downloadPdf');
let sentencias = require('./sentencias.json');

const app = express();
const port = process.env.PORT || 5000;

app.get('/', async (req, res) => {
  console.log(sentencias.length);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < sentencias.length; i++) {
    await page.goto(sentencias[i][0], { waitUntil: 'networkidle2' });
    const pdfUrl = await page.evaluate(() => {
      return document.querySelector('#princ > div > div.col-xs-12.col-sm-8.col-lg-9 > div > a')
        .href;
    });

    const splitName = pdfUrl.split('/');
    const fileName = splitName[splitName.length - 1];

    console.log(`${i + 1} of ${sentencias.length}`);
    console.log(`Downloading... ${fileName}`);

    await downloadPdf(pdfUrl, fileName);
  }

  await browser.close();

  res.json({
    message: 'Ok',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
