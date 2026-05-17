import React, { useState, useEffect } from "react";

// HomePage nundi props short-circuit link access payload directly receive chesthunnam ra ✅
export default function InterviewSection({ interviewData = [] }) {
  const [pdfs, setPdfs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Sync state mutations instantly whenever components track load execution vectors
  useEffect(() => {
    if (interviewData) {
      setPdfs(interviewData);
      setLoading(false);
    }
  }, [interviewData]);

  const cats = ["All", ...new Set(pdfs.map((p) => p.category || "General"))];
  const filtered = filter === "All" ? pdfs : pdfs.filter((p) => (p.category || "General") === filter);

  return (
    <div>
      <p className="section-desc">Interview preparation Packets mapped under Google Drive storage variables framework. Download and study!</p>

      {/* Category Actions Selector Row Matrix */}
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
        <div className="loading-msg">Loading placement guide structures assets loop...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-file-pdf" />
          <p>No corporate interview blueprint nodes published on target registers. Check back soon!</p>
        </div>
      ) : (
        <div className="iq-pdf-grid">
          {filtered.map((p) => (
            <div key={p.id} className="iq-pdf-card">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="iq-pdf-ic"><i className="fa-solid fa-file-pdf" /></div>
                <div style={{ flex: 1 }}>
                  <div className="iq-cat-label">{p.category || "General"}</div>
                  <div className="iq-pdf-title">{p.title}</div>
                </div>
              </div>

              {p.desc && <p className="pdf-desc">{p.desc}</p>}

              <div style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "8px 0" }}>
                📅 {p.uploadDate || "Recent Timestamp Token"}
              </div>

              {/* Public drive folder reference paths anchors strings vectors update */}
              <a
                href={p.downloadURL || "#"}
                target="_blank"
                rel="noreferrer"
                className="iq-dl-btn"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" /> Open Reference Packet Node
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}