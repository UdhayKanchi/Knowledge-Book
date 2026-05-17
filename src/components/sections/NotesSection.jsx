import React, { useState } from "react";

// Receives Firebase data + loading state from HomePage (real-time via onSnapshot)
export default function NotesSection({ notesData = [], loading = false }) {
  const [filter, setFilter] = useState("All");

  const subjects = ["All", ...new Set(notesData.map((n) => n.subject || "General"))];
  const filtered =
    filter === "All"
      ? notesData
      : notesData.filter((n) => (n.subject || "General") === filter);

  const typeEmoji = { notes: "📄", assignment: "📋", pyq: "📜", book: "📚" };
  const typeColor = { notes: "coral", assignment: "violet", pyq: "lime", book: "violet" };

  return (
    <div>
      <p className="section-desc">
        Study materials shared globally via Firebase. Filter by subject below.
      </p>

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
        <div className="loading-msg">
          <i className="fa-solid fa-spinner fa-spin" /> Loading notes from Firebase…
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-cloud-arrow-up" />
          <p>No notes found for this subject. Admin will upload them soon!</p>
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
                <span>📅 {n.uploadDate || "Recent"}</span>
                <span style={{ textTransform: "uppercase" }}>{n.type || "Notes"}</span>
              </div>
              <a
                href={n.downloadURL || "#"}
                target="_blank"
                rel="noreferrer"
                className="pdf-dl-btn"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" /> Open Document
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}