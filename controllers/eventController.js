import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { source, type, time, ra, dec, metadata } = req.body;

    if (!source || !type || time === undefined || ra === undefined || dec === undefined) {
      return res.status(400).json({ message: "Missing required fields: source,type,time,ra,dec" });
    }

    const parsedTime = new Date(time);
    if (isNaN(parsedTime.getTime())) {
      return res.status(400).json({ message: "Invalid time format. Use ISO string or epoch milliseconds." });
    }

    const parsedRa = Number(ra);
    const parsedDec = Number(dec);
    if (isNaN(parsedRa) || parsedRa < 0 || parsedRa > 360) {
      return res.status(400).json({ message: "ra must be a number in [0,360]" });
    }
    if (isNaN(parsedDec) || parsedDec < -90 || parsedDec > 90) {
      return res.status(400).json({ message: "dec must be a number in [-90,90]" });
    }

    const newEvent = new Event({
      source,
      type,
      time: parsedTime,
      ra: parsedRa,
      dec: parsedDec,
      metadata: metadata || {},
    });

    await newEvent.save();
    return res.status(201).json({ message: "Event created", event: newEvent });
  } catch (err) {
    console.error("createEvent error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 100);
    const skip = (page - 1) * limit;

    const total = await Event.countDocuments();
    const events = await Event.find().sort({ time: -1 }).skip(skip).limit(limit);

    return res.status(200).json({ page, limit, total, events });
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
