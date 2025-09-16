import mongoose from "mongoose";

const clusterSchema = new mongoose.Schema(
  {
    score: Number,
    centroid: { ra: Number, dec: Number },
    startTime: Date,
    endTime: Date,
    events: [{ type: mongoose.Schema.Types.Mixed }],
    explanation: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.models.Cluster ||
  mongoose.model("Cluster", clusterSchema);
