import express from "express";
import { deleteUser, getAllUsers } from "../controller/user";
import { authorization } from "../API/authorization";

const router = express.Router();

router.get("/get", getAllUsers);
router.delete("/:id", authorization, deleteUser);
export default router;
