import mongoose from 'mongoose';
import { Content } from './models/content.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/contentdb';
await mongoose.connect(MONGO_URI);

const now = new Date();
const plus30 = new Date(Date.now() + 30*24*3600*1000);

await Content.deleteMany({});

await Content.insertMany([
  {
    title: "Horizonte Rojo",
    synopsis: "Acción y aventura en el desierto.",
    released_at: new Date("2024-02-10"),
    classification: "PG-13",
    language: "spanish",
    duration_minutes: 110,
    is_recommended: true,
    popularity_score: 120,
    genres: ["Acción"],
    media: [{ type: 'poster', url: 'https://picsum.photos/seed/Horizonte_Rojo/400', sort_order: 0 }],
    availability: [{ start_at: now, end_at: plus30 }],
    plans: ["FREE","PREMIUM"]
  },
  {
    title: "Verdad Oculta",
    synopsis: "Thriller psicológico.",
    released_at: new Date("2023-10-05"),
    classification: "R",
    language: "spanish",
    duration_minutes: 98,
    is_recommended: false,
    popularity_score: 150,
    genres: ["Drama","Suspenso"],
    media: [{ type: 'poster', url: 'https://picsum.photos/seed/Verdad_Oculta/400', sort_order: 0 }],
    availability: [{ start_at: now, end_at: plus30 }],
    plans: ["PREMIUM"]
  }
]);

console.log("Seed OK");
process.exit(0);
