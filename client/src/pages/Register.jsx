import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setInfo("");
    setSubmitting(true);
    try {
      const data = await register(form); // <-- capture return value
      setInfo(data?.message || "Check your email to verify your account.");
      // redirect to the verify page so they can resend if needed
      nav("/verify-email", { state: { email: form.email, name: form.name } });
    } catch (e) {
      setErr(e?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="fw-bold mb-3">Create account</h2>
      {info && <div className="alert alert-success">{info}</div>}
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit} className="vstack gap-3">
        <input
          className="form-control"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          required
        />
        <input
          className="form-control"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          required
        />
        <input
          className="form-control"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          required
        />
        <button className="btn btn-dark" type="submit" disabled={submitting}>
          {submitting ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
