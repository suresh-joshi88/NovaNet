import Cluster from "../models/Cluster.js";

// Return last 100 persisted clusters
export const listClusters = async (req, res) => {
  try {
    const clusters = await Cluster.find().sort({ createdAt: -1 }).limit(100);
    res.json({ clusters });
  } catch (err) {
    console.error("listClusters error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
