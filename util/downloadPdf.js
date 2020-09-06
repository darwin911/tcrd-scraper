const Path = require('path');
const axios = require('axios');
const fs = require('fs');

const downloadPdf = async (url) => {
  const pdfPath = Path.resolve(__dirname, '../temp', 'test.pdf');
  const writer = fs.createWriteStream(pdfPath);
  const resp = await axios({
    url: url,
    method: 'GET',
    responseType: 'stream',
  });

  console.log(resp.data);

  let result = resp.data.pipe(writer);
  console.log(result);
};

module.exports = downloadPdf;
