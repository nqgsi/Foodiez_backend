import express from "express";
import { signin, signup } from "./auth.controllers";
import { upload } from "../Middleware/multer";
const router = express.Router();

router.post("/up", upload.single("image"), signup);
router.post("/in", signin);

export default router;
