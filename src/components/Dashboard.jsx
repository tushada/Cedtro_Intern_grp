import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Avatar,
  Collapse,
  IconButton,
  Select,
  Divider,
  Switch,
  Slide,
  Fade,
  Stack,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import TemperatureDisplay from "./TemperatureDisplay";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TvIcon from "@mui/icons-material/Tv";
import AirIcon from "@mui/icons-material/AcUnit";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import UmbrellaIcon from "@mui/icons-material/Umbrella";
import WindIcon from "@mui/icons-material/WindPower";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TodayIcon from "@mui/icons-material/Today";
import HistoryIcon from "@mui/icons-material/History";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Chip from "@mui/material/Chip";
import axios from "axios"; // Import axios
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import BedIcon from "@mui/icons-material/Bed";
import KitchenIcon from "@mui/icons-material/Kitchen";
import BathtubIcon from "@mui/icons-material/Bathtub";
import LivingIcon from "@mui/icons-material/Chair";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DevicesIcon from "@mui/icons-material/Devices";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import socketIOClient from "socket.io-client";
import { getRelays, getStates, sendControlCommand, connectWebSocket } from "../services/api";
import { db } from "../firebase/config";
import { doc, collection, onSnapshot } from "firebase/firestore";

// Initialize socket connection (singleton for this file)
// const socket = socketIOClient("http://localhost:3000");

// Recharts components
const RechartsLineChart = LineChart;
const RechartsLine = Line;
const RechartsXAxis = XAxis;
const RechartsYAxis = YAxis;
const RechartsCartesianGrid = CartesianGrid;
const RechartsTooltip = Tooltip;

// Mock temperature data
const mockTemperatureData = {
  current: 24.5,
  condition: "sunny",
  humidity: 65,
  feelsLike: 26.3,
  lastUpdated: new Date().toLocaleTimeString(),
};

// Temperature block component
const TemperatureBlock = () => {
  const [temperature, setTemperature] = useState(mockTemperatureData);
  const [gradientColor, setGradientColor] = useState("");

  // Update temperature data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString(),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate gauge color based on temperature
  const getGaugeColor = (temp) => {
    if (temp < 15) return "#0074D9"; // Blue for cold
    if (temp < 25) return "#39B54A"; // Green for moderate
    return "#FF4136"; // Red for hot
  };

  // Get weather icon based on temperature
  const getWeatherIcon = (temp) => {
    if (temp < 15) return <WbSunnyIcon sx={{ fontSize: 24 }} />;
    if (temp < 25) return <CloudIcon sx={{ fontSize: 24 }} />;
    return <ThunderstormIcon sx={{ fontSize: 24 }} />;
  };

  // Get background gradient based on temperature
  const getBackgroundGradient = (temp) => {
    const coldColor = "#0074D9";
    const warmColor = "#FF4136";
    const gradient = `linear-gradient(145deg, ${coldColor} 0%, ${warmColor} 100%)`;
    return gradient;
  };

  // Update gradient when temperature changes
  useEffect(() => {
    const gradient = getBackgroundGradient(temperature.current);
    setGradientColor(gradient);
  }, [temperature.current]);

  const gaugeColor = getGaugeColor(temperature.current);

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[3],
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            color: theme.palette.text.primary,
            fontWeight: 500,
            opacity: 0.9,
            mr: 1,
          })}
        >
          Average Home Temperature
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 200,
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Animated weather icons */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: 0.3,
            }}
          >
            {getWeatherIcon(temperature.current)}
            {getWeatherIcon(temperature.current)}
          </Box>

          <svg width="100%" height="100%">
            {/* Base circle */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="12"
              strokeDasharray="10 10"
            />
            {/* Temperature arc */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke={gaugeColor}
              strokeWidth="12"
              strokeDasharray={`${(temperature.current / 40) * 100} 100`}
              transform="rotate(-90) translate(-20)"
              style={{
                transition: "stroke 0.5s ease-in-out",
              }}
            />
          </svg>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={(theme) => ({
                fontWeight: "bold",
                color: theme.palette.text.primary,
                textShadow: `0 2px 8px ${theme.palette.background.default}`,
                transition: "color 0.3s ease",
              })}
            >
              {temperature.current}°C
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <Typography
                variant="body1"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                })}
              >
                {temperature.humidity}%
              </Typography>
              {getWeatherIcon(temperature.current)}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(255, 255, 255, 0.7)",
          mt: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={(theme) => ({
            color: theme.palette.text.secondary,
          })}
        >
          Feels like: {temperature.feelsLike}°C
        </Typography>
        <Typography
          variant="body2"
          sx={(theme) => ({
            color: theme.palette.text.secondary,
          })}
        >
          Last updated: {temperature.lastUpdated}
        </Typography>
      </Box>
    </Paper>
  );
};

// Function to calculate daily total energy consumption
const calculateDailyTotal = () => {
  const yesterday = new Date(CURRENT_TIME);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  // Generate hourly data for yesterday
  const hourlyData = getEnergyDataHourly();

  // Calculate total consumption and convert to units (1000W = 1 unit)
  const totalWatts = hourlyData.reduce(
    (sum, hour) => sum + hour.consumption,
    0,
  );
  const totalUnits = totalWatts / 1000;

  return {
    date: yesterday.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    total: totalUnits,
  };
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: theme.palette.error.main,
    transition: "color 0.3s ease",
    "&.Mui-checked": {
      color: theme.palette.success.main,
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: theme.palette.error.main,
    opacity: 0.3,
    transition: "background-color 0.3s ease",
    "&.Mui-checked": {
      backgroundColor: theme.palette.success.main,
      opacity: 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
}));

const RoomSection = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  marginBottom: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const RoomHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)",
  },
}));

const RoomSummary = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const DeviceCard = styled(Box)(({ theme, status }) => ({
  borderRadius: 12,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backdropFilter: "blur(5px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  "& .device-icon": {
    transition: "transform 0.3s ease",
  },
  "&:hover .device-icon": {
    transform: "scale(1.1)",
  },
}));

const DeviceStatusBadge = styled(Box)(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: status
    ? theme.palette.success.main
    : theme.palette.error.main,
  boxShadow: status
    ? `0 0 8px ${theme.palette.success.main}`
    : `0 0 8px ${theme.palette.error.main}`,
  transition: "all 0.2s ease",
}));

const DeviceIcon = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
});

const QuickAccessSection = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  marginBottom: theme.spacing(2),
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
}));

const QuickAccessHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const QuickAccessDevice = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const QuickAccessSelect = styled(Select)(({ theme }) => ({
  minWidth: 120,
  "& .MuiSelect-select": {
    padding: "8px 12px",
    fontSize: "0.875rem",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ccc",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#4CAF50",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#4CAF50",
  },
}));

const WeatherSection = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  marginBottom: theme.spacing(2),
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
}));

const WeatherHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const WeatherContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: theme.spacing(2),
}));

const WeatherCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  backdropFilter: "blur(5px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const MembersSection = styled(Box)({
  borderRadius: 12,
  backgroundColor: "background.paper",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  marginBottom: 2,
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
});

const MemberCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  backdropFilter: "blur(5px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const MemberAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  fontSize: "1.25rem",
  backgroundColor: "primary.main",
  color: "primary.contrastText",
});

const RoomControl = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DeviceControl = styled(Box)(({ theme, status }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    status === "online" ? theme.palette.success.main : theme.palette.error.main,
  borderRadius: 8,
}));

const ThermostatControl = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  borderRadius: "50%",
  border: `4px solid ${theme.palette.primary.main}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
}));

// Dynamic energy data generation based on current date/time
const CURRENT_TIME = new Date();

const getEnergyDataHourly = () => {
  const hours = [];
  const now = new Date();

  // Generate data for the past 24 hours
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(now.getHours() - i);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    // Base consumption (0.1-0.3 kW)
    let consumption = 0.1 + Math.random() * 0.2;

    // Add daily pattern (higher during morning and evening)
    const hour = d.getHours();
    if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 22)) {
      // Peak hours
      consumption += 0.5 + Math.random() * 0.5; // 0.5-1.0 kW additional during peak
    } else if (hour >= 11 && hour <= 16) {
      // Daytime
      consumption += 0.2 + Math.random() * 0.3; // 0.2-0.5 kW additional
    } else {
      // Night time
      consumption += Math.random() * 0.2; // 0-0.2 kW additional
    }

    // Add some randomness but keep within 0-2 kW range
    consumption = Math.min(Math.max(consumption, 0), 2);

    // Format label to show time and date if it's not today
    let label;
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      label = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      label = d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    hours.push({
      timestamp: d,
      label: label,
      consumption: parseFloat(consumption.toFixed(2)),
    });
  }
  return hours;
};

function getEnergyDataDaily() {
  // Show last 7 days with full dates and weekday/weekend variations
  const days = [];
  const weekdayBase = 22; // Base consumption for weekdays (kW)
  const weekendBase = 32; // Base consumption for weekends (kW)

  for (let i = 6; i >= 0; i--) {
    const d = new Date(CURRENT_TIME);
    d.setDate(CURRENT_TIME.getDate() - i);

    // Base consumption based on day type
    let consumption =
      d.getDay() === 0 || d.getDay() === 6 ? weekendBase : weekdayBase;

    // Add seasonal variation (more consumption in winter)
    const month = d.getMonth();
    if (month >= 11 || month <= 2) {
      // Winter months
      consumption *= 1.15; // 15% more in winter
    } else if (month >= 6 && month <= 8) {
      // Summer months
      consumption *= 1.05; // 5% more in summer
    }

    // Add some variation but keep it smooth and within range
    if (days.length > 0) {
      const lastConsumption = days[days.length - 1].consumption;
      // Ensure the value stays within 15-40 kW range
      consumption = Math.min(
        Math.max(
          lastConsumption * (0.95 + Math.random() * 0.1), // ±5% variation from previous day
          15, // Minimum 15 kW
        ),
        40, // Maximum 40 kW
      );
    } else {
      // For the first day, ensure it's within range
      consumption = Math.min(Math.max(consumption, 15), 40);
    }

    // Format date as "DD MMM YYYY"
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = d.toLocaleDateString("en-US", options);

    days.push({
      label: formattedDate,
      consumption: parseFloat(consumption.toFixed(2)), // Keep 2 decimal places for kW values
    });
  }
  return days;
}

function getEnergyDataWeekly() {
  // Show last 4 weeks (simple labels)
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    const weekLabel = `Week ${4 - i}`;
    // Generate weekly consumption in the 90-200 kW range
    const weeklyConsumption = 90 + Math.random() * 110; // 90-200 kW range
    weeks.push({
      label: weekLabel,
      consumption: parseFloat(weeklyConsumption.toFixed(2)),
    });
  }
  return weeks;
}

function getEnergyDataMonthly() {
  // Show last 6 months up to current
  const months = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currMonth = CURRENT_TIME.getMonth();
  let currYear = CURRENT_TIME.getFullYear();
  for (let i = 5; i >= 0; i--) {
    let m = currMonth - i;
    let y = currYear;
    if (m < 0) {
      m += 12;
      y--;
    }
    // Generate monthly consumption in the 800-1000 kW range
    const monthlyConsumption = 800 + Math.random() * 200; // 800-1000 kW range
    months.push({
      label: `${monthNames[m]}`,
      consumption: parseFloat(monthlyConsumption.toFixed(2)),
    });
  }
  return months;
}

function getEnergyDataYearly() {
  // Show last 5 years up to current
  const years = [];
  const currentYear = CURRENT_TIME.getFullYear();
  for (let i = 4; i >= 0; i--) {
    const year = currentYear - i;
    // Generate yearly consumption in the 9000-15000 kW range
    const yearlyConsumption = 9000 + Math.random() * 6000; // 9000-15000 kW range
    years.push({
      label: year.toString(),
      consumption: parseFloat(yearlyConsumption.toFixed(2)),
    });
  }
  return years;
}

// Room data is now passed as props from App.jsx

const members = [
  { name: "Alex", role: "Admin", avatar: "A" },
  { name: "Sarah", role: "Full Access", avatar: "S" },
];

const getDeviceIcon = (deviceName) => {
  if (deviceName.toLowerCase().includes("tv")) return <TvIcon />;
  if (
    deviceName.toLowerCase().includes("ac") ||
    deviceName.toLowerCase().includes("air")
  )
    return <AirIcon />;
  if (deviceName.toLowerCase().includes("light")) return <LightbulbIcon />;
  return <PowerSettingsNewIcon />;
};

const getWeatherIcon = (condition) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <WbSunnyIcon sx={{ fontSize: 40 }} />;
    case "partly cloudy":
      return <CloudQueueIcon sx={{ fontSize: 40 }} />;
    case "cloudy":
      return <CloudIcon sx={{ fontSize: 40 }} />;
    case "rain":
      return <WaterDropIcon sx={{ fontSize: 40 }} />;
    case "thunderstorm":
      return <ThunderstormIcon sx={{ fontSize: 40 }} />;
    default:
      return <CloudQueueIcon sx={{ fontSize: 40 }} />;
  }
};

// Define animations using MUI keyframes
const bellAnimation = keyframes`
  0% { transform: rotate(0); }
  15% { transform: rotate(5deg); }
  30% { transform: rotate(-5deg); }
  45% { transform: rotate(4deg); }
  60% { transform: rotate(-4deg); }
  75% { transform: rotate(2deg); }
  85% { transform: rotate(-2deg); }
  100% { transform: rotate(0); }
`;

// Inject the bell animation into the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = bellAnimation.toString();
  document.head.appendChild(style);
}

const IconToggle = styled(Box)(({ theme, status, disabled }) => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: disabled ? "not-allowed" : "pointer",
  backgroundColor: status
    ? theme.palette.success.main
    : theme.palette.error.main,
  color: theme.palette.common.white,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  animation: status ? "pulse 2s infinite" : "none",
  opacity: disabled ? 0.5 : 1,
  "&:hover": {
    transform: disabled ? "none" : "scale(1.1)",
    boxShadow: disabled
      ? "none"
      : `0 0 12px ${status ? theme.palette.success.main : theme.palette.error.main}`,
  },
  "&:active": {
    transform: disabled ? "none" : "scale(0.95)",
  },
}));

const getDeviceEmoji = (deviceName) => {
  const name = deviceName.toLowerCase();
  if (name.includes("tv")) return "📺";
  if (name.includes("ac") || name.includes("air")) return "❄️";
  if (name.includes("light")) return "💡";
  if (name.includes("fan")) return "🌀";
  if (name.includes("water") || name.includes("heater")) return "🚿";
  if (name.includes("mirror")) return "🪞";
  if (name.includes("oven")) return "🔥";
  if (name.includes("dishwasher")) return "🍽️";
  if (name.includes("refrigerator")) return "❄️";
  return "🔌";
};

// Define pulse animation using keyframes
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.8);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
`;

// Define PulseAnimation component
const PulseAnimation = styled(Box)`
  animation: ${pulseAnimation} 2s infinite;
`;

// Update NotificationBell to use the pulse animation
const NotificationBell = styled(IconButton)(({ theme, hasNotifications }) => ({
  animation: hasNotifications ? "bell 1s ease-in-out infinite" : "none",
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    boxShadow: `0 0 8px ${theme.palette.error.main}`,
    animation: hasNotifications ? pulseAnimation : "none",
  },
}));

// Inject the bell animation into the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bell {
      0% { transform: rotate(0); }
      15% { transform: rotate(5deg); }
      30% { transform: rotate(-5deg); }
      45% { transform: rotate(4deg); }
      60% { transform: rotate(-4deg); }
      75% { transform: rotate(2deg); }
      85% { transform: rotate(-2deg); }
      100% { transform: rotate(0); }
    }
  `;
  document.head.appendChild(style);
}

const NotificationMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: 320,
    maxHeight: 400,
    backgroundColor: theme.palette.background.paper,
    backdropFilter: "blur(8px)",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const NotificationItem = styled(MenuItem)(({ theme, unread }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: unread ? theme.palette.action.hover : "transparent",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  "& .notification-content": {
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
  },
  "& .notification-title": {
    fontWeight: unread ? 600 : 400,
    color: theme.palette.text.primary,
  },
  "& .notification-time": {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
  },
  "& .notification-message": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const DashboardBanner = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(6),
  borderRadius: 32,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(224, 242, 254, 0.95) 100%)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  overflow: "hidden",
  marginBottom: theme.spacing(6),
  boxShadow: theme.shadows[8],
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
    opacity: 0.5,
    pointerEvents: "none",
  },
}));

const WeatherInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  background:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  backdropFilter: "blur(5px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const UserGreeting = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  background:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  backdropFilter: "blur(5px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  fontSize: 24,
  fontWeight: "bold",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "scale(1.05) rotate(360deg)",
    boxShadow: theme.shadows[4],
  },
}));

const TimeDisplay = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  textAlign: "center",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const EnergyCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 48px rgba(0, 0, 0, 0.4)"
        : "0 12px 48px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  "& .MuiButton-root": {
    borderRadius: 12,
    textTransform: "capitalize",
    fontWeight: 500,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
}));

const AnimatedTooltip = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  padding: theme.spacing(2),
  borderRadius: 12,
  boxShadow: theme.shadows[4],
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  "& .label": {
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  "& .value": {
    color: theme.palette.primary.main,
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  "& .timestamp": {
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
  },
}));

const SummaryCard = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 48px rgba(0, 0, 0, 0.4)"
        : "0 12px 48px rgba(0, 0, 0, 0.2)",
  },
}));

const SummaryHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)",
  },
}));

const SummaryContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
}));

// Add this after the StyledButtonGroup component
const ViewAllButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 600,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
      : "linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)",
  color: "#fff",
  boxShadow: "0 3px 12px rgba(33, 150, 243, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
  },
}));

// Hardcoded house members for now
const houseMembers = ["Alex", "Priya", "Sam"];

// Utility functions for device and room stats
const getDeviceStats = (roomsData) => {
  let total = 0,
    on = 0;
  Object.values(roomsData).forEach((room) => {
    if (room.devices) {
      total += room.devices.length;
      on += room.devices.filter((d) => d.status).length;
    }
  });
  return { total, on };
};
const getRoomStats = (roomsData) => {
  let total = Object.keys(roomsData).length;
  let occupied = 0;
  Object.values(roomsData).forEach((room) => {
    if (room.devices && room.devices.some((d) => d.status)) occupied++;
  });
  return { total, occupied };
};

// Add this at the top of the file:
const backendUrl = "https://713e555cdc8d.ngrok-free.app"; // Your backend HTTP URL
const wsUrl = "wss://713e555cdc8d.ngrok-free.app";        // Your backend WebSocket URL

function Dashboard() {
  const [currentSection, setCurrentSection] = useState("home");
  const [relays, setRelays] = useState([]);
  const [states, setStates] = useState({});
  const [userInitiatedMap, setUserInitiatedMap] = useState({});
  const [greeting, setGreeting] = useState("");
  const [dateTime, setDateTime] = useState("");
  const wsRef = useRef(null);

  // Get user info from localStorage
  const deviceId = localStorage.getItem("deviceId") || "";
  const updateHomeId = localStorage.getItem("updateHomeId") || "";
  const originalHomeId = localStorage.getItem("originalHomeId") || "";
  const username = localStorage.getItem("username") || "User";

  // Date/time updater
  useEffect(() => {
    function updateDateTime() {
      setGreeting(`Hello, ${username}!`);
      setDateTime(new Date().toLocaleString());
    }
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, [username]);

  // Fetch relays and states
  const fetchRelayData = async () => {
    try {
      const relaysRes = await fetch(`${backendUrl}/relays/${deviceId}?originalHomeId=${originalHomeId}`);
      const relaysData = await relaysRes.json();
      const statesRes = await fetch(`${backendUrl}/states/${deviceId}?updateHomeId=${updateHomeId}`);
      const statesData = await statesRes.json();
      setRelays(relaysData);
      setStates(statesData);
    } catch (e) {
      alert("Error fetching relay data");
    }
  };

  // On mount: fetch relays and connect WebSocket
  useEffect(() => {
    fetchRelayData();
    connectWebSocket();
    // eslint-disable-next-line
  }, []);

  // WebSocket connection
  function connectWebSocket() {
    if (wsRef.current) wsRef.current.close();
    const ws = new window.WebSocket(wsUrl);
    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        if (
          json.deviceId === deviceId &&
          json.homeId === updateHomeId
        ) {
          const key = `${json.room}_${json.relay}`;
          setStates((prev) => ({ ...prev, [key]: json.value }));
        }
      } catch (e) {
        console.error("WebSocket message parse error", e);
      }
    };
    ws.onclose = () => console.log("WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error", err);
    wsRef.current = ws;
  }

  // Send relay command
  const sendCommand = async (room, relay, command) => {
    try {
      await fetch(`${backendUrl}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          updateHomeId,
          room,
          relay,
          command,
        }),
      });
    } catch (e) {
      alert("Failed to send command");
    }
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // UI for relays grouped by room
  const roomRelayMap = {};
  relays.forEach((obj) => {
    const room = obj.room;
    const relay = obj.relay;
    const key = `${room}_${relay}`;
    const isOn = (states[key] || "OFF").toUpperCase() === "ON";
    if (!roomRelayMap[room]) roomRelayMap[room] = [];
    roomRelayMap[room].push({ relay, isOn });
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', padding: '0', margin: '0' }}>
      <div style={{ maxWidth: 900, margin: '32px auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', minHeight: 500 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 24, fontWeight: 600 }}>🏠 Dashboard</span>
            <div style={{ fontSize: 16, color: '#555', marginTop: 4 }}>{greeting}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 16, color: '#888' }}>{dateTime}</span>
            <br />
            <button onClick={logout} style={{ marginTop: 8, padding: '6px 18px', borderRadius: 6, background: '#f44336', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
        <hr style={{ margin: '16px 0 24px 0', border: 0, borderTop: '1px solid #eee' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#222' }}>Home Items</h2>
          <button onClick={fetchRelayData} style={{ marginLeft: 20, padding: '7px 20px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>Refresh</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 8, justifyContent: 'flex-start' }}>
          {Object.keys(roomRelayMap).length === 0 && <div style={{ color: '#888', fontSize: 18 }}>No rooms found.</div>}
          {Object.entries(roomRelayMap).map(([room, relays]) => (
            <div
              key={room}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                padding: 20,
                minWidth: 240,
                background: '#fafbfc',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s',
                marginBottom: 12,
                flex: '1 1 260px',
                maxWidth: 320,
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(25,118,210,0.10)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'}
            >
              <h3 style={{ marginBottom: 16, fontSize: 20, color: '#1976d2', fontWeight: 600 }}>{room}</h3>
              <div>
                {relays.map(({ relay, isOn }) => {
                  const key = `${room}_${relay}`;
                  return (
                    <div
                      key={relay}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 14,
                        padding: '6px 0',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: 16,
                      }}
                    >
                      <span style={{ flex: 1, color: '#333' }}>{relay}</span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={isOn}
                          onChange={(e) => {
                            setUserInitiatedMap((prev) => ({ ...prev, [key]: true }));
                            sendCommand(room, relay, e.target.checked ? "ON" : "OFF");
                          }}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {/* Simple CSS for switch */}
        <style>{`
          .switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
          }
          .switch input {display:none;}
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .slider {
            background-color: #1976d2;
          }
          input:checked + .slider:before {
            transform: translateX(20px);
          }
        `}</style>
      </div>
    </div>
  );
}

export default Dashboard;
