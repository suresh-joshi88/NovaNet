import client from "./client";
export const fetchEvents = (params = {}) => client.get("/events", { params });
export const createEvent = (payload) => client.post("/events", payload);
export const uploadEvents = (file) => {
  const fd = new FormData(); fd.append("file", file);
  return client.post("/events/upload", fd, { headers: { "Content-Type": "multipart/form-data" }});
};
