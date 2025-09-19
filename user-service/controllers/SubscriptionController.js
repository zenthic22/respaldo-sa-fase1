const { Subscription } = require("../models");

// Obtener suscripciones de un usuario
exports.getSubscriptionsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const subs = await Subscription.getByUser(user_id);
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear suscripción
exports.createSubscription = async (req, res) => {
  const { user_id, plan_code, start_date, end_date, status } = req.body;
  try {
    const subId = await Subscription.create(user_id, plan_code, start_date, end_date, status);
    res.status(201).json({ message: "Suscripción creada", id: subId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar suscripción
exports.updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { plan_code, start_date, end_date, status } = req.body;
  try {
    await Subscription.update(id, plan_code, start_date, end_date, status);
    res.json({ message: "Suscripción actualizada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar suscripción
exports.deleteSubscription = async (req, res) => {
  const { id } = req.params;
  try {
    await Subscription.deleteById(id);
    res.json({ message: "Suscripción eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  const { id } = req.params;
  try {
    await Subscription.cancel(id);
    res.json({ message: "Suscripcion cancelada" });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

exports.activateSubscription = async (req, res) => {
  const { id } = req.params;
  try {
    await Subscription.activate(id);
    res.json({ message: "Suscripcion activada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.expireSubscription = async (req, res) => {
  const { id } = req.params;
  try {
    await Subscription.expire(id);
    res.json({ message: "Suscripcion expirada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}