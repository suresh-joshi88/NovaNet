import React, { useState } from "react";
import { runCorrelation } from "../../api/correlation";
import { createEvent } from "../../api/events";
import EventCard from "../../components/EventCard";
import ClusterModal from "./ClusterModal";

import sample1 from "../../utils/mockScenarios/sample1.json";
import sample2 from "../../utils/mockScenarios/sample2.json";

export default function CorrelatePage() {
  const [clusters, setClusters] = useState([]);
  const [toast, setToast] = useState("");
  const [selectedCluster, setSelectedCluster] = useState(null);

  const inject = async (scenario) => {
    try {
      for (let e of scenario) {
        await createEvent(e);
      }
      setToast("Injected sample events");
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      console.error(err);
      setToast("Injection failed");
      setTimeout(() => setToast(""), 3000);
    }
  };

  const run = async (persist = false) => {
    try {
      const res = await runCorrelation(persist);
      const data = res.data;
      const cls = data?.clusters || data;
      setClusters(cls || []);
    } catch (err) {
      console.error(err);
      setToast(err?.response?.data?.message || "Correlation failed");
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h2>Correlator</h2>

      <div style={{ marginBottom: 8 }}>
        <button onClick={() => inject(sample1)}>Inject sample (GW-like)</button>
        <button onClick={() => inject(sample2)} style={{ marginLeft: 8 }}>Inject sample (Neutrino+Gamma)</button>
        <button onClick={() => run(false)} style={{ marginLeft: 8 }}>Run correlation (ephemeral)</button>
        <button onClick={() => run(true)} style={{ marginLeft: 8 }}>Run correlation (persist)</button>
      </div>

      <div style={{ marginTop: 12 }}>
        {clusters.length === 0 ? <div>No clusters yet</div> : clusters.map(c => (
          <div key={c.id || c._id} style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
            <div><strong>Score:</strong> {c.score}</div>
            <div><strong>Centroid:</strong> {c.centroid?.ra}, {c.centroid?.dec}</div>
            <div><strong>Time range:</strong> {c.startTime} — {c.endTime}</div>
            <div><strong>Members:</strong> {(c.events || []).length}</div>
            <button onClick={() => setSelectedCluster(c)}>Details</button>

            <div style={{ marginTop: 8 }}>
              {(c.events || []).slice(0,3).map(ev => <EventCard key={(ev.id||ev._id)} event={ev} onShow={()=>{}} />)}
            </div>
          </div>
        ))}
      </div>

      {selectedCluster && <ClusterModal cluster={selectedCluster} onClose={() => setSelectedCluster(null)} />}

      {toast && <div style={{ position: "fixed", right: 12, bottom: 12, background: "#111", color: "white", padding: 8 }}>{toast}</div>}
    </div>
  );
}
