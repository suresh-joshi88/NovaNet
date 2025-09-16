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
