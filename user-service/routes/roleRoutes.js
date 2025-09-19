const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/RoleController");
const UserRoleController = require("../controllers/UserRoleController");

// Asignación de roles a usuarios
router.post("/assign", UserRoleController.assignRole);
router.delete("/assign", UserRoleController.removeRole);

// Roles
router.get("/", RoleController.getAllRoles);
router.get("/:id", RoleController.getRoleById);
router.post("/", RoleController.createRole);
router.put("/:id", RoleController.updateRole);
router.delete("/:id", RoleController.deleteRole);

module.exports = router;