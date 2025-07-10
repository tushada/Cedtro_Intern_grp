import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const API_URL = "https://713e555cdc8d.ngrok-free.app/data";
const NODE_RED_URL = "https://webmaster-writers-context-capabilities.trycloudflare.com/data";

function Login() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!input || !password) {
      setError("Please enter both fields");
      setLoading(false);
      return;
    }

    let found = false;
    try {
      // Query Firestore for users with matching password
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("password", "==", password));
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        const user = doc.data();
        const { username, email, phoneNumber, deviceId, originalHomeId, updateHomeId } = user;
        if (input === username || input === email || input === phoneNumber) {
          if (!deviceId || deviceId.length === 0) {
            setError("No device associated");
            setLoading(false);
            return;
          }
          // Save to localStorage (like SharedPreferences)
          localStorage.setItem("username", username);
          localStorage.setItem("deviceId", deviceId[0]);
          localStorage.setItem("originalHomeId", originalHomeId);
          localStorage.setItem("updateHomeId", updateHomeId);
          // Notify backend (same as your Java code)
          notifyBackend(deviceId[0], originalHomeId, updateHomeId);
          // Redirect to dashboard
          window.location.href = "/dashboard";
          found = true;
          break;
        }
      }
      if (!found) {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
    setLoading(false);
  }

  function notifyBackend(deviceId, originalHomeId, updateHomeId) {
    const json = JSON.stringify({ deviceId, originalHomeId, updateHomeId });
    // First backend
    fetch(`${API_URL}/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });
    // Second backend (Node-RED)
    fetch(NODE_RED_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 300, margin: "auto" }}>
      <input
        type="text"
        id="login_input"
        placeholder="Username, Email, or Phone"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        id="login_password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <button type="submit" id="login_button" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div id="error" style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </form>
  );
}

export default Login;
