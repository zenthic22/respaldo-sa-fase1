// models/Content.js
const mongoose = require('../config/db');

// Para mantener el enum que ya usas
const CONTENT_TYPES = ['MOVIE', 'SERIES'];

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    release_date: { type: Date, default: null },
    type: { type: String, enum: CONTENT_TYPES, required: true },
    rating: { type: Number, default: null },
    duration: { type: Number, default: null },            // minutos (películas)
    video_filename: { type: String, default: null },      // ej: sample1.mp4
    poster_url: { type: String, default: null },
    // relación a géneros
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  },
  { timestamps: true }
);

const ContentModel = mongoose.model('Content', ContentSchema);

// Helpers
const isValidId = (id) => mongoose.isValidObjectId(id);
const toDateOrNull = (v) => (v ? new Date(v) : null);
const toNumberOrNull = (v) =>
  v === '' || v === null || typeof v === 'undefined' ? null : Number(v);

// Mapea doc/lean a DTO con id y géneros {id,name}
function toDTO(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;

  // mapear géneros si están populados
  const genres = Array.isArray(o.genres)
    ? o.genres.map((g) =>
        g && typeof g === 'object'
          ? { id: g._id?.toString?.() || g.toString(), name: g.name }
          : { id: g.toString(), name: undefined }
      )
    : [];

  return {
    id: o._id.toString(),
    title: o.title,
    description: o.description || '',
    release_date: o.release_date || null,
    type: o.type,
    rating: o.rating,
    duration: o.duration,
    video_filename: o.video_filename || null,
    poster_url: o.poster_url || null,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
    genres,
  };
}

class Content {
  // Obtener todos los contenidos con géneros
  static async getAll() {
    const docs = await ContentModel.find({})
      .populate({ path: 'genres', select: 'name' })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((d) => toDTO(d));
  }

  // Crear contenido con géneros (espera genres como array de IDs string)
  static async create(data) {
    const payload = {
      title: (data.title || '').trim(),
      description: (data.description || '').trim(),
      release_date:
        data.release_date ? toDateOrNull(data.release_date) : null,
      type: data.type,
      rating: toNumberOrNull(data.rating),
      duration: toNumberOrNull(data.duration),
      video_filename: data.video_filename || null,
      poster_url: data.poster_url || null,
      genres: Array.isArray(data.genres)
        ? data.genres.filter(isValidId) // sólo IDs válidos
        : [],
    };

    const doc = await ContentModel.create(payload);
    return doc._id.toString();
  }

  // Buscar contenido por id (con géneros)
  static async getById(id) {
    if (!isValidId(id)) return null;
    const doc = await ContentModel.findById(id)
      .populate({ path: 'genres', select: 'name' });
    return toDTO(doc);
  }

  // Actualizar contenido (y sus géneros si vienen)
  static async update(id, data) {
    if (!isValidId(id)) return false;

    const set = {};
    if (data.title !== undefined) set.title = String(data.title).trim();
    if (data.description !== undefined) set.description = String(data.description).trim();
    if (data.release_date !== undefined) set.release_date = toDateOrNull(data.release_date);
    if (data.type !== undefined) set.type = data.type;
    if (data.rating !== undefined) set.rating = toNumberOrNull(data.rating);
    if (data.duration !== undefined) set.duration = toNumberOrNull(data.duration);
    if (data.video_filename !== undefined) set.video_filename = data.video_filename || null;
    if (data.poster_url !== undefined) set.poster_url = data.poster_url || null;

    // géneros (reemplazo completo si vienen)
    if (Array.isArray(data.genres)) {
      set.genres = data.genres.filter(isValidId);
    }

    const res = await ContentModel.updateOne(
      { _id: id },
      { $set: set }
    );

    return res.matchedCount > 0;
  }

  // Eliminar contenido
  static async delete(id) {
    if (!isValidId(id)) return false;
    const res = await ContentModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }
}

module.exports = Content;