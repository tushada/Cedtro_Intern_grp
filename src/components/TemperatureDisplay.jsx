import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Switch,
  styled,
  IconButton,
  Slider,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  WaterDrop as WaterDropIcon,
  AcUnit as AcUnitIcon,
  WbSunny as WbSunnyIcon,
  Thermostat as ThermostatIcon,
} from "@mui/icons-material";

const TemperatureDisplay = ({ roomsData, setRoomsData }) => {
  const roomNames = Object.keys(roomsData);
  const currentRoom = roomNames.length > 0 ? roomNames[0] : "Living Room";
  const [temperature, setTemperature] = useState(24);
  const [humidity, setHumidity] = useState(65);
  const [controlEnabled, setControlEnabled] = useState(true);

  // Update temperature and humidity based on currentRoom
  useEffect(() => {
    if (roomsData[currentRoom]) {
      const roomTemp = roomsData[currentRoom].temperature || 24;
      const roomHumidity = roomsData[currentRoom].humidity || 65;
      setTemperature(roomTemp);
      setHumidity(roomHumidity);
    }
  }, [currentRoom, roomsData]);

  // Handle temperature change
  const handleTemperatureChange = (newValue) => {
    if (controlEnabled) {
      setTemperature(newValue);
      setRoomsData((prev) => ({
        ...prev,
        [currentRoom]: {
          ...prev[currentRoom],
          temperature: newValue,
        },
      }));
    }
  };

  // Get temperature color based on value
  const getTemperatureColor = (temp) => {
    if (temp < 20) return "#2196F3"; // Cold - Blue
    if (temp < 25) return "#4CAF50"; // Comfortable - Green
    if (temp < 28) return "#FFC107"; // Warm - Yellow
    return "#F44336"; // Hot - Red
  };

  // Get temperature icon based on value
  const getTemperatureIcon = (temp) => {
    if (temp < 20) return <AcUnitIcon />;
    if (temp < 25) return <ThermostatIcon />;
    return <WbSunnyIcon />;
  };

  const StyledContainer = styled(Box)(({ theme }) => ({
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.9))"
        : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 240, 0.9))",
    borderRadius: 24,
    padding: theme.spacing(3),
    boxShadow: theme.shadows[4],
    backdropFilter: "blur(10px)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"
    }`,
  }));

  const TemperatureGauge = styled(Box)(({ theme, temp }) => ({
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: `conic-gradient(
      ${getTemperatureColor(temp)} 0%,
      ${getTemperatureColor(temp)} ${(temp - 16) * 7.14}%,
      rgba(255, 255, 255, 0.1) ${(temp - 16) * 7.14}%,
      rgba(255, 255, 255, 0.1) 100%
    )`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    boxShadow: `0 0 30px ${getTemperatureColor(temp)}40`,
    "&::before": {
      content: '""',
      position: "absolute",
      width: "85%",
      height: "85%",
      borderRadius: "50%",
      background: theme.palette.background.paper,
      boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.1)",
    },
  }));

  const StyledSlider = styled(Slider)(({ theme }) => ({
    color: getTemperatureColor(temperature),
    height: 8,
    "& .MuiSlider-track": {
      border: "none",
      background: `linear-gradient(90deg, ${getTemperatureColor(16)} 0%, ${getTemperatureColor(30)} 100%)`,
    },
    "& .MuiSlider-thumb": {
      height: 24,
      width: 24,
      backgroundColor: "#fff",
      border: `2px solid ${getTemperatureColor(temperature)}`,
      boxShadow: `0 0 10px ${getTemperatureColor(temperature)}40`,
    },
    "& .MuiSlider-rail": {
      opacity: 0.3,
      background: `linear-gradient(90deg, ${getTemperatureColor(16)} 0%, ${getTemperatureColor(30)} 100%)`,
    },
  }));

  return (
    <StyledContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
            Room Temperature
          </Typography>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 0.5, display: "block" }}
            >
              Room: {currentRoom}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Humidity">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WaterDropIcon color="primary" />
              <Box component="span" sx={{ ml: 0.5 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: "primary.50",
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow: 1,
                  }}
                >
                  {humidity}%
                </Box>
              </Box>
            </Box>
          </Tooltip>
          <Tooltip
            title={controlEnabled ? "Disable Controls" : "Enable Controls"}
          >
            <Switch
              checked={controlEnabled}
              onChange={(e) => setControlEnabled(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase": {
                  color: controlEnabled ? "success.main" : "error.main",
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <TemperatureGauge temp={temperature}>
          <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                color: getTemperatureColor(temperature),
                fontSize: "4.5rem",
                mb: 0.5,
              }}
            >
              {temperature}°C
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Current Temperature
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {getTemperatureIcon(temperature)}
              <Typography variant="h6" color="text.secondary">
                {temperature < 20
                  ? "Cold"
                  : temperature < 25
                    ? "Comfortable"
                    : temperature < 28
                      ? "Warm"
                      : "Hot"}
              </Typography>
            </Box>
          </Box>
        </TemperatureGauge>
      </Box>

      <Box sx={{ px: 2, mb: 2 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          Set Temperature
        </Typography>
        <StyledSlider
          value={temperature}
          onChange={(_, newValue) => handleTemperatureChange(newValue)}
          min={16}
          max={30}
          step={1}
          disabled={!controlEnabled}
          marks={Array.from({ length: 8 }, (_, i) => ({
            value: 16 + i * 2,
            label: `${16 + i * 2}°C`,
          }))}
          valueLabelDisplay="off"
        />
      </Box>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton
          onClick={() => handleTemperatureChange(Math.max(16, temperature - 1))}
          disabled={!controlEnabled || temperature <= 16}
          sx={{
            color: getTemperatureColor(temperature),
            "&:hover": {
              backgroundColor: `${getTemperatureColor(temperature)}20`,
            },
          }}
        >
          <ExpandLessIcon />
        </IconButton>
        <IconButton
          onClick={() => handleTemperatureChange(Math.min(30, temperature + 1))}
          disabled={!controlEnabled || temperature >= 30}
          sx={{
            color: getTemperatureColor(temperature),
            "&:hover": {
              backgroundColor: `${getTemperatureColor(temperature)}20`,
            },
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
    </StyledContainer>
  );
};

export default TemperatureDisplay;
