import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Safe local memory buffers configuration wrappers
const getStorageCollectionNode = (key) => {
  try {
    const data = localStorage.getItem(`kb_production_${key}`);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const setStorageCollectionNode = (key, value) => {
  localStorage.setItem(`kb_production_${key}`, JSON.stringify(value));
};

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
  
  // Dynamic component states array matrix loaders
  const [notes, setNotes] = useState(() => getStorageCollectionNode("notes"));
  const [iqPdfs, setIqPdfs] = useState(() => getStorageCollectionNode("iqPdfs"));
  const [users, setUsers] = useState(() => getStorageCollectionNode("users"));
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Forms dynamic model variables strings keys mapping setup data logs
  const [nForm, setNForm] = useState({ title: "", subject: "", type: "notes", desc: "", driveUrl: "" });
  const [iForm, setIForm] = useState({ title: "", category: "", desc: "", driveUrl: "" });

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // Sync automatic components listeners target triggers maps fields
  useEffect(() => { setStorageCollectionNode("notes", notes); }, [notes]);
  useEffect(() => { setStorageCollectionNode("iqPdfs", iqPdfs); }, [iqPdfs]);

  // Initial footprint user log ledger configurations tracking list parameters setup
  useEffect(() => {
    const activeLogs = getStorageCollectionNode("users");
    if (activeLogs.length === 0) {
      const fallbackUsersLedger = [
        { name: "Uday Kanchi", email: "uday@kanchi.me", role: "admin", joinDate: "16/03/2026" },
        { name: "Harshita", email: "harshita@edu.in", role: "student", joinDate: "28/04/2026" }
      ];
      setUsers(fallbackUsersLedger);
      setStorageCollectionNode("users", fallbackUsersLedger);
    } else {
      setUsers(activeLogs);
    }
  }, []);

  const uploadNote = (e) => {
    e.preventDefault();
    if (!nForm.title || !nForm.subject || !nForm.driveUrl) {
      showToast("Please fill all required verification parameters fields data.", "error");
      return;
    }
    setUploading(true);

    const freshNoteDataNodeObject = {
      id: `note_${Date.now()}`,
      title: nForm.title,
      subject: nForm.subject,
      type: nForm.type,
      desc: nForm.desc,
      downloadURL: nForm.driveUrl,
      uploadDate: new Date().toLocaleDateString("en-IN")
    };

    setNotes((prev) => [freshNoteDataNodeObject, ...prev]);
    showToast("Academic document note reference pointer published successfully! ✅");
    setNForm({ title: "", subject: "", type: "notes", desc: "", driveUrl: "" });
    setUploading(false);
  };

  const uploadIQ = (e) => {
    e.preventDefault();
    if (!iForm.title || !iForm.category || !iForm.driveUrl) {
      showToast("Please fill all target criteria input fields data nodes.", "error");
      return;
    }
    setUploading(true);

    const freshPlacementPacketPayloadObject = {
      id: `iq_${Date.now()}`,
      title: iForm.title,
      category: iForm.category,
      desc: iForm.desc,
      downloadURL: iForm.driveUrl,
      uploadDate: new Date().toLocaleDateString("en-IN")
    };

    setIqPdfs((prev) => [freshPlacementPacketPayloadObject, ...prev]);
    showToast("Corporate Interview reference packet roadmap vector published! ✅");
    setIForm({ title: "", category: "", desc: "", driveUrl: "" });
    setUploading(false);
  };

  const deleteNote = (id) => {
    if (!confirm("Delete this entry parameter footprint node?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast("Notes record parameter model reference cleared.", "info");
  };

  const deleteIQ = (id) => {
    if (!confirm("Delete this packet validation reference pointer data?")) return;
    setIqPdfs((prev) => prev.filter((p) => p.id !== id));
    showToast("Interview target tracking data reference cleared.", "info");
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
      
      {/* GLOW DECORATIONS */}
      <div style={{ position: "absolute", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(200,241,53,0.04) 0%, rgba(0,0,0,0) 70%)", top: "-100px", right: "-100px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(124,106,255,0.03) 0%, rgba(0,0,0,0) 70%)", bottom: "-150px", left: "200px", pointerEvents: "none" }} />

      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar" style={{
        width: "280px",
        background: "var(--ink-2)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 20px",
        gap: "8px",
        zIndex: 10
      }}>
        <div className="admin-brand" style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.4rem",
          fontWeight: 800,
          color: "var(--text)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px",
          paddingLeft: "10px"
        }}>
          <div style={{ width: "32px", height: "32px", background: "var(--lime)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: "0.95rem" }} />
          </div>
          <span>Admin Panel</span>
        </div>

        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <div
              key={t.id}
              className={`admin-nav${isActive ? " active" : ""}`}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                color: isActive ? "var(--text)" : "var(--muted)",
                background: isActive ? "var(--surface)" : "transparent",
                border: isActive ? "1px solid var(--border-h)" : "1px solid transparent",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.92rem"
              }}
            >
              <i className={`fa-solid ${t.icon}`} style={{ color: isActive ? t.color : "var(--dimmed)", fontSize: "1.1rem", width: "20px", textAlign: "center" }} />
              <span>{t.label}</span>
            </div>
          );
        })}

        <div style={{ flex: 1 }} />
        
        <div className="admin-nav" onClick={() => navigate("/home")} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", color: "var(--muted)", fontSize: "0.92rem", fontWeight: 500, transition: "all 0.2s" }}>
          <i className="fa-solid fa-arrow-left" style={{ width: "20px", textAlign: "center" }} /> <span>Back to Main Hub</span>
        </div>
        
        <div className="admin-nav danger" onClick={handleSessionLogout} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", color: "var(--coral)", background: "rgba(255,107,107,0.04)", border: "1px solid rgba(255,107,107,0.08)", fontSize: "0.92rem", fontWeight: 600, transition: "all 0.2s" }}>
          <i className="fa-solid fa-right-from-bracket" style={{ width: "20px", textAlign: "center" }} /> <span>Logout</span>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="admin-main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* TOPBAR MODULE */}
        <div className="admin-topbar" style={{
          padding: "24px 40px",
          display: "flex",
          justifyContent: "between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          background: "rgba(13,15,20,0.7)",
          backdropFilter: "blur(20px)",
          sticky: "top",
          zIndex: 9
        }}>
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.5px" }}>
              Knowledge Book Control Workspace
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "4px" }}>
              Secure signature access point: <span style={{ color: "var(--cyan)", fontFamily: "'JetBrains Mono', monospace" }}>{user?.email || "udayadmin@tcs.com"}</span>
            </p>
          </div>
          
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--dimmed)", fontSize: "0.88rem", background: "var(--ink-2)", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
            
            <div style={{ display: "flex", gap: 10 }}>
              <div className="stat-chip" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(200,241,53,0.06)", border: "1px solid rgba(200,241,53,0.15)", color: "var(--lime)", padding: "6px 14px", borderRadius: "50px", fontSize: "0.82rem", fontWeight: 600 }}>
                📄 {notes.length} Notes Maps
              </div>
              <div className="stat-chip iq" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(124,106,255,0.06)", border: "1px solid rgba(124,106,255,0.15)", color: "var(--violet)", padding: "6px 14px", borderRadius: "50px", fontSize: "0.82rem", fontWeight: 600 }}>
                📋 {iqPdfs.length} Guides
              </div>
              <div className="stat-chip usr" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", color: "var(--coral)", padding: "6px 14px", borderRadius: "50px", fontSize: "0.82rem", fontWeight: 600 }}>
                👥 {users.length} Users
              </div>
            </div>
          </div>
        </div>

        {/* WORKSPACE CONTENT BODY */}
        <div className="admin-body" style={{ padding: "40px", flex: 1, overflowY: "auto" }}>
          
          {/* TAB: UPLOAD NOTES FORM */}
          {tab === "notes" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)", animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", color: "var(--text)" }}>
                <i className="fa-solid fa-link" style={{ color: "var(--lime)" }} /> Publish Academic Reference Documents
              </h3>
              
              <form onSubmit={uploadNote} className="upload-form" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Resource Title Identifier *</label>
                    <input className="a-input" value={nForm.title} onChange={(e) => setNForm({ ...nForm, title: e.target.value })} placeholder="e.g. Complete Advanced OS Module Notes" required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none", transition: "all 0.2s" }} onFocus={(e)=>e.target.style.borderColor="var(--lime)"} onBlur={(e)=>e.target.style.borderColor="var(--border)"} />
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Domain Subject Scope Track *</label>
                    <input className="a-input" value={nForm.subject} onChange={(e) => setNForm({ ...nForm, subject: e.target.value })} placeholder="e.g. Computer Science Engineering" required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none", transition: "all 0.2s" }} onFocus={(e)=>e.target.style.borderColor="var(--lime)"} onBlur={(e)=>e.target.style.borderColor="var(--border)"} />
                  </div>
                </div>
                
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Resource Classification Type</label>
                    <select className="a-input" value={nForm.type} onChange={(e) => setNForm({ ...nForm, type: e.target.value })} style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }}>
                      <option value="notes">📝 Academic Reference Lecture Notes</option>
                      <option value="assignment">📋 Problem Matrix Solution Sheets</option>
                      <option value="pyq">📄 Historical Assessment Blueprints</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Cloud Share Reference Document URL Link *</label>
                    <input className="a-input" type="url" value={nForm.driveUrl} onChange={(e) => setNForm({ ...nForm, driveUrl: e.target.value })} placeholder="https://drive.google.com/file/d/..." required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none", transition: "all 0.2s" }} onFocus={(e)=>e.target.style.borderColor="var(--lime)"} onBlur={(e)=>e.target.style.borderColor="var(--border)"} />
                  </div>
                </div>
                
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Abstract Summary Metadata Context</label>
                  <textarea className="a-input" rows={3} value={nForm.desc} onChange={(e) => setNForm({ ...nForm, desc: e.target.value })} placeholder="Enter brief overview summaries parameters scope details..." style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none", resize: "none", transition: "all 0.2s" }} onFocus={(e)=>e.target.style.borderColor="var(--lime)"} onBlur={(e)=>e.target.style.borderColor="var(--border)"} />
                </div>
                
                <button type="submit" className="a-btn-primary" disabled={uploading} style={{ alignSelf: "flex-end", background: "var(--lime)", color: "var(--ink)", border: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                  {uploading ? "Processing Asset Deployment..." : <><i className="fa-solid fa-cloud-arrow-up" /> Deploy Material Asset</>}
                </button>
              </form>
            </div>
          )}

          {/* TAB: UPLOAD INTERVIEW LINKS FORM */}
          {tab === "iq" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)", animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", color: "var(--text)" }}>
                <i className="fa-solid fa-file-shield" style={{ color: "var(--violet)" }} /> Publish Placement Framework Blueprints
              </h3>
              
              <form onSubmit={uploadIQ} className="upload-form" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Corporate Framework Heading *</label>
                    <input className="a-input" value={iForm.title} onChange={(e) => setIForm({ ...iForm, title: e.target.value })} placeholder="e.g. TCS Ninja Technical Interview Packet Guide" required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Target Track Vectors *</label>
                    <input className="a-input" value={iForm.category} onChange={(e) => setIForm({ ...iForm, category: e.target.value })} placeholder="e.g. Fullstack Developer JavaScript, DSA" required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                  </div>
                </div>
                
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Absolute Drive Location Shared Link *</label>
                  <input className="a-input" type="url" value={iForm.driveUrl} onChange={(e) => setIForm({ ...iForm, driveUrl: e.target.value })} placeholder="https://drive.google.com/file/d/..." required style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                </div>
                
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Abstract Overview Scope Meta</label>
                  <input className="a-input" value={iForm.desc} onChange={(e) => setIForm({ ...iForm, desc: e.target.value })} placeholder="Specify core parameters, constraints or criteria milestones..." style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--border)", padding: "14px 16px", borderRadius: "12px", color: "var(--text)", outline: "none" }} />
                </div>
                
                <button type="submit" className="a-btn-primary" disabled={uploading} style={{ alignSelf: "flex-end", background: "var(--violet)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                  {uploading ? "Publishing Packet..." : <><i className="fa-solid fa-cloud-arrow-up" /> Deploy Placement Packet</>}
                </button>
              </form>
            </div>
          )}

          {/* TAB: MANAGE NOTES LEDGER */}
          {tab === "manage-notes" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)", animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px" }}>
                <i className="fa-solid fa-list" style={{ color: "var(--cyan)" }} /> Notes Registry Matrix Logs ({notes.length})
              </h3>
              
              {notes.length === 0 ? <p style={{ color: "var(--dimmed)", textAlign: "center", padding: "30px" }}>No entries discovered inside local datasets framework logs.</p> : (
                <div style={{ overflowX: "auto" }}>
                  <table className="a-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", color: "var(--text)" }}>
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
                        <tr key={n.id} style={{ background: "var(--ink-3)", transition: "all 0.2s" }}>
                          <td style={{ padding: "16px", borderRadius: "12px 0 0 12px", fontWeight: 600 }}>
                            <a href={n.downloadURL} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)", textDecoration: "none" }}>{n.title}</a>
                          </td>
                          <td><span style={{ background: "rgba(0,229,204,0.06)", color: "var(--cyan)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid rgba(0,229,204,0.12)" }}>{n.subject}</span></td>
                          <td style={{ textTransform: "uppercase", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--dimmed)" }}>{n.type}</td>
                          <td style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{n.uploadDate}</td>
                          <td style={{ paddingRight: "16px", borderRadius: "0 12px 12px 0", textAlign: "right" }}>
                            <button className="del-btn" onClick={() => deleteNote(n.id)} style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", color: "var(--coral)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <i className="fa-solid fa-trash-can" style={{ fontSize: "0.78rem" }} /> Remove
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

          {/* TAB: MANAGE IQ LEDGER */}
          {tab === "manage-iq" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)", animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px" }}>
                <i className="fa-solid fa-folder" style={{ color: "var(--amber)" }} /> Interview Blueprint Assets Ledger ({iqPdfs.length})
              </h3>
              
              {iqPdfs.length === 0 ? <p style={{ color: "var(--dimmed)", textAlign: "center", padding: "30px" }}>No placement guidelines found on dynamic targets.</p> : (
                <div style={{ overflowX: "auto" }}>
                  <table className="a-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", color: "var(--text)" }}>
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
                            <button className="del-btn" onClick={() => deleteIQ(p.id)} style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", color: "var(--coral)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
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

          {/* TAB: USERS DIRECTORY */}
          {tab === "users" && (
            <div className="admin-card" style={{ background: "var(--ink-2)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)", animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <h3 className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px" }}>
                <i className="fa-solid fa-users" style={{ color: "var(--coral)" }} /> Verified System Registration Ledger ({users.length})
              </h3>
              
              <div style={{ overflowX: "auto" }}>
                <table className="a-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", color: "var(--text)" }}>
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
                          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: u.role === 'admin' ? "rgba(124,106,255,0.15)" : "rgba(0,229,204,0.15)", color: u.role === 'admin' ? "var(--violet)" : "var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700 }}>
                            {u.name.charAt(0)}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "var(--muted)" }}>{u.email}</td>
                        <td>
                          <span style={{
                            background: u.role === "admin" ? "rgba(124,106,255,0.06)" : "rgba(0,229,204,0.06)",
                            color: u.role === "admin" ? "var(--violet)" : "var(--cyan)",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            border: u.role === "admin" ? "1px solid rgba(124,106,255,0.12)" : "1px solid rgba(0,229,204,0.12)"
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ paddingRight: "16px", borderRadius: "0 12px 12px 0", fontSize: "0.85rem", color: "var(--dimmed)" }}>{u.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Notification Display Canvas Stack */}
      {toast && <div className="toast-area" style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 99999, display: "flex", flexDirection: "column", gap: "10px" }}><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></div>}
    </div>
  );
}