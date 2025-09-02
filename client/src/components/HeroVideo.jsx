import { Link } from "react-router-dom";

export default function HeroVideo() {
  return (
    <section className="position-relative">
      {/* Video */}
      <video
        className="w-100 hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        {/* Fallback text */}
        Your browser does not support the video tag.
      </video>

      {/* Dark gradient overlay for text readability */}
      <div className="position-absolute top-0 start-0 w-100 h-100" 
           style={{background: "linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.25))"}} />

      {/* Centered content */}
      <div className="position-absolute top-50 start-50 translate-middle w-100">
        <div className="container text-center text-white px-3">
          <h1 className="display-5 fw-bold mb-2">Freshly Baked. Weekly Rotating.</h1>
          <p className="lead mb-4">Small-batch cookies chilled, filled & served warm.</p>
          <div className="d-flex gap-2 justify-content-center">
            <Link to="/menu" className="btn btn-light btn-lg">View Menu</Link>
            <button
              className="btn btn-dark btn-lg"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartDrawer"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
