import React, { useEffect, useState } from "react";
import { listClusters } from "../../api/correlation";
import ClusterModal from "./ClusterModal";

export default function ClusterList() {
  const [clusters, setClusters] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await listClusters();
        const data = res.data;
        setClusters(data?.clusters || data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <h2>Persisted Clusters</h2>
      {clusters.length === 0 ? <div>No persisted clusters</div> : clusters.map(c => (
        <div key={c.id || c._id} style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
          <div>Score: {c.score}</div>
          <div>Centroid: {c.centroid?.ra}, {c.centroid?.dec}</div>
          <div>Members: {(c.events || []).length}</div>
          <button onClick={() => setSelected(c)}>Open</button>
        </div>
      ))}
      {selected && <ClusterModal cluster={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
