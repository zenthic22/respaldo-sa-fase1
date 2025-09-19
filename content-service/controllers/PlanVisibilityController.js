const PlanVisibility = require('../models/PlanVisibility');

// Obtener todos los planes de un contenido
exports.getPlansByContent = async (req, res) => {
  const { content_id } = req.params;
  try {
    const plans = await PlanVisibility.getByContent(content_id);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una visibilidad de plan
exports.createPlanVisibility = async (req, res) => {
  const { content_id, plan } = req.body;
  try {
    if (!content_id || !plan) {
      return res.status(400).json({ message: "Faltan campos obligatorios (content_id, plan)" });
    }
    const newId = await PlanVisibility.create(content_id, plan);
    res.status(201).json({ message: "Visibilidad de plan creada", id: newId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un plan de visibilidad
exports.updatePlanVisibility = async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;

  try {
    if (!plan) {
      return res.status(400).json({ message: "El campo 'plan' es obligatorio" });
    }

    const updated = await PlanVisibility.update(id, plan);
    if (!updated) {
      return res.status(404).json({ message: "Visibilidad no encontrada" });
    }
    res.json({ message: "Visibilidad de plan actualizada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un plan de visibilidad
exports.deletePlanVisibility = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await PlanVisibility.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Visibilidad no encontrada" });
    }
    res.json({ message: "Visibilidad de plan eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};