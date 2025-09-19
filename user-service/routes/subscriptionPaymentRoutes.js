const express = require('express');
const router = express.Router();
const SubscriptionPaymentController = require('../controllers/SubscriptionPaymentController');

router.get("/subscription/:subscription_id", SubscriptionPaymentController.getPaymentsBySubscription);
router.post("/", SubscriptionPaymentController.createPayment);

module.exports = router;