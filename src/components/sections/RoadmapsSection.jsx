import React, { useState } from "react";

const ROADMAPS = [
  { id:"fe", cat:"frontend", icon:"🎨", accent:"#00e5cc", badge:"🔥 Hot", title:"Frontend Developer", desc:"Build beautiful, interactive web UIs using modern frameworks and tools.", tags:["HTML/CSS","JavaScript","React","TypeScript"], steps:[
    {t:"HTML & CSS Fundamentals",desc:"Master the building blocks of the web.",topics:["HTML5 Semantic","CSS3","Flexbox","Grid","Responsive Design"]},
    {t:"JavaScript Essentials",desc:"Core programming and DOM manipulation.",topics:["ES6+","DOM API","Events","Fetch API","Promises"]},
    {t:"Version Control (Git)",desc:"Track code changes professionally.",topics:["Git Basics","GitHub","Branching","Pull Requests"]},
    {t:"React.js",desc:"The most popular UI library.",topics:["Components","Hooks","State","Router","Context API"]},
    {t:"TypeScript",desc:"Add type safety to JavaScript.",topics:["Types","Interfaces","Generics","Enums"]},
    {t:"State Management",desc:"Manage complex application state.",topics:["Redux Toolkit","Zustand","React Query"]},
    {t:"Build Tools & Testing",desc:"Package and test your apps.",topics:["Vite","Jest","Testing Library"]},
    {t:"Deploy & Portfolio",desc:"Launch projects and land your first job.",topics:["Vercel","Netlify","Portfolio Building"]},
  ]},
  { id:"be", cat:"backend", icon:"⚙️", accent:"#7c6aff", badge:"🔥 Hot", title:"Backend Developer", desc:"Design server-side logic, APIs, and databases that power apps.", tags:["Node.js","Python","REST APIs","SQL"], steps:[
    {t:"Programming Fundamentals",desc:"Strong foundation in a language.",topics:["Python or Node.js","OOP","Data Structures","Algorithms"]},
    {t:"Web Servers & HTTP",desc:"Understand how the web works.",topics:["HTTP/HTTPS","REST Principles","Status Codes"]},
    {t:"Databases (SQL)",desc:"Store and query structured data.",topics:["MySQL/PostgreSQL","SQL Queries","Joins","Indexing"]},
    {t:"NoSQL Databases",desc:"Handle flexible data.",topics:["MongoDB","Redis","Cassandra"]},
    {t:"API Development",desc:"Build RESTful and GraphQL APIs.",topics:["Express.js","FastAPI","GraphQL","Postman"]},
    {t:"Authentication & Security",desc:"Secure your applications.",topics:["JWT","OAuth 2.0","bcrypt","HTTPS"]},
    {t:"Deployment",desc:"Ship your backend to production.",topics:["Linux","Nginx","Docker","CI/CD"]},
  ]},
  { id:"cloud", cat:"cloud", icon:"☁️", accent:"#ffb547", badge:"✨ New", title:"Cloud / DevOps Engineer", desc:"Deploy and manage scalable infrastructure on AWS, Azure, or GCP.", tags:["AWS","Docker","Kubernetes","Terraform"], steps:[
    {t:"Linux & Networking",desc:"Foundation of server management.",topics:["Linux Commands","Shell Scripting","TCP/IP","SSH"]},
    {t:"Docker & Containers",desc:"Package apps portably.",topics:["Docker CLI","Dockerfile","Docker Compose"]},
    {t:"CI/CD Pipelines",desc:"Automate build, test, deploy.",topics:["GitHub Actions","Jenkins","GitLab CI"]},
    {t:"Cloud Provider (AWS)",desc:"Master at least one cloud platform.",topics:["EC2","S3","RDS","Lambda","IAM"]},
    {t:"Kubernetes (K8s)",desc:"Orchestrate containers at scale.",topics:["Pods","Services","Deployments","Helm"]},
    {t:"Infrastructure as Code",desc:"Manage infra with code.",topics:["Terraform","Ansible","CloudFormation"]},
    {t:"Monitoring & Logging",desc:"Observe your systems.",topics:["Prometheus","Grafana","ELK Stack"]},
  ]},
  { id:"sec", cat:"security", icon:"🛡️", accent:"#ff6b6b", badge:"⭐ Popular", title:"Cyber Security Expert", desc:"Protect systems from threats. Master ethical hacking and defense.", tags:["Ethical Hacking","Networks","Cryptography","Kali Linux"], steps:[
    {t:"Networking Fundamentals",desc:"Understand how data flows.",topics:["OSI Model","TCP/IP","Firewalls","Wireshark"]},
    {t:"Linux & Command Line",desc:"Security tools run on Linux.",topics:["Linux Commands","Bash Scripting","Kali Linux"]},
    {t:"Web Security",desc:"Attack and defend web apps.",topics:["OWASP Top 10","SQL Injection","XSS","Burp Suite"]},
    {t:"Network Security",desc:"Secure and analyze traffic.",topics:["Nmap","Metasploit","VPNs","IDS/IPS"]},
    {t:"Cryptography",desc:"Encryption and hashing.",topics:["AES","RSA","Hashing","PKI"]},
    {t:"Digital Forensics",desc:"Investigate incidents.",topics:["Disk Forensics","Log Analysis","Autopsy"]},
    {t:"Certifications & CTFs",desc:"Validate skills.",topics:["CompTIA Security+","CEH","OSCP","HackTheBox"]},
  ]},
  { id:"data", cat:"data", icon:"📊", accent:"#c8f135", badge:"🔥 Hot", title:"Data Scientist", desc:"Extract insights using statistics, ML, and powerful visualizations.", tags:["Python","SQL","Machine Learning","Tableau"], steps:[
    {t:"Mathematics & Statistics",desc:"Backbone of data science.",topics:["Linear Algebra","Calculus","Probability","Statistics"]},
    {t:"Python for Data",desc:"Primary language of data science.",topics:["NumPy","Pandas","Matplotlib","Jupyter"]},
    {t:"SQL & Databases",desc:"Query and manage data.",topics:["SQL Queries","Joins","Window Functions"]},
    {t:"Machine Learning",desc:"Build predictive models.",topics:["Regression","Classification","Clustering","Scikit-learn"]},
    {t:"Deep Learning",desc:"Neural networks.",topics:["TensorFlow","PyTorch","CNNs","RNNs"]},
    {t:"MLOps & Deployment",desc:"Deploy ML to production.",topics:["Flask","MLflow","Docker","SageMaker"]},
  ]},
  { id:"ai", cat:"data", icon:"🤖", accent:"#00e5cc", badge:"✨ New", title:"AI / ML Engineer", desc:"Build production AI systems: LLMs, computer vision, and automation.", tags:["PyTorch","Transformers","LLMs","MLOps"], steps:[
    {t:"Programming & Math",desc:"Python mastery and math.",topics:["Python","Linear Algebra","NumPy","Probability"]},
    {t:"Classical ML",desc:"Traditional ML algorithms.",topics:["Regression","Trees","SVMs","Scikit-learn"]},
    {t:"Deep Learning",desc:"Neural network fundamentals.",topics:["PyTorch","CNNs","RNNs","Backpropagation"]},
    {t:"NLP & Transformers",desc:"Language models.",topics:["BERT","GPT","Hugging Face","Fine-tuning"]},
    {t:"Computer Vision",desc:"Teaching machines to see.",topics:["YOLO","GANs","OpenCV","Image Classification"]},
    {t:"LLMs & Generative AI",desc:"Build with large language models.",topics:["Prompt Engineering","RAG","LangChain","Vector DBs"]},
  ]},
  { id:"mobile", cat:"mobile", icon:"📱", accent:"#7c6aff", badge:"⭐ Popular", title:"Mobile App Developer", desc:"Build native and cross-platform apps for iOS and Android.", tags:["React Native","Flutter","Dart","App Store"], steps:[
    {t:"Programming Fundamentals",desc:"Core coding skills.",topics:["JavaScript or Dart","OOP","Git"]},
    {t:"React Native Basics",desc:"Cross-platform with JS.",topics:["Components","Navigation","Expo","StyleSheet"]},
    {t:"State & Data Management",desc:"Manage app data.",topics:["useState","Redux","AsyncStorage"]},
    {t:"Native APIs",desc:"Access device hardware.",topics:["Camera","Location","Push Notifications","Bluetooth"]},
    {t:"Backend Integration",desc:"Connect to servers.",topics:["REST APIs","Firebase","GraphQL"]},
    {t:"Publishing",desc:"Launch your app.",topics:["App Store (iOS)","Google Play","App Signing","ASO"]},
  ]},
  { id:"fs", cat:"backend", icon:"💻", accent:"#c8f135", badge:"🔥 Hot", title:"Full Stack Developer", desc:"Master both frontend and backend — the most in-demand role.", tags:["MERN Stack","SQL","REST API","Deployment"], steps:[
    {t:"HTML, CSS & JavaScript",desc:"Core web technologies.",topics:["HTML5","CSS3","ES6+","DOM","Responsive Design"]},
    {t:"React.js Frontend",desc:"Build modern UIs.",topics:["React","Hooks","Router","TypeScript"]},
    {t:"Node.js & Express",desc:"Server-side JavaScript.",topics:["Node.js","Express","Middleware","npm"]},
    {t:"MongoDB & Mongoose",desc:"NoSQL database.",topics:["CRUD","Schema Design","Aggregation"]},
    {t:"Authentication",desc:"Secure your app.",topics:["JWT","Sessions","OAuth","NextAuth"]},
    {t:"Next.js",desc:"Full stack React framework.",topics:["App Router","SSR","SSG","API Routes"]},
    {t:"Deployment",desc:"Ship to production.",topics:["Vercel","Railway","AWS","Nginx"]},
  ]},
  { id:"uxui", cat:"frontend", icon:"🖌️", accent:"#ec4899", badge:"✨ New", title:"UI/UX Designer", desc:"Design intuitive, beautiful user experiences that delight users.", tags:["Figma","User Research","Prototyping","Design Systems"], steps:[
    {t:"Design Foundations",desc:"Core visual design principles.",topics:["Typography","Color Theory","Layout","Gestalt"]},
    {t:"Figma Mastery",desc:"Industry-standard design tool.",topics:["Components","Auto Layout","Prototyping","Design Systems"]},
    {t:"User Research",desc:"Understand your users.",topics:["Interviews","Surveys","Persona Creation","Empathy Maps"]},
    {t:"Wireframing & Prototyping",desc:"Ideate and validate quickly.",topics:["Low-fi Wireframes","High-fi Mockups","Usability Testing"]},
    {t:"Portfolio & Career",desc:"Land your first design role.",topics:["Case Studies","Behance/Dribbble","Salary Negotiation"]},
  ]},
];

const CATS = [
  { id: "all", label: "All Roles" }, { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" }, { id: "cloud", label: "Cloud/DevOps" },
  { id: "security", label: "Security" }, { id: "data", label: "Data/AI" }, { id: "mobile", label: "Mobile" },
];

export default function RoadmapsSection() {
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(null);
  const filtered = cat === "all" ? ROADMAPS : ROADMAPS.filter((r) => r.cat === cat);
  const selected = open !== null ? ROADMAPS.find((r) => r.id === open) : null;

  return (
    <div>
      <div className="stats-row" style={{ marginBottom: 28 }}>
        <div className="stat-tile"><div className="stat-ic ic-lime"><i className="fa-solid fa-map" /></div><div><div className="stat-val">{ROADMAPS.length}</div><div className="stat-lbl">Career Roadmaps</div></div></div>
        <div className="stat-tile"><div className="stat-ic ic-cyan"><i className="fa-solid fa-code" /></div><div><div className="stat-val">9</div><div className="stat-lbl">IT Domains</div></div></div>
        <div className="stat-tile"><div className="stat-ic ic-violet"><i className="fa-solid fa-list-check" /></div><div><div className="stat-val">60+</div><div className="stat-lbl">Learning Steps</div></div></div>
      </div>

      <div className="tabs">
        {CATS.map((c) => (
          <div key={c.id} className={`tab-btn${cat === c.id ? " active" : ""}`} onClick={() => setCat(c.id)}>
            <span className="tab-dot" /> {c.label}
          </div>
        ))}
      </div>

      <div className="roadmap-grid">
        {filtered.map((r) => (
          <div key={r.id} className="rm-card" style={{ "--card-accent": r.accent }} onClick={() => setOpen(r.id)}>
            <div className="rm-head">
              <div className="rm-icon" style={{ background: r.accent + "22", fontSize: "1.6rem" }}>{r.icon}</div>
              <span className="rm-badge">{r.badge}</span>
            </div>
            <h3>{r.title}</h3><p>{r.desc}</p>
            <div className="rm-tags">{r.tags.map((t) => <span key={t} className="rm-tag">{t}</span>)}</div>
            <div className="rm-footer">
              <span className="rm-steps"><i className="fa-solid fa-list-check" style={{ color: r.accent }} /> {r.steps.length} steps</span>
              <span className="rm-cta">View Path <i className="fa-solid fa-arrow-right" /></span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{selected.icon}</div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800 }}>{selected.title}</h2>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 6 }}>{selected.desc}</p>
              </div>
              <button className="modal-close" onClick={() => setOpen(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Learning Roadmap</p>
              <div className="rm-timeline">
                {selected.steps.map((s, i) => (
                  <div key={i} className="rm-step">
                    <div className="rm-step-dot">{i + 1}</div>
                    <div>
                      <div className="rm-step-title">{s.t}</div>
                      <div className="rm-step-desc">{s.desc}</div>
                      <div className="rm-step-topics">{s.topics.map((tp) => <span key={tp} className="rm-topic">{tp}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
