import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// URL of the zip file on GitHub (raw link)
const zipUrlEnglish = 'https://raw.githubusercontent.com/emonxxx11/zip-file-apk/main/MissionPay.zip';
const zipUrlBangla = 'https://raw.githubusercontent.com/emonxxx11/zip-file-apk/main/MissionPay%20বাংলা_.zip';

// Endpoint for English zip download proxy
app.get('/download/english', async (req, res) => {
  try {
    const response = await fetch(zipUrlEnglish);
    if (!response.ok) return res.status(502).send('Failed to fetch file');

    res.setHeader('Content-Disposition', 'attachment; filename="MissionPay-English.zip"');
    res.setHeader('Content-Type', 'application/zip');

    response.body.pipe(res);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint for Bangla zip download proxy
app.get('/download/bangla', async (req, res) => {
  try {
    const response = await fetch(zipUrlBangla);
    if (!response.ok) return res.status(502).send('Failed to fetch file');

    res.setHeader('Content-Disposition', 'attachment; filename="MissionPay-Bangla.zip"');
    res.setHeader('Content-Type', 'application/zip');

    response.body.pipe(res);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Simple root endpoint
app.get('/', (req, res) => {
  res.send('MissionPay backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
