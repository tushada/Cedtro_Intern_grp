const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mqtt = require('mqtt');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mqttClient = mqtt.connect("mqtt://broker.emqx.io");
const topicCache = {};
const stateCache = {};

const wss = new WebSocket.Server({ noServer: true });

mqttClient.on("connect", () => {
    console.log("✅ Connected to MQTT broker");
    mqttClient.subscribe("home/+/+/+/+/control");
    mqttClient.subscribe("home/+/+/+/+/state");
});

mqttClient.on("message", (topic, message) => {
    const parts = topic.split("/");
    if (parts.length !== 6) return;

    const [, homeId, deviceId, room, relay, type] = parts;
    const key = `${homeId}_${deviceId}`;

    if (type === "control") {
        if (!topicCache[key]) topicCache[key] = [];
        const exists = topicCache[key].some(item => item.room === room && item.relay === relay);
        if (!exists) {
            topicCache[key].push({ room, relay });
        }
    }

    if (type === "state") {
        const stateKey = `${homeId}_${deviceId}_${room}_${relay}`;
        stateCache[stateKey] = message.toString();

        const payload = {
            deviceId,
            homeId,
            room,
            relay,
            value: message.toString()
        };

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(payload));
            }
        });
    }
});

app.get("/relays/:deviceId", (req, res) => {
    const originalHomeId = req.query.originalHomeId;
    const key = `${originalHomeId}_${req.params.deviceId}`;
    res.json(topicCache[key] || []);
});

app.post("/control", (req, res) => {
    const { deviceId, updateHomeId, room, relay, command } = req.body;
    const topic = `home/${updateHomeId}/${deviceId}/${room}/${relay}/control`;
    mqttClient.publish(topic, command, { qos: 1 }, err => {
        if (err) return res.status(500).json({ status: "MQTT publish failed" });
        res.json({ status: "OK", topic });
    });
});

app.get("/states/:deviceId", (req, res) => {
    const homeId = req.query.updateHomeId;
    const deviceId = req.params.deviceId;
    const result = {};

    Object.keys(stateCache).forEach(key => {
        if (key.startsWith(`${homeId}_${deviceId}_`)) {
            const shortKey = key.split(`${homeId}_${deviceId}_`)[1];
            result[shortKey] = stateCache[key];
        }
    });

    res.json(result);
});

app.post("/data", (req, res) => {
    console.log("📥 Received data from app:", req.body);
    res.send("Received");
});

const server = app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});

server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
    });
});

wss.on("connection", (ws) => {
    console.log("🔌 WebSocket client connected");
    ws.send(JSON.stringify({ event: 'connected' }));
});
