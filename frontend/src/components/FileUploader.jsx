import React from "react";

export default function FileUploader({ onFile }) {
  return (
    <div>
      <input type="file" accept=".csv,.json" onChange={(e) => {
        const f = e.target.files[0];
        if (f && onFile) onFile(f);
      }} />
    </div>
  );
}
