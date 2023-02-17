import { Router } from "express";
import {
  register,
  verifyRegistration,
  resendOTP,
  login,
  logout,
  loadUser,
} from "../controllers/authController";
import {
  isAuthenticatedUser,
  authorizeRoles,
  isLoggedUser,
} from "../middlewares/auth";

const router = Router();

router.route("/register").post(isLoggedUser, register);
router.route("/register/verify").get(isLoggedUser, verifyRegistration);
router.route("/resendOTP").get(isLoggedUser, resendOTP);
router.route("/login").post(isLoggedUser, login);
router.route("/logout").get(isAuthenticatedUser, logout);
router.route("/me").get(isAuthenticatedUser, loadUser);

export default router;
