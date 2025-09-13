import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    source: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    time: { type: Date, required: true }, 
    ra: { type: Number, required: true, min: 0, max: 360 },
    dec: { type: Number, required: true, min: -90, max: 90 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
