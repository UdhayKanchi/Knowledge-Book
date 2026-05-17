import React, { useState } from "react";

// Receives Firebase data + loading state from HomePage (real-time via onSnapshot)
export default function InterviewSection({ interviewData = [], loading = false }) {
  const [filter, setFilter] = useState("All");

  const cats = ["All", ...new Set(interviewData.map((p) => p.category || "General"))];
  const filtered =
    filter === "All"
      ? interviewData
      : interviewData.filter((p) => (p.category || "General") === filter);

  return (
    <div>
      <p className="section-desc">
        Interview preparation materials shared globally via Firebase. Download and study!
      </p>

      <div className="filter-row">
        {cats.map((c) => (
          <button
            key={c}
            className={`flt-btn iq-flt${filter === c ? " active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-msg">
          <i className="fa-solid fa-spinner fa-spin" /> Loading interview materials from Firebase…
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-file-pdf" />
          <p>No interview blueprints published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="iq-pdf-grid">
          {filtered.map((p) => (
            <div key={p.id} className="iq-pdf-card">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="iq-pdf-ic">
                  <i className="fa-solid fa-file-pdf" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="iq-cat-label">{p.category || "General"}</div>
                  <div className="iq-pdf-title">{p.title}</div>
                </div>
              </div>
              {p.desc && <p className="pdf-desc">{p.desc}</p>}
              <div style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "8px 0" }}>
                📅 {p.uploadDate || "Recent"}
              </div>
              <a
                href={p.downloadURL || "#"}
                target="_blank"
                rel="noreferrer"
                className="iq-dl-btn"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" /> Open Reference Packet
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}