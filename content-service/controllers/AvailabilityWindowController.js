const AvailabilityWindow = require('../models/AvailabilityWindow');

exports.getAvailabilityByContent = async (req, res) => {
  const { content_id } = req.params;

  try {
    const availability = await AvailabilityWindow.getByContent(content_id);
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAvailability = async (req, res) => {
  const { content_id, start_date, end_date } = req.body;

  try {
    if (!content_id || !start_date || !end_date) {
      return res
        .status(400)
        .json({ message: "Faltan campos obligatorios (content_id, start_date, end_date)" });
    }

    const newId = await AvailabilityWindow.create(content_id, start_date, end_date);
    res.status(201).json({ message: "Disponibilidad creada", id: newId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { start_date, end_date } = req.body;

  try {
    const updated = await AvailabilityWindow.update(id, start_date, end_date);
    if (!updated) {
      return res.status(404).json({ message: "Ventana no encontrada" });
    }
    res.json({ message: "Ventana actualizada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await AvailabilityWindow.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Ventana no encontrada" });
    }
    res.json({ message: "Ventana eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};