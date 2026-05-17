import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  
  const iconMap = { success: "fa-circle-check", error: "fa-circle-xmark", info: "fa-circle-info" };
  
  return (
    <div className={`toast toast-${type}`} style={{
      background: "rgba(30, 35, 48, 0.95)",
      backdropFilter: "blur(12px)",
      borderLeft: `4px solid var(--${type === 'success' ? 'lime' : type === 'error' ? 'coral' : 'cyan'})`,
      borderRadius: "12px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      animation: "fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      color: "#f2f4f8"
    }}>
      <i className={`fa-solid ${iconMap[type] || "fa-bell"}`} style={{ color: `var(--${type === 'success' ? 'lime' : type === 'error' ? 'coral' : 'cyan'})` }} />
      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("notes");
  
  // Back onto Centralized Cloud Firestore Databases Data Arrays Nodes 🚀
  const [notes, setNotes] = useState([]);
  const [iqPdfs, setIqPdfs] = useState([]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dbError, setDbError] = useState(null);

  // Forms model tracking configurations definitions variables inputs fields updates logic
  const [nForm, setNForm] = useState({ title: "", subject: "", type: "notes", desc: "", driveUrl: "" });
  const [iForm, setIForm] = useState({ title: "", category: "", desc: "", driveUrl: "" });

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // Load continuous centralized queries whenever components load active state variables ra ✅
  useEffect(() => {
    if (user) {
      loadNotes();
      loadIQPdfs();
      loadUsers();
    }
  }, [user, tab]);

  const loadNotes = async () => {
    try {
      const snap = await getDocs(collection(db, "notes"));
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setDbError(null);
    } catch (err) {
      console.error("Cloud firestore nodes load failure:", err);
      setDbError("Failed to parse structural data layers from Cloud Firestore.");
    }
  };

  const loadIQPdfs = async () => {
    try {
      const snap = await getDocs(collection(db, "interviewPdfs"));
      setIqPdfs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Cloud interview packets mapping tracking metrics crashed:", err);
    }
  };

  const loadUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("User datasets logs compilation crash:", err);
    }
  };

  const uploadNote = async (e) => {
    e.preventDefault();
    if (!nForm.title || !nForm.subject || !nForm.driveUrl) {
      showToast("Please fill all required verification parameters fields data.", "error");
      return;
    }
    setUploading(true);
    try {
      // ✅ Store to Firebase Firestore globally — visible on all devices
      await addDoc(collection(db, "notes"), {
        title: nForm.title,
        subject: nForm.subject,
        type: nForm.type,
        desc: nForm.desc,
        downloadURL: nForm.driveUrl,
        uploadDate: new Date().toLocaleDateString("en-IN"),
        createdAt: Date.now(),
      });
      showToast("Academic document note reference pointer published globally! ✅");
      setNForm({ title: "", subject: "", type: "notes", desc: "", driveUrl: "" });
      loadNotes();
    } catch (err) {
      showToast("Database server drop actions failed parameters logic: " + err.message, "error");
    }
    setUploading(false);
  };

  const uploadIQ = async (e) => {
    e.preventDefault();
    if (!iForm.title || !iForm.category || !iForm.driveUrl) {
      showToast("Please fill all target criteria input fields data nodes.", "error");
      return;
    }
    setUploading(true);
    try {
      // ✅ Store to Firebase Firestore globally — visible on all devices
      await addDoc(collection(db, "interviewPdfs"), {
        title: iForm.title,
        category: iForm.category,
        desc: iForm.desc,
        downloadURL: iForm.driveUrl,
        uploadDate: new Date().toLocaleDateString("en-IN"),
        createdAt: Date.now(),
      });
      showToast("Corporate Interview reference packet roadmap vector published globally! ✅");
      setIForm({ title: "", category: "", desc: "", driveUrl: "" });
      loadIQPdfs();
    } catch (err) {
      showToast("Verification data packet storage ingestion error parameters: " + err.message, "error");
    }
    setUploading(false);
  };

  const deleteNote = async (id) => {
    if (!confirm("Delete this note permanently across cloud cluster arrays?")) return;
    try {
      await deleteDoc(doc(db, "notes", id));
      showToast("Notes record parameter model reference cleared from cloud registers.", "info");
      loadNotes();
    } catch (err) {
      showToast("Removal trigger operation exceptions bounds: " + err.message, "error");
    }
  };

  const deleteIQ = async (id) => {
    if (!confirm("Delete this packet validation reference pointer data?")) return;
    try {
      await deleteDoc(doc(db, "interviewPdfs", id));
      showToast("Interview target tracking data reference cleared from server.", "info");
      loadIQPdfs();
    } catch (err) {
      showToast("Clear validation metrics limits processing throw exception: " + err.message, "error");
    }
  };

  const handleSessionLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  const TABS = [
    { id: "notes", label: "Publish Notes Link", icon: "fa-link", color: "var(--lime)" },
    { id: "iq", label: "Publish Interview Links", icon: "fa-file-shield", color: "var(--violet)" },
    { id: "manage-notes", label: "Manage Notes Ledger", icon: "fa-list", color: "var(--cyan)" },
    { id: "manage-iq", label: "Manage IQ Ledger", icon: "fa-folder", color: "var(--amber)" },
    { id: "users", label: "Users Directory", icon: "fa-users", color: "var(--coral)" },
  ];

  return (
    <div className="admin-layout" style={{ display: "flex", minHeight: "100vh", background: "var(--ink)", position: "relative" }}>
      
      {/* BACKGROUND GRAPHICS LAYER */}
      <div style={{ position: "absolute", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(200,241,53,0.04) 0%, rgba(0,0,0,0) 70%)", top: "-100px", right: "-100px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(124,106,255,0.03) 0%, rgba(0,0,0,0) 70%)", bottom: "-150px", left: "200px", pointerEvents: "none" }} />

      {/* SIDEBAR NAVIGATION CONTROL PANEL */}
      <aside className="admin-sidebar" style={{ width: "280px", background: "var(--ink-2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "32px 20px", gap: "8px", zIndex: 10 }}>
        <div className="admin-brand" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", paddingLeft: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "var(--lime)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: "0.95rem" }} />
          </div>
          <span>Admin Panel</span>
        </div>

        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <div key={t.id} className={`admin-nav${isActive ? " active" : ""}`} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)", color: isActive ? "var(--text)" : "var(--muted)", background: isActive ? "var(--surface)" : "transparent", border: isActive ? "1px solid var(--border-h)" : "1px solid transparent", fontWeight: isActive ? 600 : 500, fontSize: "0.92rem" }}>
              <i className={`fa-solid ${t.icon}`} style={{ color: isActive ? t.color : "var(--dimmed)", fontSize: "1.1rem", width: "20px", textAlign: "center" }} />
              <span>{t.label}</span>
            </div>
          );
        })}

        <div style={{ flex: 1 }} />
        <div className="admin-nav" onClick={() => navigate("/home")} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", color: "var(--muted)", fontSize: "0.92rem", fontWeight: 500 }}>
          <i className="fa-solid fa-arrow-left" style={{ width: "20px", textAlign: "center" }} /> <span>Back to Main Hub</span>
        </div>
        <div className="admin-nav danger" onClick={handleSessionLogout} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", color: "var(--coral)", background: "rgba(255,107,107,0.04)", border: "1px solid rgba(255,107,107,0.08)", fontSize: "0.92rem", fontWeight: 600 }}>
          <i className="fa-solid fa-right-from-bracket" style={{ width: "20px", textAlign: "center" }} /> <span>Logout</span>
        </div>
      </aside>

      {/* CORE FORM PROCESSING CONTAINER INTERFACE AREA */}
      <div className="admin-main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div className="admin-topbar" style={{ padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", background: "rgba(13,15,20,0.7)", backdropFilter: "blur(20px)", zIndex: 9 }}>
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)", fontSize: "1.5rem", fontWeight: 700 }}>Knowledge Book Control Center</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "4px" }}>
              Active Live Server Node context sync identity: <span style={{ color: "var(--cyan)", fontFamily: "'JetBrains Mono', monospace" }}>{user?.email || "udayadmin@tcs.com"}</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--dimmed)", fontSize: "0.88rem", background: "var(--ink-2)", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="stat-chip" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(200,241,53,0.06)", border: "1px solid rgba(200,241,53,0.15)", color: "var(--lime)", padding: "6px 14px", borderRadius: "50px", fontSize: "0.82rem", fontWeight: 600 }}>📄 {notes.length} Notes Records</div>
              <div className="stat-chip iq" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(124,106,255,0.06)", border: "1px solid rgba(124,106,255,0.15)", color: "var(--violet)", padding: "6px 14px", borderRadius: "50px", fontSize: "0.82rem", fontWeight: 600 }}>📋 {iqPdfs.length} Guides</div>
              <div className="stat-chip usr" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", color: "var(--coral)", padding: "6px 14px", borderRadius: "50px", fontSize: "0.82rem", fontWeight: 600 }}>👥 {users.length} Profiles</div>
            </div>
          </div>
        </div>

        <div className="admin-body" style={{ padding: "40px", flex: 1, overflowY: "auto" }}>
          {dbError && (
            <div className="error-banner" style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", padding: "16px", marginBottom: "20px", color: "#f87171" }}>
              <i className="fa-solid fa-circle-exclamation" /> <span>Database Permission Lock Warning context: {dbError}</span>
            </div>
          )}

          {tab === "notes" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}><i className="fa-solid fa-link" style={{ color: "var(--lime)" }} /> Publish Academic Reference Documents</h3>
              <form onSubmit={uploadNote} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Resource Title Identifier *</label>
                    <input value={nForm.title} onChange={(e) => setNForm({ ...nForm, title: e.target.value })} placeholder="e.g. Complete Advanced OS Module Notes" required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Domain Subject Scope Track *</label>
                    <input value={nForm.subject} onChange={(e) => setNForm({ ...nForm, subject: e.target.value })} placeholder="e.g. Computer Science Engineering" required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Resource Classification Type</label>
                    <select value={nForm.type} onChange={(e) => setNForm({ ...nForm, type: e.target.value })} style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }}>
                      <option value="notes">📝 Academic Reference Lecture Notes</option>
                      <option value="assignment">📋 Problem Matrix Solution Sheets</option>
                      <option value="pyq">📄 Historical Assessment Blueprints</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Cloud Share Reference Document URL Link *</label>
                    <input type="url" value={nForm.driveUrl} onChange={(e) => setNForm({ ...nForm, driveUrl: e.target.value })} placeholder="https://drive.google.com/file/d/..." required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Abstract Summary Metadata Context</label>
                  <textarea rows={3} value={nForm.desc} onChange={(e) => setNForm({ ...nForm, desc: e.target.value })} placeholder="Enter brief overview summaries parameters..." style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none", resize: "none" }} />
                </div>
                <button type="submit" disabled={uploading} style={{ alignSelf: "flex-end", background: "var(--lime)", color: "var(--ink)", border: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                  {uploading ? "Publishing Data Vector Node..." : <><i className="fa-solid fa-cloud-arrow-up" /> Deploy Material Asset</>}
                </button>
              </form>
            </div>
          )}

          {tab === "iq" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}><i className="fa-solid fa-file-shield" style={{ color: "var(--violet)" }} /> Publish Placement Framework Blueprints</h3>
              <form onSubmit={uploadIQ} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Corporate Framework Heading *</label>
                    <input value={iForm.title} onChange={(e) => setIForm({ ...iForm, title: e.target.value })} placeholder="e.g. TCS Ninja Technical Interview Packet Guide" required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Target Track Vectors *</label>
                    <input value={iForm.category} onChange={(e) => setIForm({ ...iForm, category: e.target.value })} placeholder="e.g. Fullstack Developer JavaScript, DSA" required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Absolute Drive Location Shared Link *</label>
                  <input type="url" value={iForm.driveUrl} onChange={(e) => setIForm({ ...iForm, driveUrl: e.target.value })} placeholder="https://drive.google.com/file/d/..." required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Abstract Overview Scope Meta</label>
                  <input value={iForm.desc} onChange={(e) => setIForm({ ...iForm, desc: e.target.value })} placeholder="Specify core parameters framework summaries..." style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                </div>
                <button type="submit" disabled={uploading} style={{ alignSelf: "flex-end", background: "var(--violet)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                  {uploading ? "Publishing Blueprint..." : <><i className="fa-solid fa-cloud-arrow-up" /> Deploy Placement Packet</>}
                </button>
              </form>
            </div>
          )}

          {tab === "manage-notes" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px" }}><i className="fa-solid fa-list" style={{ color: "var(--cyan)" }} /> Notes Registry Matrix Logs ({notes.length})</h3>
              {notes.length === 0 ? <p style={{ color: "var(--dimmed)", textAlign: "center", padding: "30px" }}>No cloud server files records available.</p> : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", color: "var(--text)" }}>
                    <thead>
                      <tr style={{ color: "var(--muted)", fontSize: "0.82rem", textAlign: "left" }}>
                        <th style={{ padding: "12px 16px" }}>Heading Description</th>
                        <th>Subject Domain</th>
                        <th>Classification</th>
                        <th>Timestamp</th>
                        <th style={{ textAlign: "right", paddingRight: "16px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((n) => (
                        <tr key={n.id} style={{ background: "var(--ink-3)" }}>
                          <td style={{ padding: "16px", borderRadius: "12px 0 0 12px", fontWeight: 600 }}>
                            <a href={n.downloadURL} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)", textDecoration: "none" }}>{n.title}</a>
                          </td>
                          <td><span style={{ background: "rgba(0,229,204,0.06)", color: "var(--cyan)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid rgba(0,229,204,0.12)" }}>{n.subject}</span></td>
                          <td style={{ textTransform: "uppercase", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--dimmed)" }}>{n.type}</td>
                          <td style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{n.uploadDate}</td>
                          <td style={{ paddingRight: "16px", borderRadius: "0 12px 12px 0", textAlign: "right" }}>
                            <button onClick={() => deleteNote(n.id)} style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", color: "var(--coral)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <i className="fa-solid fa-trash-can" /> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "manage-iq" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px" }}><i className="fa-solid fa-folder" style={{ color: "var(--amber)" }} /> Interview Blueprint Assets Ledger ({iqPdfs.length})</h3>
              {iqPdfs.length === 0 ? <p style={{ color: "var(--dimmed)", textAlign: "center", padding: "30px" }}>No placement guidelines tracking vectors located on server cluster.</p> : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", color: "var(--text)" }}>
                    <thead>
                      <tr style={{ color: "var(--muted)", fontSize: "0.82rem", textAlign: "left" }}>
                        <th style={{ padding: "12px 16px" }}>Assessment Target Profile</th>
                        <th>Focus Target Vectors</th>
                        <th>Publication Date</th>
                        <th style={{ textAlign: "right", paddingRight: "16px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {iqPdfs.map((p) => (
                        <tr key={p.id} style={{ background: "var(--ink-3)" }}>
                          <td style={{ padding: "16px", borderRadius: "12px 0 0 12px", fontWeight: 600 }}>
                            <a href={p.downloadURL} target="_blank" rel="noreferrer" style={{ color: "var(--amber)", textDecoration: "none" }}>{p.title}</a>
                          </td>
                          <td><span style={{ background: "rgba(255,181,71,0.06)", color: "var(--amber)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid rgba(255,181,71,0.12)" }}>{p.category}</span></td>
                          <td style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{p.uploadDate}</td>
                          <td style={{ paddingRight: "16px", borderRadius: "0 12px 12px 0", textAlign: "right" }}>
                            <button onClick={() => deleteIQ(p.id)} style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", color: "var(--coral)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}><i className="fa-solid fa-trash-can" /> Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "users" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px" }}><i className="fa-solid fa-users" style={{ color: "var(--coral)" }} /> Verified System Registration Ledger ({users.length})</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", color: "var(--text)" }}>
                  <thead>
                    <tr style={{ color: "var(--muted)", fontSize: "0.82rem", textAlign: "left" }}>
                      <th style={{ padding: "12px 16px" }}>Profile Identity Name</th>
                      <th>Communication Address</th>
                      <th>Permissions Token</th>
                      <th style={{ paddingRight: "16px" }}>Joined Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} style={{ background: "var(--ink-3)" }}>
                        <td style={{ padding: "16px", borderRadius: "12px 0 0 12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: u.role === 'admin' ? "rgba(124,106,255,0.15)" : "rgba(0,229,204,0.15)", color: u.role === 'admin' ? "var(--violet)" : "var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700 }}>{u.name ? u.name.charAt(0) : "S"}</div>
                          <span>{u.name || "Student Node"}</span>
                        </td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "var(--muted)" }}>{u.email}</td>
                        <td><span style={{ background: u.role === "admin" ? "rgba(124,106,255,0.06)" : "rgba(0,229,204,0.06)", color: u.role === "admin" ? "var(--violet)" : "var(--cyan)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", border: u.role === "admin" ? "1px solid rgba(124,106,255,0.12)" : "1px solid rgba(0,229,204,0.12)" }}>{u.role || "student"}</span></td>
                        <td style={{ paddingRight: "16px", borderRadius: "0 12px 12px 0", fontSize: "0.85rem", color: "var(--dimmed)" }}>{u.joinDate || "Recent Node"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast-area" style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 99999, display: "flex", flexDirection: "column", gap: "10px" }}><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></div>}
    </div>
  );
}