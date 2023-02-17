import { Router } from "express";
import {
  addMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from "../controllers/messageController";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.route("/add").post(addMessage);
router.route("/delete").post(deleteMessage);
router.route("/me").get(isAuthenticatedUser, getMessages);

export default router;
