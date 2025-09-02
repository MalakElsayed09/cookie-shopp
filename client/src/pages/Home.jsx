// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ axios.get(`${API}/api/products`).then(r=> setItems(r.data)); },[]);
  const weekly = items.filter(i => i.isFeatured).slice(0,6);

  return (
    <>
      <header className="py-5 section-cream mb-4">
        <div className="container text-center">
          <span className="badge badge-rotating rounded-pill mb-3 px-3 py-2">Rotating Weekly</span>
          <h1 className="display-4 fw-bold">Freshly Baked Cookies</h1>
          <p className="lead text-muted mb-4">New flavors weekly. Order for pickup or delivery.</p>
          <Link className="btn btn-dark btn-lg" to="/menu">See This Week’s Menu</Link>
        </div>
      </header>

      <section className="container">
        <h2 className="fw-bold mb-3">This Week’s Flavors</h2>
        <div className="row g-3">
          {weekly.map(p => (
            <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={p._id}>
              <FlavorCard p={p}/>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function FlavorCard({p}){
  const file = (p.imageUrl||"").split("/").pop();
  const src = /\.(png|jpe?g|webp|gif|avif)$/i.test(file) ? `/images/${file}` : (p.imageUrl || "/images/placeholder.png");
  return (
    <div className="card h-100">
      <img src={src} className="card-img-top" alt={p.name} onError={(e)=>e.currentTarget.src="/images/placeholder.png"} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{p.name}</h5>
        <p className="text-muted small mb-2">{p.calories || "--"} cal</p>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/product/${p.slug}`} className="btn btn-outline-dark">Details</Link>
          <Link to="/cart" className="btn btn-dark">Add to Cart</Link>
        </div>
      </div>
    </div>
  );
}
