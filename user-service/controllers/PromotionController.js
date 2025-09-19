const { Promotion, PromotionAssignment } = require("../models");

// Obtener todas las promociones
exports.getAllPromotions = async (req, res) => {
  try {
    const promos = await Promotion.getAll();
    res.json(promos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear promoción
exports.createPromotion = async (req, res) => {
  const { name, type, value, start_at, end_at, active } = req.body;
  try {
    const promoId = await Promotion.create(name, type, value, start_at, end_at, active);
    res.status(201).json({ message: "Promoción creada", id: promoId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Asignar promoción a usuario
exports.assignPromotion = async (req, res) => {
  const { promotion_id, user_id, scope } = req.body;
  try {
    await PromotionAssignment.create(promotion_id, user_id, scope);
    res.status(201).json({ message: "Promoción asignada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPromotionsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const promos = await PromotionAssignment.getDetailsByUser(user_id);
    res.json(promos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivePromotionsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const promos = await PromotionAssignment.getActivePromotionsByUser(user_id);
    res.json(promos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBestPromotionByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const promo = await PromotionAssignment.getBestActivePromotionByUser(user_id);
    if (!promo) {
      return res.status(404).json({ message: "No hay promociones activas" });
    }
    res.json(promo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};