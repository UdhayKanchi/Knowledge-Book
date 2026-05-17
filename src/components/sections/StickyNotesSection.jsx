import React, { useState, useEffect } from "react";

const COLORS = ["#2a3a1a", "#1a2a3a", "#2a1a3a", "#3a1a1a", "#3a2a1a"];
const BORDER = ["rgba(200,241,53,0.2)", "rgba(0,229,204,0.2)", "rgba(124,106,255,0.2)", "rgba(255,107,107,0.2)", "rgba(255,181,71,0.2)"];

function load() { try { return JSON.parse(localStorage.getItem("kb_sticky") || "[]"); } catch { return []; } }
function save(arr) { localStorage.setItem("kb_sticky", JSON.stringify(arr)); }

export default function StickyNotesSection() {
  const [notes, setNotes] = useState(load);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(0);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const addNote = () => {
    if (!title.trim() && !content.trim()) { showToast("Please write something!"); return; }
    const updated = [{ id: Date.now(), title: title || "Untitled", content, color, date: new Date().toLocaleDateString() }, ...notes];
    setNotes(updated); save(updated); setTitle(""); setContent(""); showToast("Note saved! 📝");
  };

  const del = (id) => { const upd = notes.filter((n) => n.id !== id); setNotes(upd); save(upd); };

  return (
    <div>
      {toast && <div className="simple-toast">{toast}</div>}
      <div className="add-note-form">
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <input className="form-inp" placeholder="Note title…" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {COLORS.map((c, i) => (
              <div key={i} onClick={() => setColor(i)} style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: `3px solid ${i === color ? "#fff" : "transparent"}`, cursor: "pointer" }} />
            ))}
          </div>
        </div>
        <textarea className="form-inp" placeholder="Write your note here…" value={content} onChange={(e) => setContent(e.target.value)} rows={3} style={{ width: "100%", resize: "vertical", marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn-lime" onClick={addNote}><i className="fa-solid fa-plus" /> Add Note</button>
          <button className="btn-ghost" onClick={() => { setTitle(""); setContent(""); }}>Clear</button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state"><i className="fa-regular fa-note-sticky" /><p>No sticky notes yet. Add your first note above!</p></div>
      ) : (
        <div className="sticky-grid">
          {notes.map((n) => (
            <div key={n.id} className="sticky-note" style={{ background: COLORS[n.color] || COLORS[0], border: `1px solid ${BORDER[n.color] || BORDER[0]}` }}>
              <button className="sn-del" onClick={() => del(n.id)}><i className="fa-solid fa-xmark" /></button>
              <h4>{n.title}</h4>
              <p style={{ flex: 1 }}>{n.content}</p>
              <div className="sn-date">{n.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
