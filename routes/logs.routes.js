import express from "express";
import {
  createLogs,
  getAllLogs,
  getLogByUserId,
  getLogByUserIdAndDate,
} from "../controllers/logs.controller.js";
import multer from "multer";


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createLogs);
router.get("/", getAllLogs);
router.get("/:id", getLogByUserId);
router.get("/:id/:date", getLogByUserIdAndDate);

export default router;
