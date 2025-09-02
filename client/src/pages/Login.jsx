import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form);
      nav("/menu");
    } catch (e) {
      setErr(e?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="fw-bold mb-3">Sign in</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit} className="vstack gap-3">
        <input className="form-control" type="email" placeholder="Email"
          value={form.email} onChange={e=>setForm(s=>({ ...s, email:e.target.value }))} required />
        <input className="form-control" type="password" placeholder="Password"
          value={form.password} onChange={e=>setForm(s=>({ ...s, password:e.target.value }))} required />
        <button className="btn btn-dark" type="submit">Log in</button>
      </form>
    </div>
  );
}
