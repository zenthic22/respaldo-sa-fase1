const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');

router.get("/user/:user_id", SubscriptionController.getSubscriptionsByUser);
router.post("/", SubscriptionController.createSubscription);
router.put("/:id", SubscriptionController.updateSubscription);
router.delete("/:id", SubscriptionController.deleteSubscription);
router.put("/:id/cancel", SubscriptionController.cancelSubscription);
router.put("/:id/activate", SubscriptionController.activateSubscription);
router.put("/:id/expired", SubscriptionController.expireSubscription);

module.exports = router;