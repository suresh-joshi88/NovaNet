import React from "react";
import { displayTime } from "../utils/format";

export default function EventCard({ event, onShow }) {
  const id = event.id || event._id || event.event_id || "n/a";
  return (
    <div style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
      <div><strong>{event.source}</strong> — {event.type}</div>
      <div>Time: {displayTime(event.time)}</div>
      <div>RA: {event.ra} DEC: {event.dec}</div>
      <div><button onClick={() => onShow && onShow(event)}>Details</button></div>
    </div>
  );
}
