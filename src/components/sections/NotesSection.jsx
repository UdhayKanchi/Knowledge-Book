import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function NotesSection() {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "notes")).then((snap) => {
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const subjects = ["All", ...new Set(notes.map((n) => n.subject || "General"))];
  const filtered = filter === "All" ? notes : notes.filter((n) => (n.subject || "General") === filter);
  const typeEmoji = { notes: "📄", assignment: "📋", pyq: "📜", book: "📚" };
  const typeColor = { notes: "coral", assignment: "violet", pyq: "lime", book: "violet" };

  return (
    <div>
      <p className="section-desc">Study materials uploaded by admin. Filter by subject.</p>
      <div className="filter-row">
        {subjects.map((s) => (
          <button key={s} className={`flt-btn${filter === s ? " active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      {loading ? <div className="loading-msg">Loading notes...</div> :
        filtered.length === 0 ? (
          <div className="empty-state"><i className="fa-solid fa-cloud-arrow-up" /><p>No notes uploaded yet. Check back soon!</p></div>
        ) : (
          <div className="pdf-grid">
            {filtered.map((n) => (
              <div key={n.id} className="pdf-card">
                <div className="pdf-head">
                  <div className={`pdf-ic ic-${typeColor[n.type] || "coral"}`}>{typeEmoji[n.type] || "📄"}</div>
                  <div className="pdf-info">
                    <div className="pdf-subject">{n.subject || "General"}</div>
                    <div className="pdf-title">{n.title}</div>
                  </div>
                </div>
                {n.desc && <p className="pdf-desc">{n.desc}</p>}
                <div className="pdf-meta"><span>📅 {n.uploadDate}</span><span style={{ textTransform: "capitalize" }}>{n.type || "notes"}</span></div>
                <a href={n.downloadURL || "#"} target="_blank" rel="noreferrer" className="pdf-dl-btn"><i className="fa-solid fa-download" /> Download / View</a>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
