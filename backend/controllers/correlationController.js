import Event from "../models/Event.js";
import Cluster from "../models/Cluster.js";
import { correlateEvents } from "../utils/correlation.js";

export const getCorrelatedEvents = async (req, res) => {
  try {
    const persist = req.query.persist === "true";

    // 1️⃣ Fetch all events from DB
    const events = await Event.find().sort({ time: 1 });

    // 2️⃣ Run correlation logic
    const clusters = correlateEvents(events, { timeWindow: 24*60*60*1000, maxDistance: 1 });

    // 3️⃣ Optionally persist clusters
    let persistedClusters = [];
    if (persist && clusters.length > 0) {
      persistedClusters = await Promise.all(clusters.map(async (cluster) => {
        const raAvg = cluster.reduce((sum, e) => sum + e.ra, 0) / cluster.length;
        const decAvg = cluster.reduce((sum, e) => sum + e.dec, 0) / cluster.length;
        const startTime = new Date(Math.min(...cluster.map(e => e.time.getTime())));
        const endTime = new Date(Math.max(...cluster.map(e => e.time.getTime())));

        const newCluster = new Cluster({
          events: cluster.map(e => e._id),
          centroid: { ra: raAvg, dec: decAvg },
          startTime,
          endTime,
          score: cluster.length
        });

        await newCluster.save();
        return newCluster;
      }));
    }

    res.status(200).json({
      clusters: persist ? persistedClusters : clusters,
      message: persist ? "Clusters persisted" : "Clusters generated"
    });

  } catch (err) {
    console.error("Correlation API error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
