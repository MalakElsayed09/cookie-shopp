import { useEffect, useState } from "react";
import { api } from "../api";

export default function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // requires admin; your backend route is GET /api/orders with requireAdmin
    api.get("/api/orders")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="container">
      <h2 className="fw-bold mb-3">Admin Dashboard</h2>
      <p className="text-muted">Recent orders</p>
      {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
      {orders.map(o => (
        <div key={o._id} className="border rounded p-2 mb-2">
          <div className="d-flex justify-content-between">
            <strong>#{o._id.slice(-6)}</strong>
            <span className="badge text-bg-secondary">{o.status}</span>
          </div>
          <div className="small text-muted">{new Date(o.createdAt).toLocaleString()}</div>
          <ul className="mt-2 mb-0">
            {o.items.map((i, idx) => (
              <li key={idx} className="small">
                {i.name} × {i.qty} — ${(i.price * i.qty).toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="mt-2 fw-bold">Subtotal: ${o.subtotal?.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
