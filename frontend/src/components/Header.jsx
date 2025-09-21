import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header(){
  const nav = useNavigate();
  const token = localStorage.getItem("nova_token");
  const logout = () => { localStorage.removeItem("nova_token"); nav("/login"); };
  return (
    <header>
      <div className="header-brand">
        <span className="dot" />
        <span>SkyFuse</span>
      </div>
      <nav>
        <Link to="/">Home</Link>
        {token && (<><Link to="/events">Events</Link><Link to="/correlate">Correlator</Link><Link to="/clusters">Clusters</Link></>)}
        {!token ? <Link to="/login" style={{marginLeft:12}}>Login</Link> : <button onClick={logout} className="secondary" style={{marginLeft:12}}>Logout</button>}
      </nav>
    </header>
  );
}
