import { auth } from "../firebase/config";
const API_BASE = "/api";

export function getDeviceId() {
  return localStorage.getItem("deviceId");
}
export function getOriginalHomeId() {
  return localStorage.getItem("originalHomeId");
}
export function getUpdateHomeId() {
  return localStorage.getItem("updateHomeId");
}

async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function getRelays() {
  const deviceId = getDeviceId();
  const originalHomeId = getOriginalHomeId();
  if (!deviceId || !originalHomeId) throw new Error("Missing deviceId or originalHomeId");
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/relays/${deviceId}?originalHomeId=${originalHomeId}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch relays");
  return res.json();
}

export async function getStates() {
  const deviceId = getDeviceId();
  const updateHomeId = getUpdateHomeId();
  if (!deviceId || !updateHomeId) throw new Error("Missing deviceId or updateHomeId");
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/states/${deviceId}?updateHomeId=${updateHomeId}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch states");
  return res.json();
}

export async function sendControlCommand({ room, relay, command }) {
  const deviceId = getDeviceId();
  const updateHomeId = getUpdateHomeId();
  if (!deviceId || !updateHomeId) throw new Error("Missing deviceId or updateHomeId");
  const headers = { ...(await getAuthHeaders()), "Content-Type": "application/json" };
  const res = await fetch(`${API_BASE}/control`, {
    method: "POST",
    headers,
    body: JSON.stringify({ updateHomeId, deviceId, room, relay, command }),
  });
  if (!res.ok) throw new Error("Failed to send control command");
  return res.json();
}

export function connectWebSocket(onMessage) {
  const ws = new WebSocket('ws://localhost:5000/');
  ws.onopen = () => {
    console.log("WebSocket connected");
  };
  ws.onmessage = (event) => {
    if (onMessage) onMessage(JSON.parse(event.data));
  };
  ws.onerror = (err) => {
    console.error("WebSocket error", err);
  };
  ws.onclose = () => {
    console.log("WebSocket disconnected");
  };
  return ws;
} 