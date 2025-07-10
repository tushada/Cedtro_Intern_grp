const express = require("express");
const router = express.Router();
const { publishCommand, getRelays, getStates } = require("../services/mqttService");
const authMiddleware = require("../middleware/auth");
const { getUserHomeId } = require("../utils/firestoreHelpers");

// Protect all routes
router.use(authMiddleware);

router.get("/relays/:deviceId", async (req, res) => {
    const homeId = req.query.originalHomeId;
    const userHomeId = await getUserHomeId(req.user.uid);
    if (homeId !== userHomeId) return res.status(403).json({ error: "Forbidden: Not your home" });
    const relays = getRelays(homeId, req.params.deviceId);
    res.json(relays);
});

router.get("/states/:deviceId", async (req, res) => {
    const homeId = req.query.updateHomeId;
    const userHomeId = await getUserHomeId(req.user.uid);
    if (homeId !== userHomeId) return res.status(403).json({ error: "Forbidden: Not your home" });
    const states = getStates(homeId, req.params.deviceId);
    res.json(states);
});

router.post("/control", async (req, res) => {
    const { updateHomeId, deviceId, room, relay, command } = req.body;
    const userHomeId = await getUserHomeId(req.user.uid);
    if (updateHomeId !== userHomeId) return res.status(403).json({ error: "Forbidden: Not your home" });
    const topic = publishCommand(updateHomeId, deviceId, room, relay, command);
    console.log(`Published ${command} to ${topic}`);
    res.json({ status: "OK", topic });
});

module.exports = router; 