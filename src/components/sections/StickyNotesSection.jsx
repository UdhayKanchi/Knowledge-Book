import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const COLORS = ["#2a3a1a", "#1a2a3a", "#2a1a3a", "#3a1a1a", "#3a2a1a"];
const BORDER = [
  "rgba(200,241,53,0.2)",
  "rgba(0,229,204,0.2)",
  "rgba(124,106,255,0.2)",
  "rgba(255,107,107,0.2)",
  "rgba(255,181,71,0.2)",
];

export default function StickyNotesSection() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(0);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ✅ Real-time listener — user-specific sticky notes sync across all devices
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "stickyNotes"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Sticky notes listener error:", err);
        // Fallback: try without orderBy if index not created yet
        const qFallback = query(
          collection(db, "stickyNotes"),
          where("userId", "==", user.uid)
        );
        const unsubFallback = onSnapshot(qFallback, (snap) => {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setNotes(data);
          setLoading(false);
        });
        return unsubFallback;
      }
    );

    return () => unsub();
  }, [user]);

  const addNote = async () => {
    if (!title.trim() && !content.trim()) {
      showToast("Please write something!");
      return;
    }
    if (!user) {
      showToast("You must be logged in!");
      return;
    }
    try {
      await addDoc(collection(db, "stickyNotes"), {
        title: title || "Untitled",
        content,
        color,
        userId: user.uid,
        userEmail: user.email,
        date: new Date().toLocaleDateString("en-IN"),
        createdAt: Date.now(),
      });
      setTitle("");
      setContent("");
      showToast("Note saved to cloud! 📝");
    } catch (err) {
      console.error("Add note error:", err);
      showToast("Failed to save note. Try again.");
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "stickyNotes", id));
      showToast("Note deleted.");
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  return (
    <div>
      {toast && <div className="simple-toast">{toast}</div>}

      {/* ADD NOTE FORM */}
      <div className="add-note-form">
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <input
            className="form-inp"
            placeholder="Note title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {COLORS.map((c, i) => (
              <div
                key={i}
                onClick={() => setColor(i)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: c,
                  border: `3px solid ${i === color ? "#fff" : "transparent"}`,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
        <textarea
          className="form-inp"
          placeholder="Write your note here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          style={{ width: "100%", resize: "vertical", marginBottom: 10 }}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn-lime" onClick={addNote}>
            <i className="fa-solid fa-plus" /> Add Note
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              setTitle("");
              setContent("");
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* STICKY NOTES GRID */}
      {loading ? (
        <div className="loading-msg">
          <i className="fa-solid fa-spinner fa-spin" /> Loading your notes from cloud…
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <i className="fa-regular fa-note-sticky" />
          <p>No sticky notes yet. Add your first note above!</p>
        </div>
      ) : (
        <div className="sticky-grid">
          {notes.map((n) => (
            <div
              key={n.id}
              className="sticky-note"
              style={{
                background: COLORS[n.color] || COLORS[0],
                border: `1px solid ${BORDER[n.color] || BORDER[0]}`,
              }}
            >
              <button className="sn-del" onClick={() => deleteNote(n.id)}>
                <i className="fa-solid fa-xmark" />
              </button>
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