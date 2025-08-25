"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_interface_1 = require("./user.interface");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.createZodSchema), user_controller_1.UserControllers.createUser);
router.get("/all-users", (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getUsers);
router.get("/me", (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getMe);
// /api/v1/user/:id
router.patch("/:id", (0, validateRequest_1.default)(user_validation_1.updateZodSchema), (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.updateUser);
router.patch("/status/:userId", (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.statusUser);
exports.UserRoutes = router;
