// client/src/pages/Product.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Product(){
  const { slug } = useParams();
  const [p,setP] = useState(null);
  const [showNutri,setShowNutri] = useState(false);

  useEffect(()=>{ axios.get(`${API}/api/products/${slug}`).then(r=> setP(r.data)); },[slug]);
  if(!p) return null;

  const file = (p.imageUrl||"").split("/").pop();
  const src = /\.(png|jpe?g|webp|gif|avif)$/i.test(file) ? `/images/${file}` : (p.imageUrl || "/images/placeholder.png");

  return (
    <div className="container">
      <div className="row g-4 align-items-start">
        <div className="col-md-6"><img src={src} className="img-fluid rounded" alt={p.name}/></div>
        <div className="col-md-6">
          <h2 className="fw-bold">{p.name}</h2>
          <p className="lead">${p.price.toFixed(2)}</p>
          <p className="text-muted">{p.description || "Freshly baked cookie with premium ingredients."}</p>
          <div className="d-flex gap-2">
            <button className="btn btn-dark">Add to Cart</button>
            <button className="btn btn-outline-dark" onClick={()=>setShowNutri(true)}>Nutrition</button>
          </div>
        </div>
      </div>

      {showNutri && (
        <div className="modal fade show" style={{display:'block'}} tabIndex="-1" onClick={()=>setShowNutri(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Nutrition Facts</h5>
                <button className="btn-close" onClick={()=>setShowNutri(false)} />
              </div>
              <div className="modal-body">
                <p>Calories: {p.calories || '--'}</p>
                <p>Allergens: wheat, dairy (example)</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowNutri(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
