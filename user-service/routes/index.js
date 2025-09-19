const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const roleRoutes = require("./roleRoutes");
const profileRoutes = require("./profileRoutes");
const subscriptionRoutes = require("./subscriptionRoutes");
const subscriptionPaymentRoutes = require("./subscriptionPaymentRoutes");
const promotionRoutes = require("./promotionRoutes");
const userAffinityRoutes = require("./userAffinityRoutes");
const userReportRoutes = require("./userReportsRoutes");

// Prefijos
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/profiles", profileRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/payments", subscriptionPaymentRoutes);
router.use("/promotions", promotionRoutes);
router.use("/affinities", userAffinityRoutes);
router.use("/reports", userReportRoutes);

module.exports = router;