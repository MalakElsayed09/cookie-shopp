// client/src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import Menu from "./pages/Menu.jsx";
import Stores from "./pages/Stores.jsx";
import CartOffcanvas from "./components/CartOffcanvas.jsx";
import { CartProvider, useCart } from "./context/CartContext.jsx";

export default function App() {
  // Wrap the whole shell with the CartProvider
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}

// Separate component so hooks are inside the provider
function Shell() {
  const { state, subtotal } = useCart();
  const itemCount = state.items.reduce((n, i) => n + i.qty, 0);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            Cookie<span style={{ color: "var(--brand-pink)" }}>Shop</span>
          </Link>
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link" to="/menu">Menu</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/stores">Stores</Link>
            </li>
            {/* Offcanvas toggle button with live item count */}
            <li className="nav-item">
              <button
                className="btn btn-dark"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#cartDrawer"
              >
                Cart{itemCount ? ` (${itemCount})` : ""}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Cart drawer mounted once with live items & subtotal */}
      <CartOffcanvas items={state.items} subtotal={subtotal} />

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/stores" element={<Stores />} />
        </Routes>
      </main>
    </>
  );
}
