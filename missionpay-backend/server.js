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

// ZIP file URLs
const ENGLISH_ZIP_URL = 'https://raw.githubusercontent.com/emonxxx11/zip-file-apk/main/𝑴𝒊𝒔𝒔𝒊𝒐𝒏𝑷𝒂𝒚.zip';
const BANGLA_ZIP_URL = 'https://raw.githubusercontent.com/emonxxx11/zip-file-apk/main/𝑴𝒊𝒔𝒔𝒊𝒐𝒏𝑷𝒂𝒚 বাংলা.zip';

app.get('/download/:lang', async (req, res) => {
  const lang = req.params.lang.toLowerCase();
  const zipUrl = lang === 'bangla' ? BANGLA_ZIP_URL : ENGLISH_ZIP_URL;

  try {
    const response = await fetch(zipUrl);

    if (!response.ok) {
      console.error(`❌ Failed to fetch ZIP file: ${response.status}`);
      return res.status(500).send('❌ Failed to download ZIP file.');
    }

    const zipStream = response.body.pipe(unzipper.ParseOne());

    res.setHeader('Content-Disposition', `attachment; filename="MissionPay-${lang}.apk"`);
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');

    // Optional: timeout protection
    res.setTimeout(30000, () => {
      console.warn('⚠️ Download timed out');
      res.destroy();
    });

    // Stream error handler
    zipStream.on('error', (err) => {
      console.error('❌ Zip stream error:', err);
      if (!res.headersSent) {
        res.status(500).send('❌ Stream error while unzipping.');
      } else {
        res.destroy();
      }
    });

    // Main pipeline with fallback
    await pipe(zipStream, res).catch((err) => {
      console.error('❌ Pipeline error:', err);
      if (!res.headersSent) {
        res.status(500).send('❌ Failed while streaming APK.');
      } else {
        res.destroy();
      }
    });

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    if (!res.headersSent) {
      res.status(500).send('❌ Server error while unzipping and sending the file.');
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
