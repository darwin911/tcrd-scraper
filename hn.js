const puppeteer = require('puppeteer');
const fs = require('fs');

// const baseURL = 'https://www.tribunalconstitucional.gob.do/consultas/secretar%C3%ADa/sentencias';
const baseURL =
  'https://www.tribunalconstitucional.gob.do/consultas/secretar%C3%ADa/sentencias?searchString=&filtery=&criteriay=';

(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();

  const getListItemTextContent = async (url, selector, max = -1) => {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const articles = await page.evaluate(
      ({ selector, max }) =>
        Array.from(document.querySelectorAll(selector))
          .map((item) => item.textContent)
          .slice(0, max),
      { selector, max }
    );
    return articles;
  };

  // const wikipediaArticles = await getListItemTextContent(
  //   'https://en.wikipedia.org/wiki/Main_page',
  //   'div#mp-itn > ul > li'
  // );
  // const hackerNewsArticles = await getListItemTextContent(
  //   'https://news.ycombinator.com/',
  //   'td.title > a',
  //   10
  // );

  // https://www.tribunalconstitucional.gob.do/consultas/secretar%C3%ADa/sentencias?searchString=&filtery=&criteriay=
  await page.goto(baseURL, { waitUntil: 'networkidle2' });
  const sentencias = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#table-content div.jspPane > table > tbody > tr')).map(
      (item) =>
        Array.from(item.children).reduce((acc, innerEl, idx) => {
          console.log(acc, idx);
          let mergedContent = [];
          switch (idx) {
            case 0:
              mergedContent.push(innerEl.childNodes[0].href, innerEl.textContent);
              break;
            default:
              mergedContent.push(innerEl.textContent);
              break;
          }
          return [...acc, mergedContent].flat();
        }, [])
    )
  );

  fs.writeFileSync('sentencias.json', JSON.stringify(sentencias, null, '\t'), (err) => {
    if (err) {
      throw err;
    }
    console.log('The file has been saved!');
  });

  await browser.close();
})();
