const fs = require('fs');
const pdf = require('pdf-parse');
const sentencias = require('./sentencias.json');

(async () => {
  console.log('Running PDF Parser');

  let dataBuffer = fs.readFileSync('tc-0115-20-tc-05-2016-0146.pdf');

  const data = await pdf(dataBuffer);
  // number of pages
  console.log(data.numpages);
  // number of rendered pages
  console.log(data.numrender);
  // PDF info
  console.log(data.info);
  // PDF metadata
  console.log(data.metadata);
  // PDF.js version
  // check https://mozilla.github.io/pdf.js/getting_started/
  console.log(data.version);
  // PDF text
  console.log('content:', data.text.length);

  console.log(sentencias);
})();
