import React, { useState, useEffect, useRef } from "react";

// ── CGPA Tool ──────────────────────────────────────────────
function CGPATool({ onClose }) {
  const [rows, setRows] = useState([{ sub: "", cred: 4, grade: 10 }]);
  const [result, setResult] = useState(null);
  const addRow = () => setRows([...rows, { sub: "", cred: 4, grade: 10 }]);
  const upd = (i, k, v) => { const r = [...rows]; r[i][k] = v; setRows(r); };
  const calc = () => {
    let tp = 0, tc = 0;
    rows.forEach((r) => { tp += r.cred * r.grade; tc += +r.cred; });
    if (tc === 0) return;
    const cgpa = (tp / tc).toFixed(2);
    const remarks = cgpa >= 9 ? "🏆 Outstanding!" : cgpa >= 8 ? "🎉 Excellent!" : cgpa >= 7 ? "👍 Very Good" : cgpa >= 6 ? "📈 Good" : "📚 Keep Going";
    setResult({ cgpa, pct: ((cgpa - 0.5) * 10).toFixed(1), remarks });
  };
  const grades = [["O (10)",10],["A+ (9)",9],["A (8)",8],["B+ (7)",7],["B (6)",6],["C (5)",5],["F (0)",0]];
  return (
    <div className="tw-box">
      <button className="tw-close" onClick={onClose}>✕</button>
      <div className="tw-title">🎓 CGPA / GPA Calculator</div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <button className="btn-lime btn-sm" onClick={addRow}><i className="fa-solid fa-plus" /> Add Subject</button>
        <button className="btn-ghost btn-sm" onClick={calc}><i className="fa-solid fa-calculator" /> Calculate</button>
        <button className="btn-danger btn-sm" onClick={() => { setRows([{sub:"",cred:4,grade:10}]); setResult(null); }}>Reset</button>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table className="cgpa-table">
          <thead><tr><th>Subject</th><th>Credits</th><th>Grade</th><th></th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td><input value={r.sub} onChange={(e)=>upd(i,"sub",e.target.value)} placeholder="Subject name" /></td>
                <td><input type="number" value={r.cred} min={1} max={6} onChange={(e)=>upd(i,"cred",+e.target.value)} style={{width:60}} /></td>
                <td><select value={r.grade} onChange={(e)=>upd(i,"grade",+e.target.value)}>{grades.map(([l,v])=><option key={v} value={v}>{l}</option>)}</select></td>
                <td>{rows.length > 1 && <button className="del-row-btn" onClick={()=>setRows(rows.filter((_,j)=>j!==i))}>✕</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result && <div className="cgpa-result"><div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:6}}>Your GPA/CGPA</div><div className="big-num">{result.cgpa}</div><div style={{fontSize:"0.82rem",color:"var(--muted)",marginTop:6}}>{result.remarks} • Approx {result.pct}%</div></div>}
    </div>
  );
}

// ── Pomodoro ───────────────────────────────────────────────
function PomodoroTool({ onClose }) {
  const [running, setRunning] = useState(false);
  const [total, setTotal] = useState(25*60);
  const [cur, setCur] = useState(25*60);
  const [mode, setMode] = useState("Pomodoro");
  const [completed, setCompleted] = useState(0);
  const iv = useRef(null);
  const pct = (1 - cur/total)*360;
  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const toggle = () => {
    if (running) { clearInterval(iv.current); setRunning(false); }
    else { setRunning(true); iv.current = setInterval(()=>setCur(c=>{ if(c<=1){clearInterval(iv.current);setRunning(false);setCompleted(p=>p+1);return total;}return c-1; }),1000); }
  };
  const reset = () => { clearInterval(iv.current); setRunning(false); setCur(total); };
  const setM = (min, label) => { clearInterval(iv.current); setRunning(false); setTotal(min*60); setCur(min*60); setMode(label); };
  useEffect(()=>()=>clearInterval(iv.current),[]);
  return (
    <div className="tw-box" style={{textAlign:"center"}}>
      <button className="tw-close" onClick={onClose}>✕</button>
      <div className="tw-title" style={{justifyContent:"center"}}>⏱️ Pomodoro Timer</div>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
        {[["Pomodoro",25],["Short Break",5],["Long Break",15]].map(([l,m])=>(
          <button key={l} className={`pomo-btn${mode===l?" active":""}`} onClick={()=>setM(m,l)}>{l}</button>
        ))}
      </div>
      <div className="pomo-ring" style={{background:`conic-gradient(var(--lime) ${pct}deg, var(--surface) ${pct}deg)`}}>
        <div className="pomo-inner"><div className="pomo-time">{fmt(cur)}</div><div className="pomo-label">{mode}</div></div>
      </div>
      <div style={{fontSize:"0.85rem",color:"var(--muted)",marginBottom:16}}>{completed} sessions completed</div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button className="btn-lime" onClick={toggle}><i className={`fa-solid ${running?"fa-pause":"fa-play"}`}/>{running?" Pause":" Start"}</button>
        <button className="btn-ghost" onClick={reset}><i className="fa-solid fa-rotate-right"/> Reset</button>
      </div>
      <div style={{marginTop:16,padding:"10px 14px",background:"var(--surface)",borderRadius:8,fontSize:"0.82rem",color:"var(--muted)"}}>💡 Work 25 min, break 5 min. After 4 sessions take a long break!</div>
    </div>
  );
}

// ── Attendance ─────────────────────────────────────────────
function AttendanceTool({ onClose }) {
  const [sub, setSub] = useState(""); const [tot, setTot] = useState(""); const [att, setAtt] = useState("");
  const [list, setList] = useState(()=>{try{return JSON.parse(localStorage.getItem("kb_att")||"[]")}catch{return[]}});
  const save = (l) => { setList(l); localStorage.setItem("kb_att",JSON.stringify(l)); };
  const add = () => {
    if(!sub||!tot) return;
    save([...list,{id:Date.now(),sub,total:+tot,attended:+att||0}]);
    setSub(""); setTot(""); setAtt("");
  };
  const del = (id) => save(list.filter(i=>i.id!==id));
  return (
    <div className="tw-box">
      <button className="tw-close" onClick={onClose}>✕</button>
      <div className="tw-title">📋 Attendance Tracker</div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <input className="form-inp" placeholder="Subject" value={sub} onChange={e=>setSub(e.target.value)} style={{flex:1,minWidth:130}} />
        <input className="form-inp" type="number" placeholder="Total" value={tot} onChange={e=>setTot(e.target.value)} style={{width:90}} />
        <input className="form-inp" type="number" placeholder="Attended" value={att} onChange={e=>setAtt(e.target.value)} style={{width:100}} />
        <button className="btn-lime btn-sm" onClick={add}><i className="fa-solid fa-plus"/></button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
        {list.map(a=>{
          const pct=Math.round((a.attended/a.total)*100);
          const color=pct>=75?"var(--lime)":pct>=60?"var(--amber)":"var(--coral)";
          const need=Math.ceil((0.75*a.total-a.attended)/(1-0.75));
          return(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,background:"var(--surface)",borderRadius:8,padding:"10px 14px"}}>
              <div style={{minWidth:100}}><div style={{fontWeight:600,fontSize:"0.88rem"}}>{a.sub}</div><div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{a.attended}/{a.total}</div></div>
              <div style={{flex:1,height:6,background:"var(--border)",borderRadius:3}}><div style={{height:6,borderRadius:3,background:color,width:`${Math.min(pct,100)}%`,transition:"width 0.5s"}}/></div>
              <div style={{fontWeight:700,color,minWidth:40}}>{pct}%</div>
              <div style={{fontSize:"0.75rem",color:"var(--muted)",minWidth:90}}>{pct>=75?"✅ Safe":need>0?`⚠️ Need ${need} more`:"❌ At risk"}</div>
              <button style={{background:"rgba(255,107,107,0.1)",color:"var(--coral)",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer"}} onClick={()=>del(a.id)}>✕</button>
            </div>
          );
        })}
      </div>
      <div style={{padding:"10px 14px",background:"var(--surface)",borderRadius:8,fontSize:"0.83rem",color:"var(--muted)"}}>⚠️ <strong style={{color:"var(--amber)"}}>75%</strong> is the minimum required in most universities.</div>
    </div>
  );
}

// ── Percentage ─────────────────────────────────────────────
function PercentageTool({ onClose }) {
  const [marks, setMarks] = useState(""); const [total, setTotal] = useState(""); const [res, setRes] = useState(null);
  const [req, setReq] = useState(""); const [max, setMax] = useState(""); const [reqRes, setReqRes] = useState("");
  return (
    <div className="tw-box">
      <button className="tw-close" onClick={onClose}>✕</button>
      <div className="tw-title">📊 Percentage Calculator</div>
      <div style={{marginBottom:10}}><label className="inp-label">Marks Obtained</label><input className="form-inp" type="number" value={marks} onChange={e=>setMarks(e.target.value)} placeholder="e.g. 450" style={{width:"100%"}}/></div>
      <div style={{marginBottom:14}}><label className="inp-label">Total Marks</label><input className="form-inp" type="number" value={total} onChange={e=>setTotal(e.target.value)} placeholder="e.g. 600" style={{width:"100%"}}/></div>
      <button className="btn-lime" style={{width:"100%"}} onClick={()=>{if(total)setRes(((+marks/+total)*100).toFixed(2))}}>Calculate Percentage</button>
      {res && <div className="pct-result">{res}%<div style={{fontSize:"0.85rem",color:"var(--muted)",marginTop:4}}>{marks} out of {total}</div></div>}
      <div style={{borderTop:"1px solid var(--border)",marginTop:16,paddingTop:14}}>
        <p style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:10,fontWeight:600}}>Find required marks to pass:</p>
        <div style={{display:"flex",gap:8,marginBottom:8}}><input className="form-inp" type="number" placeholder="Required %" value={req} onChange={e=>setReq(e.target.value)} /><input className="form-inp" type="number" placeholder="Max marks" value={max} onChange={e=>setMax(e.target.value)} /></div>
        <button className="btn-ghost btn-sm" onClick={()=>{if(max)setReqRes(`You need at least ${Math.ceil((+req/100)*+max)} marks out of ${max} to get ${req}%`)}}>Find Minimum Marks</button>
        {reqRes && <div style={{marginTop:10,fontSize:"0.88rem",color:"var(--cyan)"}}>{reqRes}</div>}
      </div>
    </div>
  );
}

// ── Grade System ───────────────────────────────────────────
function GradeSystemTool({ onClose }) {
  const [cgpa, setCgpa] = useState(""); const [conv, setConv] = useState("");
  const grades = [["O","10","≥ 90%","Outstanding","var(--lime)"],["A+","9","80–89%","Excellent","var(--lime)"],["A","8","70–79%","Very Good","var(--cyan)"],["B+","7","60–69%","Good","var(--cyan)"],["B","6","50–59%","Above Avg","var(--amber)"],["C","5","45–49%","Average","var(--amber)"],["F","0","< 45%","Fail","var(--coral)"]];
  return (
    <div className="tw-box">
      <button className="tw-close" onClick={onClose}>✕</button>
      <div className="tw-title">🏆 Grade System Reference</div>
      {grades.map(([g,p,r,rem,c])=>(
        <div key={g} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:"0.88rem"}}>
          <span style={{fontWeight:700,color:c,minWidth:30}}>{g}</span><span>{p}</span><span>{r}</span><span style={{color:"var(--muted)"}}>{rem}</span>
        </div>
      ))}
      <div style={{background:"var(--surface)",borderRadius:8,padding:12,marginTop:12}}>
        <p style={{fontSize:"0.82rem",color:"var(--muted)"}}>CGPA to %: <code style={{color:"var(--lime)"}}>(CGPA − 0.5) × 10</code></p>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <input className="form-inp" type="number" placeholder="Enter CGPA" value={cgpa} onChange={e=>setCgpa(e.target.value)} step="0.01" min={0} max={10} />
          <button className="btn-lime btn-sm" onClick={()=>{ if(cgpa)setConv(`${cgpa} CGPA ≈ ${((+cgpa-0.5)*10).toFixed(1)}%`); }}>Convert</button>
        </div>
        {conv && <div style={{marginTop:8,fontSize:"0.88rem",color:"var(--cyan)"}}>{conv}</div>}
      </div>
    </div>
  );
}

// ── Exam Countdown ─────────────────────────────────────────
function ExamCountdownTool({ onClose }) {
  const [name, setName] = useState(""); const [date, setDate] = useState("");
  const [exams, setExams] = useState(()=>{try{return JSON.parse(localStorage.getItem("kb_exams")||"[]")}catch{return[]}});
  const save = (e) => { setExams(e); localStorage.setItem("kb_exams",JSON.stringify(e)); };
  const add = () => { if(!name||!date) return; save([...exams,{id:Date.now(),name,date}]); setName(""); setDate(""); };
  const del = (id) => save(exams.filter(e=>e.id!==id));
  const today = new Date(); today.setHours(0,0,0,0);
  return (
    <div className="tw-box">
      <button className="tw-close" onClick={onClose}>✕</button>
      <div className="tw-title">📅 Exam Countdown</div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <input className="form-inp" placeholder="Exam name" value={name} onChange={e=>setName(e.target.value)} style={{flex:1,minWidth:140}} />
        <input className="form-inp" type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:160}} />
        <button className="btn-lime btn-sm" onClick={add}><i className="fa-solid fa-plus"/></button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {exams.length===0 ? <p style={{textAlign:"center",color:"var(--muted)",fontSize:"0.88rem"}}>No exams added yet!</p> :
          [...exams].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(ex=>{
            const d=new Date(ex.date); const diff=Math.ceil((d-today)/(864e5));
            const color=diff<=3?"var(--coral)":diff<=7?"var(--amber)":"var(--lime)";
            const label=diff<0?"Passed":diff===0?"TODAY!":diff+" days left";
            return(
              <div key={ex.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"var(--surface)",borderRadius:8}}>
                <span style={{fontSize:"1.3rem"}}>📝</span>
                <div style={{flex:1}}><div style={{fontWeight:600}}>{ex.name}</div><div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{new Date(ex.date).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div></div>
                <span style={{fontWeight:700,color,fontSize:"0.9rem"}}>{label}</span>
                <button style={{background:"rgba(255,107,107,0.1)",color:"var(--coral)",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer"}} onClick={()=>del(ex.id)}>✕</button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// ── TOOLS MAIN ─────────────────────────────────────────────
const TOOLS = [
  { id:"cgpa", emoji:"🎓", name:"CGPA Calculator", desc:"Calculate semester & cumulative GPA instantly" },
  { id:"pomodoro", emoji:"⏱️", name:"Pomodoro Timer", desc:"Focus sessions with work/break intervals" },
  { id:"attendance", emoji:"📋", name:"Attendance Tracker", desc:"Track subject-wise attendance & get alerts" },
  { id:"percentage", emoji:"📊", name:"Percentage Calc", desc:"Convert marks to percentage, find required scores" },
  { id:"grade", emoji:"🏆", name:"Grade System Guide", desc:"University grading scales & grade point reference" },
  { id:"countdown", emoji:"📅", name:"Exam Countdown", desc:"Add your exam dates & track days remaining" },
];

export default function ToolsSection() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p className="section-desc">Working tools built for students — no setup needed.</p>
      <div className="tools-grid">
        {TOOLS.map((t) => (
          <div key={t.id} className="tool-card" onClick={() => setOpen(t.id)}>
            <div className="tool-ic">{t.emoji}</div>
            <div className="tool-name">{t.name}</div>
            <div className="tool-desc">{t.desc}</div>
            <div className="tool-badge"><i className="fa-solid fa-circle" style={{ fontSize: 6 }} /> Working</div>
          </div>
        ))}
      </div>

      {open && (
        <div className="tool-widget-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          {open === "cgpa" && <CGPATool onClose={() => setOpen(null)} />}
          {open === "pomodoro" && <PomodoroTool onClose={() => setOpen(null)} />}
          {open === "attendance" && <AttendanceTool onClose={() => setOpen(null)} />}
          {open === "percentage" && <PercentageTool onClose={() => setOpen(null)} />}
          {open === "grade" && <GradeSystemTool onClose={() => setOpen(null)} />}
          {open === "countdown" && <ExamCountdownTool onClose={() => setOpen(null)} />}
        </div>
      )}
    </div>
  );
}
