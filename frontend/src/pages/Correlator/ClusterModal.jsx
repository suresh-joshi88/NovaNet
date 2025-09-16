import React from "react";
import { displayTime } from "../../utils/format";

export default function ClusterModal({ cluster, onClose }) {
  if (!cluster) return null;
  return (
    <div style={{
      position: "fixed", left: "10%", right: "10%", top: "10%", bottom: "10%",
      background: "#fff", border: "1px solid #ddd", padding: 12, overflow: "auto",
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
    }}>
      <button onClick={onClose} style={{ float: "right" }}>Close</button>
      <h3>Cluster {cluster.id || cluster._id}</h3>
      <div><strong>Score:</strong> {cluster.score}</div>
      <div><strong>Centroid:</strong> {cluster.centroid?.ra}, {cluster.centroid?.dec}</div>
      <div><strong>Time range:</strong> {displayTime(cluster.startTime)} — {displayTime(cluster.endTime)}</div>
      <h4>Explanation</h4>
      <pre>{cluster.explanation || JSON.stringify(cluster.explain || cluster, null, 2)}</pre>
      <h4>Member events</h4>
      <pre>{JSON.stringify(cluster.events || [], null, 2)}</pre>
    </div>
  );
}
