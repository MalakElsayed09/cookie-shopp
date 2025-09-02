import { useCart } from "../context/CartContext.jsx";

export default function CartOffcanvas({ items = [], subtotal = 0 }) {
  const { dispatch } = useCart();

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartDrawer">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Your Cart</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body">
        {items.length === 0 && <p className="text-muted">Your cart is empty.</p>}

        {items.map((i) => (
          <div key={i.slug} className="d-flex justify-content-between align-items-center border-bottom py-2">
            <div>
              <div className="fw-medium">{i.name}</div>
              <div className="small text-muted">${i.price.toFixed(2)} each</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => dispatch({ type: "dec", slug: i.slug })}>−</button>
              <span>{i.qty}</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => dispatch({ type: "inc", slug: i.slug })}>+</button>
              <div className="fw-bold" style={{ width: 72, textAlign: "right" }}>
                ${(i.price * i.qty).toFixed(2)}
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch({ type: "remove", slug: i.slug })}>Remove</button>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between mt-3">
          <strong>Subtotal</strong>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>

        <button className="btn btn-dark w-100 mt-3">Checkout</button>
      </div>
    </div>
  );
}
