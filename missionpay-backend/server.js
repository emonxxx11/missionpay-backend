import express from 'express';
import fetch from 'node-fetch';
import unzipper from 'unzipper';
import { pipeline } from 'stream';
import { promisify } from 'util';

const app = express();
const PORT = process.env.PORT || 8080;
const pipe = promisify(pipeline);

app.get('/', (req, res) => {
  res.send('✅ MissionPay Backend is Live');
});

// URLs
const ENGLISH_ZIP_URL = 'https://raw.githubusercontent.com/emonxxx11/zip-file-apk/main/MissionPay.zip';
const BANGLA_ZIP_URL = 'https://raw.githubusercontent.com/emonxxx11/zip-file-apk/main/MissionPay%20বাংলা_.zip';

// Endpoint to download and unzip
app.get('/download/:lang', async (req, res) => {
  const lang = req.params.lang;
  const zipUrl = lang === 'bangla' ? BANGLA_ZIP_URL : ENGLISH_ZIP_URL;

  try {
    const response = await fetch(zipUrl);

    if (!response.ok) {
      return res.status(500).send('❌ Failed to download ZIP file.');
    }

    const zipStream = response.body.pipe(unzipper.ParseOne());

    res.setHeader('Content-Disposition', `attachment; filename="MissionPay-${lang}.apk"`);
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');

    await pipe(zipStream, res);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Server error while unzipping and sending the file.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
