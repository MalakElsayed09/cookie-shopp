// client/src/pages/Menu.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");

  useEffect(() => {
    axios.get(`${API}/api/products`).then((r) => setItems(r.data));
  }, []);

  const tags = useMemo(
    () => Array.from(new Set(items.flatMap((i) => i.tags || []))),
    [items]
  );

  const filtered = items.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(q.toLowerCase());
    const tagMatch = tag === "all" ? true : (p.tags || []).includes(tag);
    return nameMatch && tagMatch;
  });

  return (
    <div className="container">
      <div className="d-flex gap-2 align-items-center mb-3">
        <input
          className="form-control"
          placeholder="Search flavors..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: 220 }}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="all">All tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="row g-3">
        {filtered.map((p) => (
          <div key={p._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <MenuCard p={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuCard({ p }) {
  const { dispatch } = useCart();

  // resolve image src (local filename or full URL)
  const file = (p.imageUrl || "").split("/").pop();
  const src = /\.(png|jpe?g|webp|gif|avif)$/i.test(file)
    ? `/images/${file}`
    : p.imageUrl || "/images/placeholder.png";

  const addToCart = () => {
    dispatch({
      type: "add",
      item: {
        slug: p.slug,
        name: p.name,
        price: p.price,
        imageUrl: file || p.imageUrl,
      },
    });
    // Open the offcanvas programmatically (works even without data attributes)
    try {
      const el = document.getElementById("cartDrawer");
      if (el && window.bootstrap?.Offcanvas) {
        const oc = window.bootstrap.Offcanvas.getOrCreateInstance(el);
        oc.show();
      }
    } catch {}
  };

  return (
    <div className="card h-100">
      <img
        src={src}
        className="card-img-top"
        alt={p.name}
        onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{p.name}</h5>
        <div className="text-muted small mb-2">{p.calories || "--"} cal</div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold">${p.price.toFixed(2)}</span>
          <button
            className="btn btn-dark btn-sm"
            onClick={addToCart}
            // You can also rely on data attributes instead of JS:
            // data-bs-toggle="offcanvas" data-bs-target="#cartDrawer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
