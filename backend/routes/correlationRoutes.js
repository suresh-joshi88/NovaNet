import express from "express";
import { getCorrelatedEvents } from "../controllers/correlationController.js";

const router = express.Router();

router.get("/events/correlate", getCorrelatedEvents);

export default router;
