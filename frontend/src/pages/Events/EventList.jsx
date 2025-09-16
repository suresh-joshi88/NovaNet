import React, { useEffect, useState } from "react";
import { fetchEvents } from "../../api/events";
import Pagination from "../../components/Pagination";
import EventCard from "../../components/EventCard";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ type: "", ra_min: "", ra_max: "", start: "", end: "" });
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    try {
      const params = { page, limit, ...filters };
      const res = await fetchEvents(params);
      const data = res.data || {};
      const items = data.data || data.events || data || [];
      setEvents(Array.isArray(items) ? items : []);
      setTotal(data.total || (Array.isArray(items) ? items.length : 0));
    } catch (err) {
      console.error(err);
      setToast(err?.response?.data?.message || "Failed to load events");
      setTimeout(() => setToast(""), 3000);
    }
  };

  useEffect(() => { load(); }, [page, filters]);

  return (
    <div style={{ padding: 12 }}>
      <h2>Events</h2>

      <div style={{ marginBottom: 12 }}>
        <input placeholder="Type" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} style={{ marginRight: 8 }} />
        <input placeholder="RA min" value={filters.ra_min} onChange={(e) => setFilters({ ...filters, ra_min: e.target.value })} style={{ width: 80 }} />
        <input placeholder="RA max" value={filters.ra_max} onChange={(e) => setFilters({ ...filters, ra_max: e.target.value })} style={{ width: 80, marginLeft: 6 }} />
        <button onClick={() => { setPage(1); load(); }} style={{ marginLeft: 8 }}>Apply</button>
      </div>

      {events.length === 0 ? <div>No events</div> : events.map(e => (
        <EventCard key={e._id || e.id || e.event_id} event={e} onShow={(ev)=>setSelected(ev)} />
      ))}

      <Pagination page={page} limit={limit} total={total} onPageChange={(p) => setPage(p)} />

      {selected && (
        <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 8 }}>
          <h4>Event details</h4>
          <pre style={{ maxHeight: 240, overflow: "auto" }}>{JSON.stringify(selected, null, 2)}</pre>
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}

      {toast && <div style={{ position: "fixed", right: 12, bottom: 12, background: "#111", color: "#fff", padding: 8 }}>{toast}</div>}
    </div>
  );
}
