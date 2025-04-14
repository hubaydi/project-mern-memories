import express from "express";

const router = express.Router();

import { signin, signup } from "../controllers/users.controller.js";

router.post("/sign-in", signin);
router.post("/sign-up", signup);

export default router;