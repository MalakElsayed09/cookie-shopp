import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function VerifyEmail() {
  const nav = useNavigate();
  const { search, state } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [email, setEmail] = useState(state?.email || "");

  // If there's a token in the URL, verify immediately
  useEffect(() => {
    const verify = async () => {
      if (!token) return;
      setLoading(true); setErr(""); setMsg("");
      try {
        const { data } = await api.get(`/api/auth/verify?token=${token}`);
        setMsg("Email verified! Redirecting…");
        setTimeout(() => nav("/menu"), 800);
      } catch (e) {
        setErr(e?.response?.data?.message || "Invalid or expired token.");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token, nav]);

  const resend = async () => {
    setErr(""); setMsg(""); setLoading(true);
    try {
      await api.post("/api/auth/resend-verification", { email });
      setMsg("Verification email resent. Check your inbox.");
    } catch (e) {
      setErr(e?.response?.data?.message || "Could not resend email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h2 className="fw-bold my-3">Verify your email</h2>
      {token && <p className="text-muted">Verifying your account…</p>}
      {!token && (
        <>
          <p className="text-muted">Enter your email and we’ll resend the verification link.</p>
          <div className="vstack gap-2">
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button className="btn btn-dark" onClick={resend} disabled={!email || loading}>
              {loading ? "Sending…" : "Resend verification email"}
            </button>
          </div>
        </>
      )}
      {msg && <div className="alert alert-success mt-3">{msg}</div>}
      {err && <div className="alert alert-danger mt-3">{err}</div>}
    </div>
  );
}
