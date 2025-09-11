import express from "express";
import { signin, signup } from "./auth.controllers";

const router = express.Router();

router.post("/up", signup);
router.post("/in", signin);

export default router;
