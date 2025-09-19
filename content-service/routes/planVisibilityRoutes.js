const express = require("express");
const router = express.Router();
const PlanVisibilityController = require("../controllers/PlanVisibilityController");

router.get("/:content_id", PlanVisibilityController.getPlansByContent);
router.post("/", PlanVisibilityController.createPlanVisibility);
router.put("/:id", PlanVisibilityController.updatePlanVisibility);
router.delete("/:id", PlanVisibilityController.deletePlanVisibility);

module.exports = router;