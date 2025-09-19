const express = require('express');
const router = express.Router();
const PromotionController = require('../controllers/PromotionController');

router.get("/", PromotionController.getAllPromotions);
router.post("/", PromotionController.createPromotion);
router.post("/assign", PromotionController.assignPromotion);
router.get("/user/:user_id", PromotionController.getPromotionsByUser);
router.get("/user/:user_id/active", PromotionController.getActivePromotionsByUser);
router.get("/user/:user_id/best", PromotionController.getBestPromotionByUser);

module.exports = router;