#!/usr/bin/env bash
set -e

echo "Creating frontend folder and starter files..."

# scaffold Vite React app if frontend doesn't exist
if [ ! -d "frontend" ]; then
  echo "Scaffolding Vite React app..."
  npm create vite@latest frontend -- --template react
fi

# create src folder if not present
mkdir -p frontend/src

# write api/client.js
cat > frontend/src/api/client.js <<'JS'
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem("nova_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

client.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) {
    localStorage.removeItem("nova_token");
    window.location.href = "/login";
  }
  return Promise.reject(err);
});

export default client;
JS

# write other small files (auth/events/correlation)
mkdir -p frontend/src/api
cat > frontend/src/api/auth.js <<'JS'
import client from "./client";
export const register = (payload) => client.post("/auth/register", payload);
export const login = (payload) => client.post("/auth/login", payload);
JS

cat > frontend/src/api/events.js <<'JS'
import client from "./client";
export const fetchEvents = (params = {}) => client.get("/events", { params });
export const createEvent = (payload) => client.post("/events", payload);
export const uploadEvents = (file) => {
  const fd = new FormData(); fd.append("file", file);
  return client.post("/events/upload", fd, { headers: { "Content-Type": "multipart/form-data" }});
};
JS

cat > frontend/src/api/correlation.js <<'JS'
import client from "./client";
export const runCorrelation = (persist = false) => client.get(`/events/correlate?persist=${persist}`);
export const listClusters = (params = {}) => client.get("/clusters", { params });
JS

# minimal components and pages skeletons
mkdir -p frontend/src/components frontend/src/pages/Auth frontend/src/pages/Events frontend/src/pages/Correlator frontend/src/styles frontend/src/utils/mockScenarios

cat > frontend/src/components/Header.jsx <<'JS'
import React from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Header(){
  const nav = useNavigate();
  const token = localStorage.getItem("nova_token");
  const logout = () => { localStorage.removeItem("nova_token"); nav("/login"); };
  return (
    <header style={{padding:12, borderBottom:"1px solid #ddd", display:"flex", justifyContent:"space-between"}}>
      <div><Link to="/" style={{fontWeight:"bold", marginRight:12}}>NovaNet</Link>{token && <><Link to="/events" style={{marginRight:8}}>Events</Link><Link to="/correlate" style={{marginRight:8}}>Correlator</Link><Link to="/clusters">Clusters</Link></>}</div>
      <div>{!token ? <Link to="/login">Login</Link> : <button onClick={logout}>Logout</button>}</div>
    </header>
  );
}
JS

cat > frontend/src/components/PrivateRoute.jsx <<'JS'
import React from "react";
import { Navigate } from "react-router-dom";
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("nova_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
JS

cat > frontend/src/pages/Auth/Login.jsx <<'JS'
import React, {useState} from "react";
import { login } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
export default function Login(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState("");
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      const token = res.data?.token || res.data?.accessToken;
      if (!token) throw new Error("No token");
      localStorage.setItem("nova_token", token);
      nav("/events");
    } catch(err) { setMsg(err?.response?.data?.message || err.message || "Login failed"); }
  };
  return (<div style={{padding:20}}><h2>Login</h2><form onSubmit={submit}><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/><button type="submit">Login</button></form>{msg && <div style={{color:"red"}}>{msg}</div>}<div>Or <Link to="/register">Register</Link></div></div>);
}
JS

cat > frontend/src/pages/Auth/Register.jsx <<'JS'
import React, {useState} from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";
export default function Register(){
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState("");
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await register({ name, email, password });
      const token = res.data?.token || res.data?.accessToken;
      if (!token) throw new Error("No token");
      localStorage.setItem("nova_token", token);
      nav("/events");
    } catch(err){ setMsg(err?.response?.data?.message || err.message || "Register failed"); }
  };
  return (<div style={{padding:20}}><h2>Register</h2><form onSubmit={submit}><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><br/><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/><button type="submit">Register</button></form>{msg && <div style={{color:"red"}}>{msg}</div>}</div>);
}
JS

# simple skeleton pages (you can replace later with full versions)
cat > frontend/src/pages/Events/EventList.jsx <<'JS'
import React from "react";
export default function EventList(){ return <div style={{padding:12}}><h2>Events (work in progress)</h2></div>; }
JS
cat > frontend/src/pages/Events/CreateEvent.jsx <<'JS'
import React from "react";
export default function CreateEvent(){ return <div style={{padding:12}}><h2>Create Event (work in progress)</h2></div>; }
JS
cat > frontend/src/pages/Events/BulkUpload.jsx <<'JS'
import React from "react";
export default function BulkUpload(){ return <div style={{padding:12}}><h2>Bulk Upload (work in progress)</h2></div>; }
JS
cat > frontend/src/pages/Correlator/CorrelatePage.jsx <<'JS'
import React from "react";
export default function CorrelatePage(){ return <div style={{padding:12}}><h2>Correlator (work in progress)</h2></div>; }
JS
cat > frontend/src/pages/Correlator/ClusterList.jsx <<'JS'
import React from "react";
export default function ClusterList(){ return <div style={{padding:12}}><h2>Clusters (work in progress)</h2></div>; }
JS

# styles and app entry
cat > frontend/src/styles/index.css <<'CSS'
:root { --bg:#fafafa; --muted:#666; }
body { font-family: Arial, Helvetica, sans-serif; margin:0; background:var(--bg); color:#222; }
input, textarea, button { padding:8px; margin:6px 0; font-size:14px; }
button { cursor:pointer; }
CSS

cat > frontend/src/App.jsx <<'JS'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import EventList from "./pages/Events/EventList";
import CreateEvent from "./pages/Events/CreateEvent";
import BulkUpload from "./pages/Events/BulkUpload";
import CorrelatePage from "./pages/Correlator/CorrelatePage";
import ClusterList from "./pages/Correlator/ClusterList";
import PrivateRoute from "./components/PrivateRoute";
export default function App(){
  return (<BrowserRouter><Header /><Routes>
    <Route path="/" element={<div style={{padding:12}}><h2>Welcome to NovaNet</h2></div>} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/events" element={<PrivateRoute><EventList/></PrivateRoute>} />
    <Route path="/events/create" element={<PrivateRoute><CreateEvent/></PrivateRoute>} />
    <Route path="/events/upload" element={<PrivateRoute><BulkUpload/></PrivateRoute>} />
    <Route path="/correlate" element={<PrivateRoute><CorrelatePage/></PrivateRoute>} />
    <Route path="/clusters" element={<PrivateRoute><ClusterList/></PrivateRoute>} />
    <Route path="*" element={<div style={{padding:12}}>Page not found</div>} />
  </Routes></BrowserRouter>);
}
JS

cat > frontend/src/main.jsx <<'JS'
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
createRoot(document.getElementById("root")).render(<App />);
JS

# package.json minimal
if [ ! -f frontend/package.json ]; then
cat > frontend/package.json <<'JSON'
{
  "name": "novanet-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.12.1"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
JSON
fi

echo "Done. Created frontend scaffold in ./frontend. Next steps:"
echo "  cd frontend"
echo "  npm install"
echo "  create frontend/.env with REACT_APP_API_BASE_URL=http://localhost:5000/api (do NOT commit)"
echo "  npm run dev"
