import React, { useState } from "react";
import { uploadEvents } from "../../api/events";
import FileUploader from "../../components/FileUploader";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { setErrMsg("Please pick a file"); return; }
    try {
      const res = await uploadEvents(file);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setErrMsg(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h2>Bulk Upload Events</h2>
      <FileUploader onFile={(f) => setFile(f)} />
      <div style={{ marginTop: 8 }}>
        <button onClick={submit}>Upload</button>
      </div>
      {errMsg && <div style={{ color: "red" }}>{errMsg}</div>}
      {result && (
        <div style={{ marginTop: 12 }}>
          <div>Success: {result.successCount ?? "N/A"}</div>
          <pre style={{ maxHeight: 300, overflow: "auto" }}>{JSON.stringify(result.errors || result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
