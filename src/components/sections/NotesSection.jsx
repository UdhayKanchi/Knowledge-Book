import React, { useState, useEffect } from "react";

// Receive props directly from HomePage to bypass cloud database connection blocks ra ✅
export default function NotesSection({ notesData = [] }) {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Sync internal notes array buffer metrics when props change automatically
  useEffect(() => {
    if (notesData) {
      setNotes(notesData);
      setLoading(false);
    }
  }, [notesData]);

  const subjects = ["All", ...new Set(notes.map((n) => n.subject || "General"))];
  const filtered = filter === "All" ? notes : notes.filter((n) => (n.subject || "General") === filter);
  const typeEmoji = { notes: "📄", assignment: "📋", pyq: "📜", book: "📚" };
  const typeColor = { notes: "coral", assignment: "violet", pyq: "lime", book: "violet" };

  return (
    <div>
      <p className="section-desc">Study materials shared via Google Drive storage points. Filter by subject area code maps.</p>
      
      {/* Subject Filtering Actions Row Panel Header Layout Node Elements Controllers */}
      <div className="filter-row">
        {subjects.map((s) => (
          <button 
            key={s} 
            className={`flt-btn${filter === s ? " active" : ""}`} 
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-msg">Loading current parameters data layers logs...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-cloud-arrow-up" />
          <p>No valid references mapped under this active criteria node loop. Check back soon!</p>
        </div>
      ) : (
        <div className="pdf-grid">
          {filtered.map((n) => (
            <div key={n.id} className="pdf-card">
              <div className="pdf-head">
                <div className={`pdf-ic ic-${typeColor[n.type] || "coral"}`}>
                  {typeEmoji[n.type] || "📄"}
                </div>
                <div className="pdf-info">
                  <div className="pdf-subject">{n.subject || "General"}</div>
                  <div className="pdf-title">{n.title}</div>
                </div>
              </div>
              
              {n.desc && <p className="pdf-desc">{n.desc}</p>}
              
              <div className="pdf-meta">
                <span>📅 {n.uploadDate || "Recent Timestamp Node"}</span>
                <span style={{ textTransform: "uppercase" }}>{n.type || "Notes"}</span>
              </div>
              
              {/* Maps straight vector reference URL variables strings parameters mapping target structure output */}
              <a 
                href={n.downloadURL || "#"} 
                target="_blank" 
                rel="noreferrer" 
                className="pdf-dl-btn"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" /> Open Reference Document Target
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}