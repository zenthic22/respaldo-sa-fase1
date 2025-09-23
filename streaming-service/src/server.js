import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(cors({ origin: '*' }));

const VIDEO_DIR = process.env.VIDEO_DIR || path.join(__dirname, '..', 'videos');
const PORT = process.env.PORT || 4000;

app.get('/stream/:file', (req, res) => {
  const filePath = path.join(VIDEO_DIR, req.params.file);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'not found' });

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }
  const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
  const start = parseInt(startStr, 10);
  const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
  if (isNaN(start) || isNaN(end) || start > end || end >= fileSize) {
    return res.status(416).set('Content-Range', `bytes */${fileSize}`).end();
  }
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': end - start + 1,
    'Content-Type': 'video/mp4'
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Streaming Service on :${PORT}, dir=${VIDEO_DIR}`));
