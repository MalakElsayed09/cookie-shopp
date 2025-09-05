import { Routes, Route, Link } from "react-router-dom";
import Menu from "./pages/Menu.jsx";
import Stores from "./pages/Stores.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CartOffcanvas from "./components/CartOffcanvas.jsx";
import { CartProvider, useCart } from "./context/CartContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Checkout from "./pages/Checkout.jsx";
import Admin from "./pages/Admin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import Home from "./pages/Home.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </AuthProvider>
  );
}

function Shell() {
  const { state, subtotal } = useCart();
  const { user, logout, loading } = useAuth();
  const itemCount = state.items.reduce((n, i) => n + i.qty, 0);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            Cookie<span style={{ color: "var(--brand-pink)" }}>Shop</span>
          </Link>
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item"><Link className="nav-link" to="/menu">Menu</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/stores">Stores</Link></li>

            {/* Auth links */}
            {!loading && !user && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="btn btn-outline-dark btn-sm" to="/register">Sign up</Link></li>
              </>
            )}
            {!loading && user && (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hi, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-dark btn-sm" onClick={logout}>Logout</button>
                </li>
              </>
            )}

            {/* Cart */}
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

      <CartOffcanvas items={state.items} subtotal={subtotal} />

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
           <Route path="/verify-email" element={<VerifyEmail />} />
          {/* Logged-in users only */}
  <Route
    path="/checkout"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
  />

  {/* Admin only */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <Admin />
      </ProtectedRoute>
    }
  />
        </Routes>
      </main>
    </>
  );
}
