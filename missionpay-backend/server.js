const express = require('express');
const fetch = require('node-fetch');
const AdmZip = require('adm-zip');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Example endpoint: /download?lang=english
app.get('/download', async (req, res) => {
  const lang = req.query.lang === 'bangla' ? 'MissionPay%20বাংলা_.zip' : 'MissionPay.zip';

  const fileUrl = `https://raw.githubusercontent.com/emonxxx11/zip-file-apk/main/${lang}`;

  try {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();

    const zip = new AdmZip(buffer);
    const zipOut = new AdmZip();

    zip.getEntries().forEach(entry => {
      zipOut.addFile(entry.entryName, entry.getData());
    });

    const zipBuffer = zipOut.toBuffer();
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename="missionpay_extracted.zip"`);
    res.send(zipBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Failed to download or unzip the file.');
  }
});

app.get('/', (req, res) => {
  res.send('✅ MissionPay Backend is Running.');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
