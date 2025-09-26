const mongoose = require('../config/db');

// Schema con índice único en name
const GenreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

const GenreModel = mongoose.model('Genre', GenreSchema);

// Helper: mapea un doc de Mongo a un objeto con "id" en vez de "_id"
function toDTO(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id.toString(),
    name: o.name,
    description: o.description || '',
    created_at: o.createdAt,
    updated_at: o.updatedAt,
  };
}

class Genre {
  // Obtener todos los géneros
  static async getAll() {
    const docs = await GenreModel.find().sort({ name: 1 }).lean();
    return docs.map((d) => toDTO(d));
  }

  // Crear un nuevo género
  static async create(name, description) {
    const doc = await GenreModel.create({ name, description });
    return doc._id.toString();
  }

  // Obtener género por ID
  static async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await GenreModel.findById(id);
    return toDTO(doc);
  }

  // Actualizar género
  static async update(id, data) {
    if (!mongoose.isValidObjectId(id)) return false;
    const { name, description } = data || {};
    const res = await GenreModel.updateOne(
      { _id: id },
      { $set: { ...(name !== undefined ? { name } : {}), ...(description !== undefined ? { description } : {}) } }
    );
    // Mongoose 7: res.matchedCount / res.modifiedCount
    return res.matchedCount > 0;
  }

  // Eliminar género
  static async delete(id) {
    if (!mongoose.isValidObjectId(id)) return false;
    const res = await GenreModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }
}

module.exports = Genre;