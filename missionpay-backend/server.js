import express from 'express';
import fetch from 'node-fetch';
import unzipper from 'unzipper';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 3000;

async function fetchAndExtractZip(url, extractPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch zip');
  await new Promise((resolve, reject) => {
    response.body
      .pipe(unzipper.Extract({ path: extractPath }))
      .on('close', resolve)
      .on('error', reject);
  });
}

async function streamZippedFolder(res, folderPath, outputFilename) {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${outputFilename}`);

  const archive = archiver('zip');
  archive.on('error', err => { throw err; });

  archive.pipe(res);
  archive.directory(folderPath, false);
  await archive.finalize();
}

app.get('/download/english', async (req, res) => {
  const zipUrl = 'https://github.com/emonxxx11/zip-file-apk/raw/main/MissionPay.zip';
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'missionpay-english-'));

  try {
    await fetchAndExtractZip(zipUrl, tmpDir);
    await streamZippedFolder(res, tmpDir, 'MissionPay-English.zip');
    // You can add code here to clean tmpDir after streaming
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing English download');
  }
});

app.get('/download/bangla', async (req, res) => {
  const zipUrl = 'https://github.com/emonxxx11/zip-file-apk/raw/main/MissionPay বাংলা_.zip';
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'missionpay-bangla-'));

  try {
    await fetchAndExtractZip(zipUrl, tmpDir);
    await streamZippedFolder(res, tmpDir, 'MissionPay বাংলা_.zip');
    // Clean tmpDir if desired
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing Bangla download');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
