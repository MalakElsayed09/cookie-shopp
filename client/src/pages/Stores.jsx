// client/src/pages/Stores.jsx
export default function Stores(){
  const stores = [
    { city:"Orlando, FL", address:"123 Cookie Ave", link:"https://maps.google.com?q=123 Cookie Ave Orlando FL" },
    { city:"Tampa, FL", address:"456 Dough St", link:"https://maps.google.com?q=456 Dough St Tampa FL" }
  ];
  return (
    <div className="container">
      <h2 className="fw-bold mb-3">Find a Store</h2>
      <div className="row g-3">
        {stores.map((s,i)=>(
          <div className="col-12 col-md-6 col-lg-4" key={i}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{s.city}</h5>
                <p className="text-muted">{s.address}</p>
                <a href={s.link} target="_blank" className="btn btn-outline-dark">Open in Maps</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
