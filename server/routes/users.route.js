import express from "express";

const router = express.Router();

import { signin, signup } from "../controllers/users.controller.js";
import { validateSignIn, validateSignUp } from "../middleware/validationSchema.js";

router.post("/sign-up", validateSignUp(), signup);
router.post("/sign-in", validateSignIn(), signin);

export default router;