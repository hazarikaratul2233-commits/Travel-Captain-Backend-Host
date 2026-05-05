import express from "express";
import { 
    authenticateAdmin, 
    authenticateUser 
} from "../controllers/authentication.controller.js";

const router = express.Router();

router.post("/", authenticateUser);
router.post("/admin", authenticateAdmin);

export default router;