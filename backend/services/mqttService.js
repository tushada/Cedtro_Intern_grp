const mqtt = require("mqtt");
const WebSocket = require("ws");

const mqttClient = mqtt.connect("mqtt://broker.emqx.io:1883");

console.log("Attempting to connect to MQTT...");
mqttClient.on("error", (err) => {
    console.error("MQTT connection error:", err);
});

const topicCache = {};
const stateCache = {};

function initializeMQTT(wss) {
    mqttClient.on("connect", () => {
        console.log("✅ MQTT connected");
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
                console.log(`Discovered relay: ${room}/${relay} under ${key}`);
            }
        }

        if (type === "state") {
            const stateKey = `${homeId}_${deviceId}_${room}_${relay}`;
            stateCache[stateKey] = message.toString();

            const payload = { topic, value: message.toString(), room, relay, homeId, deviceId, type };
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(payload));
                }
            });
        }
    });
}

function publishCommand(homeId, deviceId, room, relay, command) {
    const topic = `home/${homeId}/${deviceId}/${room}/${relay}/control`;
    mqttClient.publish(topic, command);
    return topic;
}

function getRelays(homeId, deviceId) {
    const key = `${homeId}_${deviceId}`;
    return topicCache[key] || [];
}

function getStates(homeId, deviceId) {
    const result = {};
    Object.keys(stateCache).forEach(key => {
        if (key.startsWith(`${homeId}_${deviceId}_`)) {
            const shortKey = key.split(`${homeId}_${deviceId}_`)[1];
            result[shortKey] = stateCache[key];
        }
    });
    return result;
}

module.exports = { initializeMQTT, publishCommand, getRelays, getStates }; 