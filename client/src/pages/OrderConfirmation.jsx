import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const nav = useNavigate();
  const { state } = useLocation(); // may be undefined on hard refresh
  // Prefer state, else fallback to localStorage
  const order = useMemo(() => state?.order ?? readLS(), [state]);

  useEffect(() => {
    if (!order) {
      // no order info → go back to menu
      nav("/menu", { replace: true });
    }
  }, [order, nav]);

  if (!order) return null;

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="text-center my-4">
        <div className="display-6 fw-bold">Thank you!</div>
        <p className="text-muted mb-0">Your order has been placed.</p>
        <p className="text-muted">Order #{(order._id || "").slice(-6)}</p>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Order Summary</h5>
          <ul className="list-group list-group-flush">
            {order.items.map((i, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                <span>{i.name} × {i.qty}</span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between mt-3">
            <strong>Subtotal</strong>
            <strong>${order.subtotal?.toFixed(2) ?? calcSubtotal(order.items)}</strong>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-dark" onClick={() => nav("/menu")}>Back to Menu</button>
        <button className="btn btn-outline-dark" onClick={() => window.print()}>Print Receipt</button>
      </div>
    </div>
  );
}

function readLS() {
  try { return JSON.parse(localStorage.getItem("lastOrder") || "null"); } catch { return null; }
}
function calcSubtotal(items = []) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
