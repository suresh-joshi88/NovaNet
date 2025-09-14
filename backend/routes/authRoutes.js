import express from "express";
import {registerUser , loginUser} from "../controllers/authController.js";
import { registerValidationRules , loginValidationRules, validateAuth } from "../middleware/validateEvent.js";

const router = express.Router();

router.post("/register",registerValidationRules,validateAuth,registerUser);
router.post("/login",loginValidationRules,validateAuth,loginUser);

export default router;