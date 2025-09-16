import React from "react";

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed",
      right: 12,
      bottom: 12,
      background: "#111",
      color: "white",
      padding: "8px 12px",
      borderRadius: 6
    }}>
      {message}
    </div>
  );
}
