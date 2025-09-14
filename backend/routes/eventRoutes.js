import express from "express";
import multer from "multer";
import { createEvent , getEvents, uploadEvents } from "../controllers/eventController.js";

const router = express.Router();
const upload = multer({dest:"uploads/"});

router.post("/events",createEvent);
router.get("/events",getEvents);
router.post("/events/upload",upload.single("file"),uploadEvents);

export default router;