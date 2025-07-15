import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { styled } from '@mui/material/styles';

const backendUrl = "https://app-web-backend-5dd0.onrender.com";
const wsUrl = "wss://app-web-backend-5dd0.onrender.com";

const SmartHomeSwitch = styled(Switch)(({ theme }) => ({
  width: 56,
  height: 32,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSwitch-switchBase': {
    padding: 4,
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    '&.Mui-checked': {
      transform: 'translateX(24px) scale(1.08)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        background: 'linear-gradient(90deg, #43ea4a 0%, #1de782 100%)',
        opacity: 1,
        boxShadow: '0 0 12px 2px #43ea4a',
      },
      '& .MuiSwitch-thumb': {
        background: '#fff',
        boxShadow: '0 0 12px 2px #43ea4a',
        '&:before': {
          content: '""',
          display: 'block',
          width: 18,
          height: 18,
          background: 'url("data:image/svg+xml;utf8,<svg fill=\'%2343ea4a\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z\'/></svg>") center/contain no-repeat',
        },
      },
    },
    '&:not(.Mui-checked)': {
      transform: 'scale(1)',
      '& + .MuiSwitch-track': {
        background: 'linear-gradient(90deg, #e53935 0%, #ff1744 100%)',
        opacity: 1,
        boxShadow: '0 0 12px 2px #e53935',
      },
      '& .MuiSwitch-thumb': {
        background: '#fff',
        boxShadow: '0 0 12px 2px #e53935',
        '&:before': {
          content: '""',
          display: 'block',
          width: 18,
          height: 18,
          background: 'url("data:image/svg+xml;utf8,<svg fill=\'%23e53935\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\'/></svg>") center/contain no-repeat',
        },
      },
    },
  },
  '& .MuiSwitch-thumb': {
    background: '#fff',
    width: 24,
    height: 24,
    boxShadow: '0 2px 8px rgba(33,203,243,0.15)',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 20,
    background: 'linear-gradient(90deg, #e53935 0%, #ff1744 100%)',
    opacity: 1,
    transition: 'background 0.3s, box-shadow 0.3s',
    boxShadow: '0 0 0 0 #e53935',
  },
  '& .Mui-focusVisible .MuiSwitch-thumb': {
    outline: '2px solid #43ea4a',
    outlineOffset: 2,
  },
}));

const Home = () => {
  const deviceId = localStorage.getItem("deviceId");
  const updateHomeId = localStorage.getItem("updateHomeId");
  const originalHomeId = localStorage.getItem("originalHomeId");
  const username = localStorage.getItem("username") || "User";

  const [relays, setRelays] = useState({});
  const switchRefs = useRef({});
  const userInitiatedMap = useRef({});
  const latestRelayStates = useRef({});
  const webSocketRef = useRef(null);

  const fetchRelayData = async () => {
    try {
      const relaysRes = await fetch(`${backendUrl}/relays/${deviceId}?originalHomeId=${originalHomeId}`);
      const relaysArray = await relaysRes.json();

      const statesRes = await fetch(`${backendUrl}/states/${deviceId}`);
      const statesMap = await statesRes.json();

      const roomMap = {};
      relaysArray.forEach(({ room = "Relays", relay }) => {
        const state = statesMap[relay] || "OFF";
        latestRelayStates.current[relay] = state; // Store current state globally
        if (!roomMap[room]) roomMap[room] = [];
        roomMap[room].push({
          relay,
          status: state === "ON",
        });
      });

      setRelays(roomMap);
    } catch (err) {
      console.error("Error fetching relays or states:", err);
    }
  };

  const sendCommand = async (relay, command) => {
    try {
      await fetch(`${backendUrl}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          updateHomeId,
          relay,
          command,
        }),
      });
    } catch (err) {
      console.error("Error sending command:", err);
    }
  };

  const handleSwitchChange = (relay, room, checked) => {
    const key = `${room}_${relay}`;
    if (userInitiatedMap.current[key]) {
      sendCommand(relay, checked ? "ON" : "OFF");
      userInitiatedMap.current[key] = false;
    }
  };

  const updateSwitchState = (relayName, value) => {
    latestRelayStates.current[relayName] = value; // Always track state globally

    const isOn = value === "ON";
    
    setRelays((prev) => {
      const updated = { ...prev };
      for (const room in updated) {
        const index = updated[room].findIndex((r) => r.relay === relayName);
        if (index !== -1) {
          updated[room][index].status = isOn;
        }
      }
      return updated;
    });

    // Update switch ref if it exists and user didn't initiate the change
    for (const room in relays) {
      const key = `${room}_${relayName}`;
      if (switchRefs.current[key] && !userInitiatedMap.current[key]) {
        switchRefs.current[key].checked = isOn;
      }
    }
  };

  const connectWebSocket = () => {
    try {
      const socket = new WebSocket(wsUrl);
      webSocketRef.current = socket;

      socket.onopen = () => console.log("✅ WebSocket connected");

      socket.onmessage = (msg) => {
        try {
          const json = JSON.parse(msg.data);
          if (json.type !== "state") return;
          if (json.deviceId !== deviceId) return;

          const { relay, value } = json;
          updateSwitchState(relay, value);
        } catch (err) {
          console.error("WebSocket message error:", err);
        }
      };

      socket.onerror = (err) => console.error("WebSocket error:", err);
      socket.onclose = () => {
        console.warn("WebSocket closed, attempting to reconnect...");
        setTimeout(() => {
          if (webSocketRef.current) {
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      console.error("WebSocket connection failed:", err);
    }
  };

  useEffect(() => {
    fetchRelayData();
    connectWebSocket();
    
    // Cleanup function
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentDate = new Date().toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Box p={3} bgcolor="#121212" minHeight="100vh" color="white">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#1E1E1E"
        p={2}
        borderRadius={3}
        boxShadow="0 2px 12px rgba(0,0,0,0.3)"
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">Welcome, {username}!</Typography>
          <Typography variant="body2" color="gray">
            {currentDate}
          </Typography>
        </Box>
        <Button onClick={fetchRelayData} variant="contained" color="primary">
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} mt={2}>
        {Object.entries(relays).map(([roomName, items]) => (
          <Grid item xs={12} md={6} key={roomName}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(to right, #1E1E1E, #2A2A2A)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                transition: "transform 0.3s",
                '&:hover': {
                  transform: "scale(1.02)"
                }
              }}
              elevation={5}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#90caf9" }}>
                {roomName}
              </Typography>
              <Divider sx={{ mb: 2, background: "#444" }} />

              {items.map(({ relay, status }) => {
                const key = `${roomName}_${relay}`;
                return (
                  <Box
                    key={key}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    my={1.5}
                    px={2}
                    py={1}
                    borderRadius={2}
                    sx={{
                      backgroundColor: status ? "#1e88e5" : "#424242",
                      color: "white",
                      boxShadow: status
                        ? "0 0 10px #1e88e5"
                        : "inset 0 0 4px rgba(255,255,255,0.1)"
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      {relay}
                    </Typography>
                    <SmartHomeSwitch
                      checked={status}
                      inputRef={(el) => (switchRefs.current[key] = el)}
                      onMouseDown={() => (userInitiatedMap.current[key] = true)}
                      onChange={(e) =>
                        handleSwitchChange(relay, roomName, e.target.checked)
                      }
                      aria-label={`Toggle ${relay}`}
                    />
                  </Box>
                );
              })}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
