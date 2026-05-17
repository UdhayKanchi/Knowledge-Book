import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { signOut } from "firebase/auth";
import { auth, db, storage, ADMIN_EMAIL } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [iqPdfs, setIqPdfs] = useState([]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Note form
  const [nForm, setNForm] = useState({ title: "", subject: "", type: "notes", desc: "" });
  const [nFile, setNFile] = useState(null);
  // IQ form
  const [iForm, setIForm] = useState({ title: "", category: "", desc: "" });
  const [iFile, setIFile] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => { loadNotes(); loadIQPdfs(); loadUsers(); }, []);

  const loadNotes = async () => {
    const snap = await getDocs(collection(db, "notes"));
    setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  const loadIQPdfs = async () => {
    const snap = await getDocs(collection(db, "interviewPdfs"));
    setIqPdfs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map((d) => d.data()));
  };

  const uploadNote = async (e) => {
    e.preventDefault();
    if (!nForm.title || !nForm.subject || !nFile) { showToast("Fill all fields and select a file.", "error"); return; }
    setUploading(true);
    try {
      const sRef = ref(storage, `notes/${Date.now()}_${nFile.name}`);
      const snap = await uploadBytes(sRef, nFile);
      const url = await getDownloadURL(snap.ref);
      await addDoc(collection(db, "notes"), { ...nForm, downloadURL: url, storagePath: snap.ref.fullPath, fileName: nFile.name, uploadDate: new Date().toLocaleDateString() });
      showToast("Note uploaded successfully! ✅");
      setNForm({ title: "", subject: "", type: "notes", desc: "" }); setNFile(null);
      loadNotes();
    } catch (err) { showToast("Upload failed: " + err.message, "error"); }
    setUploading(false);
  };

  const uploadIQ = async (e) => {
    e.preventDefault();
    if (!iForm.title || !iForm.category || !iFile) { showToast("Fill all fields and select a file.", "error"); return; }
    setUploading(true);
    try {
      const sRef = ref(storage, `interviewPdfs/${Date.now()}_${iFile.name}`);
      const snap = await uploadBytes(sRef, iFile);
      const url = await getDownloadURL(snap.ref);
      await addDoc(collection(db, "interviewPdfs"), { ...iForm, downloadURL: url, storagePath: snap.ref.fullPath, fileName: iFile.name, uploadDate: new Date().toLocaleDateString() });
      showToast("Interview PDF uploaded! ✅");
      setIForm({ title: "", category: "", desc: "" }); setIFile(null);
      loadIQPdfs();
    } catch (err) { showToast("Upload failed: " + err.message, "error"); }
    setUploading(false);
  };

  const deleteNote = async (id, path) => {
    if (!confirm("Delete this note permanently?")) return;
    await deleteDoc(doc(db, "notes", id));
    if (path) { try { await deleteObject(ref(storage, path)); } catch (_) {} }
    showToast("Note deleted.", "info"); loadNotes();
  };

  const deleteIQ = async (id, path) => {
    if (!confirm("Delete this interview PDF?")) return;
    await deleteDoc(doc(db, "interviewPdfs", id));
    if (path) { try { await deleteObject(ref(storage, path)); } catch (_) {} }
    showToast("Interview PDF deleted.", "info"); loadIQPdfs();
  };

  const logout = async () => { await signOut(auth); navigate("/login"); };

  const TABS = [
    { id: "notes", label: "📝 Upload Notes", icon: "fa-upload" },
    { id: "iq", label: "📋 Upload Interview PDFs", icon: "fa-file-pdf" },
    { id: "manage-notes", label: "📦 Manage Notes", icon: "fa-list" },
    { id: "manage-iq", label: "🗂 Manage IQ PDFs", icon: "fa-folder" },
    { id: "users", label: "👥 Users", icon: "fa-users" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand"><i className="fa-solid fa-gauge" /> Admin</div>
        {TABS.map((t) => (
          <div key={t.id} className={`admin-nav${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
            <i className={`fa-solid ${t.icon}`} /> <span>{t.label}</span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div className="admin-nav" onClick={() => navigate("/home")}><i className="fa-solid fa-arrow-left" /> <span>Back to App</span></div>
        <div className="admin-nav danger" onClick={logout}><i className="fa-solid fa-right-from-bracket" /> <span>Logout</span></div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <h2 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 700 }}>Knowledge Book Admin</h2>
            <p style={{ color: "#64748b", fontSize: "0.82rem" }}>Logged in as {user?.email}</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontFamily: "monospace", color: "#00eaff", fontSize: "0.88rem" }}>{new Date().toLocaleDateString()}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <div className="stat-chip">📄 {notes.length} Notes</div>
              <div className="stat-chip iq">📋 {iqPdfs.length} IQ PDFs</div>
              <div className="stat-chip usr">👥 {users.length} Users</div>
            </div>
          </div>
        </div>

        <div className="admin-body">
          {/* Upload Notes */}
          {tab === "notes" && (
            <div className="admin-card">
              <h3 className="card-title"><i className="fa-solid fa-upload" style={{ color: "#c8f135" }} /> Upload Notes / PDF</h3>
              <form onSubmit={uploadNote} className="upload-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Note Title *</label>
                    <input className="a-input" value={nForm.title} onChange={(e) => setNForm({ ...nForm, title: e.target.value })} placeholder="e.g. Data Structures Complete Notes" required />
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <input className="a-input" value={nForm.subject} onChange={(e) => setNForm({ ...nForm, subject: e.target.value })} placeholder="e.g. Computer Science" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select className="a-input" value={nForm.type} onChange={(e) => setNForm({ ...nForm, type: e.target.value })}>
                      <option value="notes">📝 Notes</option>
                      <option value="assignment">📋 Assignment</option>
                      <option value="pyq">📄 Previous Year Paper</option>
                      <option value="book">📚 Reference Book</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>PDF File *</label>
                    <input className="a-input" type="file" accept=".pdf" onChange={(e) => setNFile(e.target.files[0])} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="a-input" rows={2} value={nForm.desc} onChange={(e) => setNForm({ ...nForm, desc: e.target.value })} placeholder="Brief description…" />
                </div>
                <button type="submit" className="a-btn-primary" disabled={uploading}>
                  {uploading ? "Uploading…" : <><i className="fa-solid fa-cloud-arrow-up" /> Upload Note</>}
                </button>
              </form>
            </div>
          )}

          {/* Upload Interview PDFs */}
          {tab === "iq" && (
            <div className="admin-card">
              <h3 className="card-title"><i className="fa-solid fa-file-pdf" style={{ color: "#7c6aff" }} /> Upload Interview PDF</h3>
              <form onSubmit={uploadIQ} className="upload-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>PDF Title *</label>
                    <input className="a-input" value={iForm.title} onChange={(e) => setIForm({ ...iForm, title: e.target.value })} placeholder="e.g. Frontend Interview Questions" required />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <input className="a-input" value={iForm.category} onChange={(e) => setIForm({ ...iForm, category: e.target.value })} placeholder="e.g. Frontend, Python, DSA" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>PDF File *</label>
                    <input className="a-input" type="file" accept=".pdf" onChange={(e) => setIFile(e.target.files[0])} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input className="a-input" value={iForm.desc} onChange={(e) => setIForm({ ...iForm, desc: e.target.value })} placeholder="Brief description…" />
                  </div>
                </div>
                <button type="submit" className="a-btn-primary" disabled={uploading}>
                  {uploading ? "Uploading…" : <><i className="fa-solid fa-cloud-arrow-up" /> Upload Interview PDF</>}
                </button>
              </form>
            </div>
          )}

          {/* Manage Notes */}
          {tab === "manage-notes" && (
            <div className="admin-card">
              <h3 className="card-title"><i className="fa-solid fa-list" style={{ color: "#00e5cc" }} /> Manage Notes ({notes.length})</h3>
              {notes.length === 0 ? <p className="empty-msg">No notes uploaded yet.</p> : (
                <table className="a-table">
                  <thead><tr><th>Title</th><th>Subject</th><th>Type</th><th>Date</th><th>Action</th></tr></thead>
                  <tbody>
                    {notes.map((n) => (
                      <tr key={n.id}>
                        <td><a href={n.downloadURL} target="_blank" rel="noreferrer" style={{ color: "#00eaff" }}>{n.title}</a></td>
                        <td><span className="badge">{n.subject}</span></td>
                        <td style={{ textTransform: "capitalize" }}>{n.type}</td>
                        <td>{n.uploadDate}</td>
                        <td><button className="del-btn" onClick={() => deleteNote(n.id, n.storagePath)}><i className="fa-solid fa-trash" /> Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Manage IQ PDFs */}
          {tab === "manage-iq" && (
            <div className="admin-card">
              <h3 className="card-title"><i className="fa-solid fa-folder" style={{ color: "#ffb547" }} /> Manage Interview PDFs ({iqPdfs.length})</h3>
              {iqPdfs.length === 0 ? <p className="empty-msg">No interview PDFs uploaded yet.</p> : (
                <table className="a-table">
                  <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Action</th></tr></thead>
                  <tbody>
                    {iqPdfs.map((p) => (
                      <tr key={p.id}>
                        <td><a href={p.downloadURL} target="_blank" rel="noreferrer" style={{ color: "#00eaff" }}>{p.title}</a></td>
                        <td><span className="badge violet">{p.category}</span></td>
                        <td>{p.uploadDate}</td>
                        <td><button className="del-btn" onClick={() => deleteIQ(p.id, p.storagePath)}><i className="fa-solid fa-trash" /> Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div className="admin-card">
              <h3 className="card-title"><i className="fa-solid fa-users" style={{ color: "#ff6b6b" }} /> Registered Users ({users.length})</h3>
              {users.length === 0 ? <p className="empty-msg">No users yet.</p> : (
                <table className="a-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{u.name || "—"}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${u.role === "admin" ? "violet" : ""}`}>{u.role || "student"}</span></td>
                        <td>{u.joinDate || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast-area"><Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} /></div>}
    </div>
  );
}
