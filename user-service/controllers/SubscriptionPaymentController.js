const { SubscriptionPayment, Subscription, User } = require("../models");

// Obtener pagos de una suscripción
exports.getPaymentsBySubscription = async (req, res) => {
  const { subscription_id } = req.params;
  try {
    const pagos = await SubscriptionPayment.getBySubscription(subscription_id);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registrar pago
exports.createPayment = async (req, res) => {
  const { subscription_id, amount, currency, provider, provider_ref, status, paid_at, failure_reason, promotion_id } = req.body;
  try {
    const paymentId = await SubscriptionPayment.create(subscription_id, amount, currency, provider, provider_ref, status, paid_at, failure_reason, promotion_id);
        
    res.status(201).json({ message: "Pago registrado", id: paymentId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};