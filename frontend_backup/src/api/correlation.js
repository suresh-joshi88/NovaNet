import client from "./client";
export const runCorrelation = (persist = false) => client.get(`/events/correlate?persist=${persist}`);
export const listClusters = (params = {}) => client.get("/clusters", { params });
