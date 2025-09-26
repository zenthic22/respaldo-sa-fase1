// models/ProfileFavorite.js
const mongoose = require('../config/db');

const isValidId = (id) => mongoose.isValidObjectId(id);

// Referencia al modelo Content (ya definido en models/Content.js)
const ProfileFavoriteSchema = new mongoose.Schema(
  {
    profile_id: { type: Number, required: true, index: true }, // id numérico del perfil (de tu otro servicio)
    content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  },
  { timestamps: true }
);

// Evita duplicados: un mismo content no puede repetirse para el mismo perfil
ProfileFavoriteSchema.index({ profile_id: 1, content: 1 }, { unique: true });

const ProfileFavoriteModel = mongoose.model('ProfileFavorite', ProfileFavoriteSchema);

// Helper: mapea Content (poblado) a DTO usado en tu frontend
function mapContentDTO(c) {
  if (!c) return null;
  const o = c.toObject ? c.toObject() : c;

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
    rating: o.rating,
    video_filename: o.video_filename || null,
    poster_url: o.poster_url || null,
    genres,
  };
}

class ProfileFavorite {
  constructor(id, profile_id, content) {
    this.id = id;
    this.profile_id = profile_id;
    this.content = content;
  }

  // Obtener favoritos de un perfil con detalles del contenido y géneros (populate)
  static async getByProfile(profile_id) {
    // Aceptamos tanto string como number; normalizamos a Number
    const pid = Number(profile_id);
    const docs = await ProfileFavoriteModel.find({ profile_id: pid })
      .populate({
        path: 'content',
        populate: { path: 'genres', select: 'name' }, // trae nombres de géneros
      })
      .sort({ createdAt: -1 })
      .lean({ getters: true });

    return docs.map((d) => {
      const contentDTO = mapContentDTO(d.content);
      return new ProfileFavorite(
        d._id.toString(),
        d.profile_id,
        contentDTO
      );
    });
  }

  // Agregar favorito
  // content_id debe ser ObjectId string del Content (no el id numérico antiguo)
  static async add(profile_id, content_id) {
    if (!isValidId(content_id)) {
      const err = new Error('content_id inválido');
      err.status = 400;
      throw err;
    }
    const pid = Number(profile_id);

    const doc = await ProfileFavoriteModel.create({
      profile_id: pid,
      content: content_id,
    });

    return doc._id.toString();
  }

  // Eliminar favorito
  static async remove(profile_id, content_id) {
    if (!isValidId(content_id)) return false;
    const pid = Number(profile_id);

    const res = await ProfileFavoriteModel.deleteOne({
      profile_id: pid,
      content: content_id,
    });
    return res.deletedCount > 0;
  }
}

module.exports = ProfileFavorite;