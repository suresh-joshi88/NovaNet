import React from "react";

export default function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));
  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>Prev</button>
      <span style={{ margin: "0 8px" }}>{page} / {totalPages}</span>
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</button>
    </div>
  );
}
