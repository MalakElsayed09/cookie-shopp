// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HeroVideo from "../components/HeroVideo.jsx";
import Menu from "./Menu.jsx";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ axios.get(`${API}/api/products`).then(r=> setItems(r.data)); },[]);
  const weekly = items.filter(i => i.isFeatured).slice(0,6);

  return (
    <>
      {/* Hero video banner */}
      <HeroVideo />

      {/* Weekly flavors */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-3">
          <h2 className="fw-bold m-0">This Week’s Flavors</h2>
          <Link className="btn btn-outline-dark" to="/menu">See Full Menu</Link>
        </div>

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
