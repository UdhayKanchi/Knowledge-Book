import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RoadmapsSection from "../components/sections/RoadmapsSection";
import ToolsSection from "../components/sections/ToolsSection";
import StickyNotesSection from "../components/sections/StickyNotesSection";
import NotesSection from "../components/sections/NotesSection";
import InterviewSection from "../components/sections/InterviewSection";

const NAV = [
  { id: "roadmaps", icon: "fa-map", label: "Roadmaps" },
  { id: "tools", icon: "fa-toolbox", label: "Student Tools" },
  { id: "sticky", icon: "fa-note-sticky", label: "Sticky Notes" },
  { id: "notes", icon: "fa-file-pdf", label: "Notes PDFs" },
  { id: "interview", icon: "fa-comments", label: "Interview Prep" },
];

const TITLES = {
  roadmaps: { title: "Roadmaps", sub: "Explore IT career paths & learning roadmaps" },
  tools: { title: "Student Tools", sub: "Working calculators and productivity tools" },
  sticky: { title: "Sticky Notes", sub: "Save quick notes and ideas" },
  notes: { title: "Notes & PDFs", sub: "Study materials uploaded by admin" },
  interview: { title: "Interview Prep", sub: "PDF study materials for IT interviews" },
};

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return <div className="clock-badge">{time}</div>;
}

export default function HomePage() {
  const [active, setActive] = useState("roadmaps");
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // 🎯 Local Storage nundi live notes & interview data arrays sync cheyali ra
  const [localNotes, setLocalNotes] = useState([]);
  const [localIqPdfs, setLocalIqPdfs] = useState([]);

  useEffect(() => {
    const fetchLocalData = () => {
      try {
        const savedNotes = localStorage.getItem("kb_production_notes");
        const savedIqs = localStorage.getItem("kb_production_iqPdfs");
        
        setLocalNotes(savedNotes ? JSON.parse(savedNotes) : []);
        setLocalIqPdfs(savedIqs ? JSON.parse(savedIqs) : []);
      } catch (err) {
        console.error("Failed to read local storage vectors:", err);
      }
    };

    // Active component tab execute / shift ayyinappudalla refresh avthundi ra
    fetchLocalData();
  }, [active]);

  const logout = async () => { await signOut(auth); navigate("/login"); };
  const name = user?.displayName || user?.email?.split("@")[0] || "Student";
  const initials = name.charAt(0).toUpperCase();
  const { title, sub } = TITLES[active] || {};

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">KB</div>
        {NAV.map((n) => (
          <a key={n.id} className={`nav-item${active === n.id ? " active" : ""}`} onClick={() => setActive(n.id)}>
            <span className="nav-icon"><i className={`fa-solid ${n.icon}`} /></span>
            <span className="nav-label">{n.label}</span>
          </a>
        ))}
        <div className="nav-sep" />
        {isAdmin && (
          <a className="nav-item" onClick={() => navigate("/admin")}>
            <span className="nav-icon"><i className="fa-solid fa-gauge" /></span>
            <span className="nav-label">Admin Panel</span>
          </a>
        )}
      </aside>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <h1>{title}</h1><p>{sub}</p>
          </div>
          <div className="topbar-right">
            <Clock />
            <div className="user-chip">
              <div className="user-av">{initials}</div>
              <span>{name}</span>
            </div>
            <button className="logout-btn" onClick={logout}>
              <i className="fa-solid fa-right-from-bracket" /> Logout
            </button>
          </div>
        </div>

        <div className="section-content">
          {active === "roadmaps" && <RoadmapsSection />}
          {active === "tools" && <ToolsSection />}
          {active === "sticky" && <StickyNotesSection />}
          
          {/* 🎯 AdminPage data automatic ga sub-sections ki map chesthunnam ra */}
          {active === "notes" && <NotesSection notesData={localNotes} />}
          {active === "interview" && <InterviewSection interviewData={localIqPdfs} />}
        </div>
      </div>
    </div>
  );
}