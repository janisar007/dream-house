import express from "express";
import { googleController, signinController, signupController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/google", googleController);

export default router;
