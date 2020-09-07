const puppeteer = require('puppeteer');
const fs = require('fs');
const data = require('./sentencias.json');

// const baseURL =
// 'https://www.tribunalconstitucional.gob.do/consultas/secretar%C3%ADa/sentencias/tc094918/';

// detail page
// https://www.tribunalconstitucional.gob.do/consultas/secretar%C3%ADa/sentencias/tc094918/",

// const baseURL =
// 'https://www.tribunalconstitucional.gob.do/consultas/secretar%C3%ADa/sentencias?searchString=&filtery=&criteriay=';

const options = { headless: false, devtools: true };

(async () => {
  const browser = await puppeteer.launch(options);
  // browser.on('targetchanged', (target) => console.log(target));

  const page = await browser.newPage();

  // await page._client.send('Page.setDownloadBehavior', {
  //   behavior: 'allow',
  //   downloadPath: './pdfs',
  // });

  let pdfLinks = [];

  for (let i = 0; i < data.length; i++) {
    const [url] = data[i];

    console.log('Navigating to:', url, '\n');

    await page.goto(url, { waitUntil: 'networkidle2' });

    const pdfHref = await page.evaluate(
      () => document.querySelector('#princ > div > div.col-xs-12.col-sm-8.col-lg-9 > div > a').href
    );

    console.log('Adding pdf url:', pdfHref, '\n');

    pdfLinks.push(pdfHref);

    console.log(`${pdfLinks.length} / ${data.length} compiled.`, '\n');
  }

  console.log(JSON.stringify(pdfLinks, null, '\t'), pdfLinks.length);

  fs.writeFileSync('pdf-links.json', JSON.stringify(pdfLinks, null, '\t'));

  // for (let j = 0; j < pdfLinks.length; j++) {
  //   const pdfLink = pdfLinks[j];
  //   console.log('Going to', pdfLink);
  //   await page.goto(pdfLink, { waitUntil: 'networkidle2' });
  //   const pdfBuffer = await page.pdf();
  // }

  await browser.close();
})();

// setTimeout(() => console.log('nothing'), 1000);
// const response = await page.goto(pdfHref, { waitUntil: 'networkidle2' });

// await page._client.send('Page.setDownloadBehavior', {
//   behavior: 'allow',
//   downloadPath: `pdfs/document${i}`,
// });
// console.log('response: ', response);
// const content = await response.buffer();
// fs.writeFileSync(`pdfs/document${i}`, content);

// https://www.tribunalconstitucional.gob.do/consultas/secretar%C3%ADa/sentencias?searchString=&filtery=&criteriay=
// await page.goto(baseURL, { waitUntil: 'networkidle2' });
// const list = await page.evaluate(() =>
//   Array.from(
//     document.querySelectorAll('#print > div.barra > section > ul > li:nth-child(5)')
//   ).map((item) => item.textContent)
// );

// fs.writeFileSync('sentencias.json', JSON.stringify(sentencias, null, '\t'), (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('The file has been saved!');
// });
