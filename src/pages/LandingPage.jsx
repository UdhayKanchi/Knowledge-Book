import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("dark-theme");
    } else {
      body.classList.remove("dark-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Scroll Reveal Observer
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );
    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <div className="landing-layout">
      {/* HEADER */}
      <header className="header">
        <nav className="navbar container">
          <Link to="/" className="logo">
            <i className="fa-solid fa-book-open-reader"></i> Knowledge Book
          </Link>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#cta">Pricing</a></li>
            {user ? (
              <li>
                <Link to="/home" className="cta-button">
                  Dashboard <i className="fa-solid fa-gauge" style={{ marginLeft: 5 }}></i>
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/login" className="cta-button">
                  Sign In
                </Link>
              </li>
            )}
            <li>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                <i className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main>
        <section className="hero reveal">
          <div className="container hero-content">
            <h1 className="hero-title">
              Master Your Skills with <br />
              <span className="highlight">Unstoppable Flow.</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate platform for students and developers to access premium notes, roadmaps, and track their learning journey.
            </p>
            {user ? (
              <Link to="/home" className="button">
                Go to Dashboard <i className="fa-solid fa-arrow-right"></i>
              </Link>
            ) : (
              <a href="#cta" className="button">
                Start Exploring <i className="fa-solid fa-arrow-right"></i>
              </a>
            )}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" class="features">
          <div className="container">
            <h2 className="section-title reveal">Designed for Your Success.</h2>
            <div className="feature-grid">
              {/* Feature 1 */}
              <div 
                className="feature-card reveal" 
                style={{ transitionDelay: "0ms" }}
              >
                <div className="icon"><i className="fa-solid fa-bolt"></i></div>
                <h3>Lightning Fast</h3>
                <p>A clean, intuitive interface that gets out of your way and lets you focus on deep learning.</p>
              </div>
              
              {/* Feature 2 */}
              <div 
                className="feature-card reveal" 
                style={{ transitionDelay: "100ms" }}
              >
                <div className="icon"><i className="fa-solid fa-map-location-dot"></i></div>
                <h3>Curated Roadmaps</h3>
                <p>Step-by-step guidance for Web Development, Data Science, and core Computer Science subjects.</p>
              </div>
              
              {/* Feature 3 */}
              <div 
                className="feature-card reveal" 
                style={{ transitionDelay: "200ms" }}
              >
                <div className="icon"><i className="fa-solid fa-cloud"></i></div>
                <h3>Always Syncing</h3>
                <p>Access your notes and track your progress from anywhere, on any device, completely free.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="cta" className="cta">
          <div className="container cta-content reveal">
            <h2 className="cta-title">Ready to find your Flow?</h2>
            <p className="cta-subtitle">Join thousands of students and start your journey towards mastery today.</p>
            <div>
              {user ? (
                <Link to="/home" className="button cta-button-main">
                  Open Dashboard <i className="fa-solid fa-rocket"></i>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="button cta-button-main">
                    Create Free Account <i className="fa-solid fa-rocket"></i>
                  </Link>
                  <a href="mailto:support@knowledgebook.in" className="button" style={{ background: "rgba(255,255,255,0.2)", boxShadow: "none" }}>
                    Contact Us <i className="fa-solid fa-envelope"></i>
                  </a>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <Link to="/" className="logo">
            <i className="fa-solid fa-book-open-reader"></i> Knowledge Book
          </Link>
          <p style={{ marginTop: 5 }}>&copy; 2026 Knowledge Book. All rights reserved.</p>
          <div className="social-links">
            <a href="mailto:support@knowledgebook.in"><i className="fa-solid fa-envelope"></i></a>
            <a href="https://github.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
