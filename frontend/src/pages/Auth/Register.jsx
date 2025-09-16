import React, { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Call backend register API
      const res = await register({ name, email, password });

      // ✅ Token now returned from backend
      const token = res.data?.token;
      if (!token) throw new Error("No token in response");

      // Save token and redirect
      localStorage.setItem("nova_token", token);
      nav("/events");
    } catch (err) {
      // Show backend validation or generic error
      setMsg(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.msg ||
          err.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Register</button>
      </form>

      {msg && <div style={{ color: "red", marginTop: 10 }}>{msg}</div>}
    </div>
  );
}
