import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import styled from "@mui/material/styles/styled";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import DevicesIcon from "@mui/icons-material/Devices";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const StyledSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: theme.palette.error.main,
    "&.Mui-checked": {
      color: theme.palette.success.main,
      "&:hover": {
        boxShadow: "0 0 0 8px rgba(0, 255, 0, 0.2)",
      },
    },
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(255, 0, 0, 0.2)",
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: theme.palette.error.main,
    opacity: 0.3,
    "&.Mui-checked": {
      backgroundColor: theme.palette.success.main,
      opacity: 0.3,
      "&:hover": {
        boxShadow: "0 0 0 8px rgba(0, 255, 0, 0.2)",
      },
    },
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(255, 0, 0, 0.2)",
    },
  },
  "& .MuiSwitch-thumb": {
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background:
    theme.palette.mode === "dark"
      ? "rgba(26, 26, 26, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  textTransform: "none",
  fontWeight: "bold",
  padding: "10px 24px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 1),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4, 3),
    minWidth: 180,
    maxWidth: 260,
    borderRadius: 28,
  },
  borderRadius: 18,
  textAlign: "left",
  minWidth: 90,
  maxWidth: 140,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background:
    theme.palette.mode === "dark"
      ? "rgba(26, 26, 26, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  textTransform: "none",
  fontWeight: 700,
  fontSize: "1.1rem",
  padding: "12px 28px",
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  color: "#fff",
  boxShadow: "0 4px 16px rgba(33, 150, 243, 0.15)",
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  transition: "all 0.2s",
  "&:hover": {
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    boxShadow: "0 8px 24px rgba(33, 150, 243, 0.25)",
    transform: "translateY(-2px) scale(1.03)",
  },
}));

const Home = ({ roomsData = {}, setRoomsData }) => {
  const [addRoomDialogOpen, setAddRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showStats, setShowStats] = useState(true);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [selectedRoomForDevice, setSelectedRoomForDevice] = useState("");
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterRoom, setFilterRoom] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle adding a new device
  const handleAddDevice = () => {
    if (newDeviceName.trim() && selectedRoomForDevice) {
      setRoomsData((prev) => {
        const updatedRooms = { ...prev };
        const updatedDevices = [...updatedRooms[selectedRoomForDevice].devices];
        updatedDevices.push({
          name: newDeviceName.trim(),
          status: false,
        });
        updatedRooms[selectedRoomForDevice] = {
          ...updatedRooms[selectedRoomForDevice],
          devices: updatedDevices,
        };
        return updatedRooms;
      });
      setAddDeviceDialogOpen(false);
      setNewDeviceName("");
      setSelectedRoomForDevice("");
    }
  };

  // Helper function to get last active time
  const getLastActiveTime = (status) => {
    const now = new Date();
    const minutes = status
      ? Math.floor(Math.random() * 60)
      : Math.floor(Math.random() * 1440);
    return new Date(now.getTime() - minutes * 60000).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  // Calculate statistics
  const totalRooms = Object.keys(roomsData).length;
  const totalDevices = Object.values(roomsData).reduce(
    (acc, room) => acc + (room.devices?.length || 0),
    0,
  );
  const devicesOn = Object.values(roomsData).reduce(
    (acc, room) =>
      acc + (room.devices?.filter((device) => device.status).length || 0),
    0,
  );
  const devicesOff = totalDevices - devicesOn;
  const powerConsumption = devicesOn * 0.1; // Assuming 0.1kWh per device per hour

  // Handle room selection
  const handleRoomSelect = (roomName) => {
    setSelectedRoom(roomName);
    setShowStats(false);
  };

  const handleAddNewRoom = () => {
    if (newRoomName.trim()) {
      setRoomsData((prev) => ({
        ...prev,
        [newRoomName.trim()]: {
          devices: [],
        },
      }));
      setNewRoomName("");
      setAddRoomDialogOpen(false);
    }
  };
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRoomName, setEditRoomName] = useState("");
  const [editDevices, setEditDevices] = useState([]);
  const [originalRoomName, setOriginalRoomName] = useState("");

  const handleDeviceToggle = (roomName, deviceIdx) => {
    setRoomsData((prevRooms) => {
      const updatedRooms = { ...prevRooms };
      const updatedDevices = [...updatedRooms[roomName].devices];
      updatedDevices[deviceIdx] = {
        ...updatedDevices[deviceIdx],
        status: !updatedDevices[deviceIdx].status,
      };
      updatedRooms[roomName] = {
        ...updatedRooms[roomName],
        devices: updatedDevices,
      };
      return updatedRooms;
    });
  };

  const handleEditRoom = (roomName) => {
    setEditRoomName(roomName);
    setOriginalRoomName(roomName);
    if (roomsData[roomName]?.devices) {
      setEditDevices(
        roomsData[roomName].devices.map((device) => ({ ...device })),
      );
    } else {
      setEditDevices([]);
    }
    setEditDialogOpen(true);
  };

  const handleDeviceNameChange = (idx, newName) => {
    setEditDevices((devs) =>
      devs.map((d, i) => (i === idx ? { ...d, name: newName } : d)),
    );
  };

  const handleEditAddDevice = () => {
    setEditDevices((devs) => [...devs, { name: "", status: false }]);
  };

  const handleRemoveDevice = (idx) => {
    setEditDevices((devs) => devs.filter((_, i) => i !== idx));
  };

  const handleSaveRoom = () => {
    setRoomsData((prevRooms) => {
      const updatedRooms = { ...prevRooms };
      // Remove old room name if changed
      if (editRoomName !== originalRoomName) {
        delete updatedRooms[originalRoomName];
      }
      updatedRooms[editRoomName] = { devices: editDevices };
      return updatedRooms;
    });
    setEditDialogOpen(false);
  };

  // Helper to get emoji/icon for device type
  const getDeviceEmoji = (name) => {
    const n = name.toLowerCase();
    if (n.includes("tv")) return "📺";
    if (n.includes("ac") || n.includes("air")) return "❄️";
    if (n.includes("light")) return "💡";
    if (n.includes("fan")) return "🌀";
    if (n.includes("water") || n.includes("heater")) return "🚿";
    if (n.includes("mirror")) return "🪞";
    if (n.includes("oven")) return "🔥";
    if (n.includes("dishwasher")) return "🍽️";
    if (n.includes("refrigerator")) return "❄️";
    return "��";
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Home Statistics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Home Overview
          </Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatCard>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  textAlign: "left",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.5rem",
                    lg: "1.7rem",
                  },
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "unset",
                  mb: { xs: 0.5, sm: 1, md: 2 },
                  lineHeight: 1.15,
                  minHeight: { xs: 24, sm: 28, md: 40, lg: 48 },
                }}
              >
                Total Rooms
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "2.8rem",
                    lg: "3.2rem",
                  },
                  textAlign: "center",
                  lineHeight: 1.1,
                  width: "100%",
                }}
              >
                {Object.keys(roomsData).length}
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatCard>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  textAlign: "left",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.5rem",
                    lg: "1.7rem",
                  },
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "unset",
                  mb: { xs: 0.5, sm: 1, md: 2 },
                  lineHeight: 1.15,
                  minHeight: { xs: 24, sm: 28, md: 40, lg: 48 },
                }}
              >
                Total Devices
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "2.8rem",
                    lg: "3.2rem",
                  },
                  textAlign: "center",
                  lineHeight: 1.1,
                  width: "100%",
                }}
              >
                {Object.values(roomsData).reduce(
                  (acc, room) => acc + (room.devices?.length || 0),
                  0,
                )}
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatCard>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  textAlign: "left",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.5rem",
                    lg: "1.7rem",
                  },
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "unset",
                  mb: { xs: 0.5, sm: 1, md: 2 },
                  lineHeight: 1.15,
                  minHeight: { xs: 24, sm: 28, md: 40, lg: 48 },
                }}
              >
                Devices ON
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "2.8rem",
                    lg: "3.2rem",
                  },
                  textAlign: "center",
                  lineHeight: 1.1,
                  width: "100%",
                }}
              >
                {Object.values(roomsData).reduce(
                  (acc, room) =>
                    acc +
                    (room.devices?.filter((device) => device.status).length ||
                      0),
                  0,
                )}
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <StatCard>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  textAlign: "left",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.5rem",
                    lg: "1.7rem",
                  },
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "unset",
                  mb: { xs: 0.5, sm: 1, md: 2 },
                  lineHeight: 1.15,
                  minHeight: { xs: 24, sm: 28, md: 40, lg: 48 },
                }}
              >
                Devices OFF
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "2.8rem",
                    lg: "3.2rem",
                  },
                  textAlign: "center",
                  lineHeight: 1.1,
                  width: "100%",
                }}
              >
                {Object.values(roomsData).reduce(
                  (acc, room) =>
                    acc +
                    (room.devices?.filter((device) => !device.status).length ||
                      0),
                  0,
                )}
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <ViewAllButton
          startIcon={<DevicesIcon sx={{ fontSize: 24 }} />}
          onClick={() => setViewAllOpen(true)}
          sx={{
            flex: "1 1 180px",
            minWidth: 140,
            maxWidth: 220,
            height: 44,
            fontSize: "1rem",
            fontWeight: 700,
            justifyContent: "center",
          }}
        >
          View All Devices
        </ViewAllButton>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddRoomDialogOpen(true)}
          sx={{
            flex: "1 1 180px",
            minWidth: 140,
            maxWidth: 220,
            height: 44,
            fontSize: "1rem",
            fontWeight: 700,
            justifyContent: "center",
          }}
        >
          Add Room
        </StyledButton>
      </Box>

      {/* Room List Section */}
      <Grid container spacing={3}>
        {Object.entries(roomsData).map(([roomName, roomData], index) => (
          <Grid item xs={12} sm={12} md={6} key={roomName}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isMobile ? (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    boxShadow: 2,
                    bgcolor: "background.paper",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      {roomName}
                    </Typography>
                    <StyledIconButton
                      onClick={() => handleEditRoom(roomName)}
                      size="medium"
                    >
                      <EditIcon />
                    </StyledIconButton>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      overflowX: "auto",
                      gap: 1.2,
                      pb: 1,
                      pt: 1,
                    }}
                  >
                    {(roomData.devices || []).map((device, deviceIdx) => (
                      <Box
                        key={deviceIdx}
                        sx={{
                          minWidth: 80,
                          maxWidth: 90,
                          p: 0.7,
                          borderRadius: 2,
                          boxShadow: 1,
                          bgcolor: "background.default",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <span style={{ fontSize: "1.1em", marginBottom: 1 }}>
                          {getDeviceEmoji(device.name)}
                        </span>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            textAlign: "center",
                            mb: 0.2,
                          }}
                        >
                          {device.name}
                        </Typography>
                        <StyledSwitch
                          checked={device.status}
                          onChange={() =>
                            handleDeviceToggle(roomName, deviceIdx)
                          }
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 2, sm: 0 },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", sm: "1.3rem" },
                      }}
                    >
                      {roomName}
                    </Typography>
                    <Box>
                      <StyledIconButton
                        onClick={() => handleEditRoom(roomName)}
                        size="large"
                      >
                        <EditIcon />
                      </StyledIconButton>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    {roomData.devices?.map((device, deviceIdx) => (
                      <Grid item xs={12} key={deviceIdx}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: 1, sm: 0 },
                          }}
                        >
                          <Typography
                            sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                          >
                            {device.name}
                          </Typography>
                          <StyledSwitch
                            checked={device.status}
                            onChange={() =>
                              handleDeviceToggle(roomName, deviceIdx)
                            }
                            size="medium"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </StyledPaper>
              )}
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Room Details (if selected) */}
      {selectedRoom && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {selectedRoom} Details
          </Typography>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Room Status</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowStats(true)}
              >
                Back to Overview
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background: "rgba(0, 0, 0, 0.05)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    Room Temperature
                  </Typography>
                  <Typography variant="h3">
                    {Math.floor(Math.random() * 15) + 20}°C
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    Updated{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    textAlign: "center",
                    background: "rgba(0, 0, 0, 0.05)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    Power Consumption
                  </Typography>
                  <Typography variant="h3">
                    {powerConsumption.toFixed(2)} kWh
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    Last 24 hours
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Devices
              </Typography>
              <Box>
                {roomsData[selectedRoom]?.devices?.map((device, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <StyledSwitch
                      checked={device.status}
                      onChange={(e) => {
                        setRoomsData((prev) => {
                          const updatedRooms = { ...prev };
                          const updatedDevices = [
                            ...updatedRooms[selectedRoom].devices,
                          ];
                          updatedDevices[index] = {
                            ...device,
                            status: e.target.checked,
                          };
                          updatedRooms[selectedRoom] = {
                            ...updatedRooms[selectedRoom],
                            devices: updatedDevices,
                          };
                          return updatedRooms;
                        });
                      }}
                    />
                    <Typography sx={{ ml: 2 }}>{device.name}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ ml: "auto", color: "text.secondary" }}
                    >
                      Last Active: {getLastActiveTime(device.status)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          <TextField
            label="Room Name"
            value={editRoomName}
            onChange={(e) => setEditRoomName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
            Devices
          </Typography>
          {editDevices.map((device, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <TextField
                label={`Device ${idx + 1}`}
                value={device.name}
                onChange={(e) => handleDeviceNameChange(idx, e.target.value)}
                size="small"
                sx={{ flex: 1, mr: 1 }}
              />
              <IconButton
                onClick={() => handleRemoveDevice(idx)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={handleEditAddDevice}
            color="primary"
          >
            Add Device
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveRoom} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addDeviceDialogOpen}
        onClose={() => setAddDeviceDialogOpen(false)}
      >
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Select Room:</Typography>
            <Select
              value={selectedRoomForDevice}
              onChange={(e) => setSelectedRoomForDevice(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            >
              {Object.keys(roomsData).map((room) => (
                <MenuItem key={room} value={room}>
                  {room}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Device Name"
            fullWidth
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddDeviceDialogOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleAddDevice} variant="contained">
            Add Device
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={addRoomDialogOpen}
        onClose={() => setAddRoomDialogOpen(false)}
      >
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddRoomDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNewRoom} variant="contained">
            Add Room
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewAllOpen}
        onClose={() => setViewAllOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: 12,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.background.paper} 80%, ${theme.palette.primary.light}11 100%)`,
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: "1.5rem",
            letterSpacing: 0.5,
            pb: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          All Devices
        </DialogTitle>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            pb: 0,
            alignItems: "center",
            flexWrap: "wrap",
            bgcolor: "background.default",
            borderBottom: "1px solid",
            borderColor: "divider",
            position: "sticky",
            top: 64,
            zIndex: 2,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Room</InputLabel>
            <Select
              value={filterRoom}
              label="Room"
              onChange={(e) => setFilterRoom(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {Object.keys(roomsData).map((room) => (
                <MenuItem key={room} value={room}>
                  {room}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="ON">ON</MenuItem>
              <MenuItem value="OFF">OFF</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ flex: 1, minWidth: 160 }}>
            <OutlinedInput
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search device name..."
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              sx={{ borderRadius: 2 }}
            />
          </FormControl>
        </Box>
        <DialogContent dividers sx={{ p: 0 }}>
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                {Object.entries(roomsData).flatMap(([roomName, roomData]) =>
                  (roomData.devices || [])
                    .filter((device) => device.name !== "Only Smart TV")
                    .filter(
                      (device) =>
                        (filterRoom === "All" || roomName === filterRoom) &&
                        (filterStatus === "All" ||
                          (filterStatus === "ON"
                            ? device.status
                            : !device.status)) &&
                        (filterText.trim() === "" ||
                          device.name
                            .toLowerCase()
                            .includes(filterText.trim().toLowerCase())),
                    )
                    .map((device, idx) => (
                      <Box
                        key={roomName + device.name + idx}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          boxShadow: 2,
                          bgcolor: "background.paper",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          minHeight: 120,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <span style={{ fontSize: "2em", marginBottom: 4 }}>
                          {getDeviceEmoji(device.name)}
                        </span>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            textAlign: "center",
                          }}
                        >
                          {device.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.95rem",
                            textAlign: "center",
                          }}
                        >
                          {roomName}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            color: device.status
                              ? "success.main"
                              : "error.main",
                            mt: 0.5,
                          }}
                        >
                          {device.status ? (
                            <CheckCircleIcon
                              fontSize="small"
                              sx={{ mr: 0.5 }}
                            />
                          ) : (
                            <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                          )}
                          {device.status ? "ON" : "OFF"}
                        </Box>
                      </Box>
                    )),
                )}
                {Object.entries(roomsData).every(
                  ([roomName, roomData]) =>
                    (roomData.devices || [])
                      .filter((device) => device.name !== "Only Smart TV")
                      .filter(
                        (device) =>
                          (filterRoom === "All" || roomName === filterRoom) &&
                          (filterStatus === "All" ||
                            (filterStatus === "ON"
                              ? device.status
                              : !device.status)) &&
                          (filterText.trim() === "" ||
                            device.name
                              .toLowerCase()
                              .includes(filterText.trim().toLowerCase())),
                      ).length === 0,
                ) && (
                  <Typography
                    color="text.secondary"
                    sx={{ gridColumn: "1 / -1", textAlign: "center", mt: 2 }}
                  >
                    No devices found.
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <TableContainer
              sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}
            >
              <Table size="small" sx={{ minWidth: 420 }}>
                <TableHead>
                  <TableRow sx={{ background: "rgba(33,150,243,0.10)" }}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        position: "sticky",
                        top: 0,
                        bgcolor: "background.default",
                        zIndex: 1,
                      }}
                    >
                      Device
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        position: "sticky",
                        top: 0,
                        bgcolor: "background.default",
                        zIndex: 1,
                      }}
                    >
                      Room
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        position: "sticky",
                        top: 0,
                        bgcolor: "background.default",
                        zIndex: 1,
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(roomsData).flatMap(
                    ([roomName, roomData], idx) =>
                      (roomData.devices || [])
                        .filter((device) => device.name !== "Only Smart TV")
                        .filter(
                          (device) =>
                            (filterRoom === "All" || roomName === filterRoom) &&
                            (filterStatus === "All" ||
                              (filterStatus === "ON"
                                ? device.status
                                : !device.status)) &&
                            (filterText.trim() === "" ||
                              device.name
                                .toLowerCase()
                                .includes(filterText.trim().toLowerCase())),
                        )
                        .map((device, dIdx) => (
                          <TableRow
                            key={roomName + device.name + dIdx}
                            sx={{
                              background:
                                (idx + dIdx) % 2 === 0
                                  ? "rgba(0,0,0,0.025)"
                                  : "transparent",
                              transition: "background 0.2s",
                              "&:hover": {
                                background: "rgba(33,150,243,0.08)",
                              },
                              borderBottom: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.13rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <span
                                style={{ fontSize: "1.35em", marginRight: 8 }}
                              >
                                {getDeviceEmoji(device.name)}
                              </span>
                              {device.name}
                            </TableCell>
                            <TableCell
                              sx={{ color: "text.secondary", fontWeight: 500 }}
                            >
                              {roomName}
                            </TableCell>
                            <TableCell>
                              {device.status ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "success.main",
                                    fontWeight: 700,
                                    fontSize: "1.08rem",
                                  }}
                                >
                                  <CheckCircleIcon
                                    fontSize="small"
                                    sx={{ mr: 0.5 }}
                                  />{" "}
                                  ON
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "error.main",
                                    fontWeight: 700,
                                    fontSize: "1.08rem",
                                  }}
                                >
                                  <CancelIcon
                                    fontSize="small"
                                    sx={{ mr: 0.5 }}
                                  />{" "}
                                  OFF
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        )),
                  )}
                  {Object.entries(roomsData).every(
                    ([roomName, roomData]) =>
                      (roomData.devices || [])
                        .filter((device) => device.name !== "Only Smart TV")
                        .filter(
                          (device) =>
                            (filterRoom === "All" || roomName === filterRoom) &&
                            (filterStatus === "All" ||
                              (filterStatus === "ON"
                                ? device.status
                                : !device.status)) &&
                            (filterText.trim() === "" ||
                              device.name
                                .toLowerCase()
                                .includes(filterText.trim().toLowerCase())),
                        ).length === 0,
                  ) && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ color: "text.secondary" }}
                      >
                        No devices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            bgcolor: "background.default",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={() => setViewAllOpen(false)}
            color="primary"
            variant="contained"
            size="large"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              fontSize: "1.1rem",
              boxShadow: 2,
            }}
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
