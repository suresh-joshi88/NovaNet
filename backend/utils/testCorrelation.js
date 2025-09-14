import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../models/Event.js";
import { correlateEvents } from "./correlation.js";

dotenv.config();

const runTest = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Fetch all events
    const events = await Event.find();
    console.log("Total events fetched:", events.length);

    // Run correlation
    const clusters = correlateEvents(events, { timeWindowDays: 1, angleThreshold: 1 });

    console.log("Clusters found:", clusters.map(c => c.map(e => e._id)));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  }
};

runTest();
