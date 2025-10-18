import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { signup,login,logout,onboard } from "../controllers/auth.controller.js";

const router=express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.post("/onboarding",protectRoute,onboard);

export default router;