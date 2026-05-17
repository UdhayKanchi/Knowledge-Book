import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, ADMIN_EMAIL } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        try {
          const userRef = doc(db, "users", u.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            const emailPrefix = u.email ? u.email.split("@")[0] : "";
            const derivedName = emailPrefix 
              ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1) 
              : "Student User";
            
            await setDoc(userRef, {
              uid: u.uid,
              name: u.displayName || derivedName,
              email: u.email,
              role: u.email === ADMIN_EMAIL ? "admin" : "student",
              joinDate: new Date().toLocaleDateString(),
            });
            console.log("Self-healing synced user record for:", u.email);
          }
        } catch (err) {
          console.error("Self-healing Firestore check failed:", err);
        }
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
