import express from "express";
import { listClusters } from "../controllers/clusterController.js";
import { protect } from "../middleware/authMiddleware.js"; // remove protect if not using auth

const router = express.Router();

// GET /api/clusters
router.get("/", protect, listClusters);

export default router;
