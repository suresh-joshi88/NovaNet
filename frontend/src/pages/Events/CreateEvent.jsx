import React, { useState } from "react";
import { createEvent } from "../../api/events";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [source, setSource] = useState("");
  const [type, setType] = useState("");
  const [time, setTime] = useState("");
  const [ra, setRa] = useState("");
  const [dec, setDec] = useState("");
  const [metadata, setMetadata] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!source || !type || !time || !ra || !dec) { setMsg("Please fill required fields"); return; }
    try {
      const metaObj = metadata ? JSON.parse(metadata) : {};
      await createEvent({ source, type, time: new Date(time).toISOString(), ra: parseFloat(ra), dec: parseFloat(dec), metadata: metaObj });
      nav("/events");
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.message || "Create failed");
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h2>Create Event</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} /></div>
        <div><input placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} /></div>
        <div><input placeholder="Time (use browser picker)" type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} /></div>
        <div><input placeholder="RA" value={ra} onChange={(e) => setRa(e.target.value)} /></div>
        <div><input placeholder="DEC" value={dec} onChange={(e) => setDec(e.target.value)} /></div>
        <div><textarea placeholder='metadata JSON' value={metadata} onChange={(e) => setMetadata(e.target.value)} /></div>
        <div><button type="submit">Create</button></div>
      </form>
      {msg && <div style={{ color: "red" }}>{msg}</div>}
    </div>
  );
}
