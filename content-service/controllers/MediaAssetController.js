const MediaAsset = require('../models/MediaAsset');

exports.getMediaAssetsByContent = async (req, res) => {
    const { content_id } = req.params;

    try {
        const assets = await MediaAsset.getByContent(content_id);
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createMediaAsset = async (req, res) => {
    const { content_id, type, url } = req.body;
    try {
        if (!content_id || !type || !url) {
            return res.status(400).json({ message: "Faltan campos obligatorios (content_id, type, url)" });
        }
        const newId = await MediaAsset.create(content_id, type, url);
        res.status(201).json({ message: "Media asset creado", id: newId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateMedia = async (req, res) => {
  const { id } = req.params;
  const { type, url } = req.body;

  try {
    const updated = await MediaAsset.update(id, type, url);
    if (!updated) {
      return res.status(404).json({ message: "Media asset no encontrado" });
    }
    res.json({ message: "Media asset actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await MediaAsset.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Media asset no encontrado" });
    }
    res.json({ message: "Media asset eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};