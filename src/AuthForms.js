import React, { useState } from "react";

import './AuthForms.css';

export default function AuthForms() {
  const [show, setShow] = useState(null); // "signin" or "signup"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) setMessage("Registration successful!");
    else setMessage(data.error || "Registration failed.");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (res.ok) setMessage("Login successful!");
    else setMessage(data.error || "Login failed.");
  };

  return (
    <div>
      <button onClick={() => setShow("signin")}>Sign In</button>
      <button onClick={() => setShow("signup")}>Sign Up</button>

      {show === "signup" && (
        <form onSubmit={handleSignUp} style={{border: '1px solid #ccc', padding: 16, margin: 8}}>
          <h2>Sign Up</h2>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
          <button type="button" onClick={() => setShow(null)}>Cancel</button>
          <div>{message}</div>
        </form>
      )}

      {show === "signin" && (
        <form onSubmit={handleSignIn} style={{border: '1px solid #ccc', padding: 16, margin: 8}}>
          <h2>Sign In</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <button type="button" onClick={() => setShow(null)}>Cancel</button>
          <div>{message}</div>
        </form>
      )}
    </div>
  );
}
