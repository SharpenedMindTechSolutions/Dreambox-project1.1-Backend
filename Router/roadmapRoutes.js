import express from "express";
import {
  generateRoadmap,
  getRoadmapById,
  getRoadmapsByUser,
  deleteRoadmapById,
  downloadRoadmapAsPDF,
} from "../Controller/roadmapController.js";

const router = express.Router();

// Define routes
router.post("/generate-roadmap", generateRoadmap);
router.get("/:id", getRoadmapById);
router.get("/user/:userId", getRoadmapsByUser);
router.delete("/:id", deleteRoadmapById);
router.get("/:id/download", downloadRoadmapAsPDF);



export default router;
