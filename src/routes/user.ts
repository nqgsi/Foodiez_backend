import express from "express";
import { deleteUser, getAllUsers } from "../controller/user";

const router = express.Router();

router.get("/get", getAllUsers);
router.delete("/:id", deleteUser);
export default router;
