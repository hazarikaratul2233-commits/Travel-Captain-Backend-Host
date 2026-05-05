import express from "express";
import {
  createAgency,
  getAllAgencies,
  getPendingAgencies,
  getApprovedAgencies,
  getAgencyById,
  updateAgency,
  deleteAgency,
  requestAgency,
  getRequestedAgencies
} from "../controllers/agency.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.post("/", createAgency);
router.get("/", getAllAgencies);
router.get("/pending", getPendingAgencies);
router.get("/requested", getRequestedAgencies);
router.get("/approved", getApprovedAgencies);
router.post(
  "/request/:id", 
  upload.fields([
    { name: "pan", maxCount: 1 },
    { name: "adharFront", maxCount: 1 },
    { name: "adharBack", maxCount: 1 },
  ]), 
  requestAgency
);
router.get("/:id", getAgencyById);
router.put("/:id", updateAgency);
router.delete("/:id", deleteAgency);

export default router;
