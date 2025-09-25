import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['poster','still','backdrop'], required: true },
  url:  { type: String, required: true },
  sort_order: { type: Number, default: 0 }
}, { _id: false });

const AvailabilitySchema = new mongoose.Schema({
  start_at: { type: Date, required: true },
  end_at:   { type: Date, required: true }
}, { _id: false });

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  synopsis: String,
  released_at: Date,
  classification: String,
  language: String,
  duration_minutes: Number,
  is_recommended: { type: Boolean, default: false },
  popularity_score: { type: Number, default: 0 },
  genres: [String], // para simplificar
  media: [MediaSchema],
  availability: [AvailabilitySchema],
  plans: [String]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

ContentSchema.index({ title: 'text', synopsis: 'text' });
export const Content = mongoose.model('Content', ContentSchema);
