import React, { useState } from "react";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db, ADMIN_EMAIL } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const saveUser = async (user, name) => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid, name: name || user.displayName || "User",
        email: user.email,
        role: user.email === ADMIN_EMAIL ? "admin" : "student",
        joinDate: new Date().toLocaleDateString(),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const { user } = await signInWithEmailAndPassword(auth, form.email, form.password);
        await saveUser(user, user.displayName);
      } else {
        if (!form.name.trim()) { setError("Name is required."); setLoading(false); return; }
        if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
        const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await saveUser(user, form.name);
      }
      navigate("/home");
    } catch (err) {
      const msgs = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/email-already-in-use": "Email already registered. Try signing in.",
        "auth/weak-password": "Password is too weak.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
      };
      setError(msgs[err.code] || err.message);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await saveUser(user, user.displayName);
      navigate("/home");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setError("Google Sign-In failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="blob blob-1" /><div className="blob blob-2" />
      <div className="auth-card">
        <div className="auth-logo">
          <i className="fa-solid fa-book-open-reader" />
          <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <p>{mode === "login" ? "Sign in to continue your journey" : "Join Knowledge Book for free"}</p>
        </div>

        {error && <div className="auth-error"><i className="fa-solid fa-circle-exclamation" /> {error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="form-field">
              <label>Full Name</label>
              <div className="field-wrap"><i className="fa-regular fa-user" />
                <input type="text" placeholder="Your full name" value={form.name} onChange={set("name")} required />
              </div>
            </div>
          )}
          <div className="form-field">
            <label>Email Address</label>
            <div className="field-wrap"><i className="fa-regular fa-envelope" />
              <input type="email" placeholder="name@example.com" value={form.email} onChange={set("email")} required />
            </div>
          </div>
          <div className="form-field">
            <label>Password</label>
            <div className="field-wrap"><i className="fa-solid fa-lock" />
              <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spin-sm" /> : null}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <button className="btn-google" onClick={handleGoogle} disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width={20} />
          Continue with Google
        </button>

        <p className="switch-text">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          {" "}<span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Create Account" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}
