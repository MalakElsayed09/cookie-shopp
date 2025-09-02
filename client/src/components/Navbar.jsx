// client/src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
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
          <li className="nav-item">
            {/* ✅ Offcanvas toggle button instead of link */}
            <button
              className="btn btn-dark"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartDrawer"
            >
              Cart
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
