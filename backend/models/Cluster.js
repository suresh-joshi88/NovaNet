import mongoose from "mongoose";

const clusterSchema = new mongoose.Schema({
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }],
  centroid: {
    ra: { type: Number, required: true },
    dec: { type: Number, required: true },
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  score: { type: Number, default: 0 }, // optional metric for correlation strength
}, {
  timestamps: true,
});

const Cluster = mongoose.model("Cluster", clusterSchema);
export default Cluster;
