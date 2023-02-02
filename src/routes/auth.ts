import express from "express";
const router = express.Router();

import { login, register, loadUser } from "../controllers/authController";

import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(isAuthenticatedUser, loadUser);

export default router;
