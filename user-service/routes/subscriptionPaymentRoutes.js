const express = require('express');
const router = express.Router();
const SubscriptionPaymentController = require('../controllers/SubscriptionPaymentController');

router.get("/subscription/:subscription_id", SubscriptionPaymentController.getPaymentsBySubscription);
router.post("/", SubscriptionPaymentController.createPayment);

router.post("/intent", SubscriptionPaymentController.createStripeIntent);

router.get("/config/stripe", (req, res) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY })
})

module.exports = router;