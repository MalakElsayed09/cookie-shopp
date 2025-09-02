// client/src/pages/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api";

export default function Checkout() {
  const { state: { items }, dispatch, subtotal } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="alert alert-warning mt-3">
          Please <a href="/login">log in</a> to complete checkout.
        </div>
      </div>
    );
  }

  const placeOrder = async () => {
    setErr("");
    if (!items.length) return setErr("Your cart is empty.");
    setLoading(true);
    try {
      const { data: order } = await api.post("/api/orders", { items });
      // Persist minimal receipt locally for refresh safety
      localStorage.setItem("lastOrder", JSON.stringify({
        _id: order._id,
        items: order.items,
        subtotal: order.subtotal,
        createdAt: order.createdAt
      }));
      // Clear cart and go to confirmation with state
      dispatch({ type: "clear" });
      nav("/order-confirmation", { state: { order } });
    } catch (e) {
      setErr(e?.response?.data?.message || "Could not place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <h2 className="fw-bold my-3">Checkout</h2>
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="vstack gap-2">
        {items.map(i => (
          <div key={i.slug} className="d-flex justify-content-between border-bottom py-2">
            <div>{i.name} × {i.qty}</div>
            <div>${(i.price * i.qty).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-3">
        <strong>Subtotal</strong>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>

      <button className="btn btn-dark w-100 mt-3" onClick={placeOrder} disabled={loading || !items.length}>
        {loading ? "Placing..." : "Place Order"}
      </button>
    </div>
  );
}
