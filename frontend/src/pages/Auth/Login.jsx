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
