import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Content } from './models/content.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/contentdb';
const PORT = process.env.PORT || 3002;

await mongoose.connect(MONGO_URI);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// health
app.get('/health', (_, res) => res.json({ ok: true }));

// listar (básico) filtrado por plan y ventana vigente
app.get('/catalog', async (req, res) => {
  const plan = (req.query.plan || 'FREE').toUpperCase();
  const now = new Date();
  const items = await Content.find({
    plans: plan,
    availability: { $elemMatch: { start_at: { $lte: now }, end_at: { $gte: now } } }
  })
  .sort({ popularity_score: -1, _id: -1 })
  .select({ title: 1, media: 1 })
  .limit(30)
  .lean();

  // primer poster
  const map = items.map(c => ({
    id: c._id,
    title: c.title,
    poster_url: c.media?.find(m => m.type==='poster')?.url || c.media?.[0]?.url || null
  }));
  res.json(map);
});

// detalle
app.get('/contents/:id', async (req, res) => {
  const item = await Content.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: 'not found' });
  res.json(item);
});

// búsqueda
app.get('/catalog/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  const plan = (req.query.plan || 'FREE').toUpperCase();
  if (!q) return res.status(400).json({ message: 'q requerido' });
  const now = new Date();

  const results = await Content.find({
    $text: { $search: q },
    plans: plan,
    availability: { $elemMatch: { start_at: { $lte: now }, end_at: { $gte: now } } }
  })
  .sort({ created_at: -1 })
  .select({ title: 1, media: 1 })
  .limit(50)
  .lean();

  res.json(results.map(c => ({
    id: c._id,
    title: c.title,
    poster_url: c.media?.find(m => m.type==='poster')?.url || null
  })));
});

app.listen(PORT, () => console.log(`Content Service on :${PORT}`));
