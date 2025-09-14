import express from "express";
import multer from "multer";
import { createEvent , getEvents, uploadEvents } from "../controllers/eventController.js";
import { eventValidationRules , validateEvent } from "../middleware/validateEvent.js";

const router = express.Router();
const upload = multer({dest:"uploads/"});

router.post("/events",eventValidationRules,validateEvent,createEvent);
router.get("/events",getEvents);
router.post("/events/upload",upload.single("file"),uploadEvents);

export default router;