const Path = require('path');
const axios = require('axios');
const fs = require('fs');

const downloadPdf = async (url, filename) => {
  console.log('URL', url, '\n');
  const pdfPath = Path.resolve(__dirname, '../temp', filename);
  const writer = fs.createWriteStream(pdfPath);
  const resp = await axios({
    url: url,
    method: 'GET',
    responseType: 'stream',
  });

  resp.data.pipe(writer);
};

module.exports = downloadPdf;
