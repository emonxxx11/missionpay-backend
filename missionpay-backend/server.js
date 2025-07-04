const express = require('express');
const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const zipUrl = 'https://raw.githubusercontent.com/emonxxx11/zip-file-apk/main/MissionPay.zip';

app.get('/download', async (req, res) => {
  try {
    const response = await axios.get(zipUrl, { responseType: 'arraybuffer' });
    const zipBuffer = Buffer.from(response.data, 'binary');

    const zip = new AdmZip(zipBuffer);
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    zip.extractAllTo(tempDir, true);
    const files = fs.readdirSync(tempDir);
    const filePath = path.join(tempDir, files[0]);

    res.download(filePath, files[0], () => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Failed to process download.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
