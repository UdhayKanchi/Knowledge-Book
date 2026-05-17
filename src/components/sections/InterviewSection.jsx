import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function InterviewSection() {
  const [pdfs, setPdfs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "interviewPdfs")).then((snap) => {
      setPdfs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cats = ["All", ...new Set(pdfs.map((p) => p.category || "General"))];
  const filtered = filter === "All" ? pdfs : pdfs.filter((p) => (p.category || "General") === filter);

  return (
    <div>
      <p className="section-desc">Interview preparation PDFs uploaded by admin. Download and study!</p>
      <div className="filter-row">
        {cats.map((c) => (
          <button key={c} className={`flt-btn iq-flt${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      {loading ? <div className="loading-msg">Loading interview PDFs...</div> :
        filtered.length === 0 ? (
          <div className="empty-state"><i className="fa-solid fa-file-pdf" /><p>No interview PDFs uploaded yet. Check back soon!</p></div>
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
                <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>📅 {p.uploadDate}</div>
                <a href={p.downloadURL || "#"} target="_blank" rel="noreferrer" className="iq-dl-btn"><i className="fa-solid fa-download" /> Download / View PDF</a>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
