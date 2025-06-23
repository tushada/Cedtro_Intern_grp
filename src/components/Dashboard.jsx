import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Paper, Avatar, Collapse, IconButton, Select, Divider, Switch, Slide, Fade, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import TemperatureDisplay from './TemperatureDisplay';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TvIcon from '@mui/icons-material/Tv';
import AirIcon from '@mui/icons-material/AcUnit';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import WindIcon from '@mui/icons-material/WindPower';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TodayIcon from '@mui/icons-material/Today';
import HistoryIcon from '@mui/icons-material/History';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Chip from '@mui/material/Chip';
import axios from 'axios'; // Import axios
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import BedIcon from '@mui/icons-material/Bed';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LivingIcon from '@mui/icons-material/Chair';

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
  condition: 'sunny',
  humidity: 65,
  feelsLike: 26.3,
  lastUpdated: new Date().toLocaleTimeString()
};

// Temperature block component
const TemperatureBlock = () => {
  const [temperature, setTemperature] = useState(mockTemperatureData);
  const [gradientColor, setGradientColor] = useState('');

  // Update temperature data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate gauge color based on temperature
  const getGaugeColor = (temp) => {
    if (temp < 15) return '#0074D9'; // Blue for cold
    if (temp < 25) return '#39B54A'; // Green for moderate
    return '#FF4136'; // Red for hot
  };

  // Get weather icon based on temperature
  const getWeatherIcon = (temp) => {
    if (temp < 15) return <WbSunnyIcon sx={{ fontSize: 24 }} />;
    if (temp < 25) return <CloudIcon sx={{ fontSize: 24 }} />;
    return <ThunderstormIcon sx={{ fontSize: 24 }} />;
  };

  // Get background gradient based on temperature
  const getBackgroundGradient = (temp) => {
    const coldColor = '#0074D9';
    const warmColor = '#FF4136';
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
        boxShadow: theme.shadows[3]
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            color: theme.palette.text.primary,
            fontWeight: 500,
            opacity: 0.9,
            mr: 1
          })}
        >
          Average Home Temperature
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 200,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Animated weather icons */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: 0.3
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
                transition: 'stroke 0.5s ease-in-out'
              }}
            />
          </svg>
          
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography
              variant="h3"
              sx={(theme) => ({
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                textShadow: `0 2px 8px ${theme.palette.background.default}`,
                transition: 'color 0.3s ease'
              })}
            >
              {temperature.current}°C
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <Typography variant="body1" sx={(theme) => ({
                color: theme.palette.text.secondary
              })}>
                {temperature.humidity}%
              </Typography>
              {getWeatherIcon(temperature.current)}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          color: 'rgba(255, 255, 255, 0.7)',
          mt: 2
        }}
      >
        <Typography variant="body2" sx={(theme) => ({
          color: theme.palette.text.secondary
        })}>
          Feels like: {temperature.feelsLike}°C
        </Typography>
        <Typography variant="body2" sx={(theme) => ({
          color: theme.palette.text.secondary
        })}>
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
  const totalWatts = hourlyData.reduce((sum, hour) => sum + hour.consumption, 0);
  const totalUnits = totalWatts / 1000;
  
  return {
    date: yesterday.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    total: totalUnits
  };
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: theme.palette.error.main,
    transition: 'color 0.3s ease',
    '&.Mui-checked': {
      color: theme.palette.success.main,
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.error.main,
    opacity: 0.3,
    transition: 'background-color 0.3s ease',
    '&.Mui-checked': {
      backgroundColor: theme.palette.success.main,
      opacity: 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const RoomSection = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const RoomHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
  },
}));

const RoomSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const DeviceCard = styled(Box)(({ theme, status }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  '& .device-icon': {
    transition: 'transform 0.3s ease',
  },
  '&:hover .device-icon': {
    transform: 'scale(1.1)',
  },
}));

const DeviceStatusBadge = styled(Box)(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: status ? theme.palette.success.main : theme.palette.error.main,
  boxShadow: status ? `0 0 8px ${theme.palette.success.main}` : `0 0 8px ${theme.palette.error.main}`,
  transition: 'all 0.2s ease',
}));

const DeviceIcon = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
});

const QuickAccessSection = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

const QuickAccessHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const QuickAccessDevice = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const QuickAccessSelect = styled(Select)(({ theme }) => ({
  minWidth: 120,
  '& .MuiSelect-select': {
    padding: '8px 12px',
    fontSize: '0.875rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ccc',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4CAF50',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4CAF50',
  },
}));

const WeatherSection = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

const WeatherHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const WeatherContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: theme.spacing(2),
}));

const WeatherCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const MembersSection = styled(Box)({
  borderRadius: 12,
  backgroundColor: 'background.paper',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: 2,
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
});

const MemberCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const MemberAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  fontSize: '1.25rem',
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
});

const RoomControl = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DeviceControl = styled(Box)(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: status === 'online' ? theme.palette.success.main : theme.palette.error.main,
  borderRadius: 8,
}));

const ThermostatControl = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  borderRadius: '50%',
  border: `4px solid ${theme.palette.primary.main}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
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
      label = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      label = d.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    hours.push({ 
      timestamp: d,
      label: label,
      consumption: parseFloat(consumption.toFixed(2))
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
    let consumption = d.getDay() === 0 || d.getDay() === 6 ? 
      weekendBase : weekdayBase;
    
    // Add seasonal variation (more consumption in winter)
    const month = d.getMonth();
    if (month >= 11 || month <= 2) { // Winter months
      consumption *= 1.15; // 15% more in winter
    } else if (month >= 6 && month <= 8) { // Summer months
      consumption *= 1.05; // 5% more in summer
    }
    
    // Add some variation but keep it smooth and within range
    if (days.length > 0) {
      const lastConsumption = days[days.length - 1].consumption;
      // Ensure the value stays within 15-40 kW range
      consumption = Math.min(
        Math.max(
          lastConsumption * (0.95 + Math.random() * 0.1), // ±5% variation from previous day
          15 // Minimum 15 kW
        ),
        40 // Maximum 40 kW
      );
    } else {
      // For the first day, ensure it's within range
      consumption = Math.min(Math.max(consumption, 15), 40);
    }
    
    // Format date as "DD MMM YYYY"
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = d.toLocaleDateString('en-US', options);
    
    days.push({
      label: formattedDate,
      consumption: parseFloat(consumption.toFixed(2)) // Keep 2 decimal places for kW values
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
      consumption: parseFloat(weeklyConsumption.toFixed(2))
    });
  }
  return weeks;
}

function getEnergyDataMonthly() {
  // Show last 6 months up to current
  const months = [];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
      consumption: parseFloat(monthlyConsumption.toFixed(2))
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
      consumption: parseFloat(yearlyConsumption.toFixed(2))
    });
  }
  return years;
}

// Room data is now passed as props from App.jsx

const members = [
  { name: 'Alex', role: 'Admin', avatar: 'A' },
  { name: 'Sarah', role: 'Full Access', avatar: 'S' },
];

const getDeviceIcon = (deviceName) => {
  if (deviceName.toLowerCase().includes('tv')) return <TvIcon />;
  if (deviceName.toLowerCase().includes('ac') || deviceName.toLowerCase().includes('air')) return <AirIcon />;
  if (deviceName.toLowerCase().includes('light')) return <LightbulbIcon />;
  return <PowerSettingsNewIcon />;
};

const getWeatherIcon = (condition) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <WbSunnyIcon sx={{ fontSize: 40 }} />;
    case 'partly cloudy':
      return <CloudQueueIcon sx={{ fontSize: 40 }} />;
    case 'cloudy':
      return <CloudIcon sx={{ fontSize: 40 }} />;
    case 'rain':
      return <WaterDropIcon sx={{ fontSize: 40 }} />;
    case 'thunderstorm':
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
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = bellAnimation.toString();
  document.head.appendChild(style);
}

const IconToggle = styled(Box)(({ theme, status, disabled }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor: status ? theme.palette.success.main : theme.palette.error.main,
  color: theme.palette.common.white,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: status ? 'pulse 2s infinite' : 'none',
  opacity: disabled ? 0.5 : 1,
  '&:hover': {
    transform: disabled ? 'none' : 'scale(1.1)',
    boxShadow: disabled ? 'none' : `0 0 12px ${status ? theme.palette.success.main : theme.palette.error.main}`,
  },
  '&:active': {
    transform: disabled ? 'none' : 'scale(0.95)',
  },
}));

const getDeviceEmoji = (deviceName) => {
  const name = deviceName.toLowerCase();
  if (name.includes('tv')) return '📺';
  if (name.includes('ac') || name.includes('air')) return '❄️';
  if (name.includes('light')) return '💡';
  if (name.includes('fan')) return '🌀';
  if (name.includes('water') || name.includes('heater')) return '🚿';
  if (name.includes('mirror')) return '🪞';
  if (name.includes('oven')) return '🔥';
  if (name.includes('dishwasher')) return '🍽️';
  if (name.includes('refrigerator')) return '❄️';
  return '🔌';
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
  animation: hasNotifications ? 'bell 1s ease-in-out infinite' : 'none',
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    boxShadow: `0 0 8px ${theme.palette.error.main}`,
    animation: hasNotifications ? pulseAnimation : 'none',
  }
}));

// Inject the bell animation into the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
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
  '& .MuiPaper-root': {
    width: 320,
    maxHeight: 400,
    backgroundColor: theme.palette.background.paper,
    backdropFilter: 'blur(8px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const NotificationItem = styled(MenuItem)(({ theme, unread }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: unread ? theme.palette.action.hover : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  '& .notification-content': {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },
  '& .notification-title': {
    fontWeight: unread ? 600 : 400,
    color: theme.palette.text.primary,
  },
  '& .notification-time': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  '& .notification-message': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));

const DashboardBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6),
  borderRadius: 32,
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(224, 242, 254, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  overflow: 'hidden',
  marginBottom: theme.spacing(6),
  boxShadow: theme.shadows[8],
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
    opacity: 0.5,
    pointerEvents: 'none',
  },
}));

const WeatherInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const UserGreeting = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  fontSize: 24,
  fontWeight: 'bold',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05) rotate(360deg)',
    boxShadow: theme.shadows[4],
  },
}));

const TimeDisplay = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const EnergyCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 48px rgba(0, 0, 0, 0.4)'
      : '0 12px 48px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButton-root': {
    borderRadius: 12,
    textTransform: 'capitalize',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
}));

const AnimatedTooltip = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.9)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(2),
  borderRadius: 12,
  boxShadow: theme.shadows[4],
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  '& .label': {
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  '& .value': {
    color: theme.palette.primary.main,
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  '& .timestamp': {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
  },
}));

const SummaryCard = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 48px rgba(0, 0, 0, 0.4)'
      : '0 12px 48px rgba(0, 0, 0, 0.2)',
  },
}));

const SummaryHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
  },
}));

const SummaryContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
}));

// Add this after the StyledButtonGroup component
const ViewAllButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
    : 'linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)',
  color: '#fff',
  boxShadow: '0 3px 12px rgba(33, 150, 243, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
  },
}));

// Hardcoded house members for now
const houseMembers = ['Alex', 'Priya', 'Sam'];

// Utility functions for device and room stats
const getDeviceStats = (roomsData) => {
  let total = 0, on = 0;
  Object.values(roomsData).forEach(room => {
    if (room.devices) {
      total += room.devices.length;
      on += room.devices.filter(d => d.status).length;
    }
  });
  return { total, on };
};
const getRoomStats = (roomsData) => {
  let total = Object.keys(roomsData).length;
  let occupied = 0;
  Object.values(roomsData).forEach(room => {
    if (room.devices && room.devices.some(d => d.status)) occupied++;
  });
  return { total, occupied };
};

const Dashboard = ({ isGuest, discoveredDevices = [], roomsData, setRoomsData, username }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Get time-based greeting
  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    if (hour >= 18 && hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  // Get avatar initials
  const getAvatarInitials = (name) => {
    const parts = name.split(' ');
    const first = parts[0] ? parts[0][0] : '';
    const last = parts[1] ? parts[1][0] : '';
    return (first + last).toUpperCase();
  };

  const [energyView, setEnergyView] = React.useState('hourly');
  
  // Memoize energy data to prevent unnecessary recalculations
  const hourlyData = React.useMemo(() => getEnergyDataHourly(), []);
  const dailyData = React.useMemo(() => getEnergyDataDaily(), []);
  const weeklyData = React.useMemo(() => getEnergyDataWeekly(), []);
  const monthlyData = React.useMemo(() => getEnergyDataMonthly(), []);

  // Set initial energy data based on view
  const [energyData, setEnergyData] = React.useState(hourlyData);
  const dailyTotal = React.useMemo(() => calculateDailyTotal(), []);

  // Update energy data when view changes
  React.useEffect(() => {
    const updateData = () => {
      switch(energyView) {
        case 'hourly':
          setEnergyData(getEnergyDataHourly());
          break;
        case 'daily':
          setEnergyData(dailyData);
          break;
        case 'weekly':
          setEnergyData(weeklyData);
          break;
        case 'monthly':
          setEnergyData(monthlyData);
          break;
        default:
          setEnergyData(getEnergyDataHourly());
      }
    };
    
    updateData();
    
    // Update hourly data every hour
    const interval = setInterval(updateData, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [energyView, dailyData, weeklyData, monthlyData]);

  // Update current time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock weather data
  const weatherData = {
    current: {
      temperature: 28, // Celsius
      condition: 'partly cloudy',
      humidity: 65,
      windSpeed: 10, // km/h
      precipitation: 0, // % chance
      uvIndex: 6,
      airQuality: 'good',
    },
    forecast: {
      today: {
        high: 32,
        low: 24,
        condition: 'partly cloudy',
        precipitation: 10,
      },
      tomorrow: {
        high: 30,
        low: 22,
        condition: 'cloudy',
        precipitation: 20,
      },
    },
  };

  const [themeMode, setThemeMode] = React.useState('dark');

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update energy data based on view
  React.useEffect(() => {
    // Update energy data based on current view
    const updateData = () => {
      switch (energyView) {
        case 'hourly':
          setEnergyData(getEnergyDataHourly());
          break;
        case 'daily':
          setEnergyData(getEnergyDataDaily());
          break;
        case 'weekly':
          setEnergyData(getEnergyDataWeekly());
          break;
        case 'monthly':
          setEnergyData(getEnergyDataMonthly());
          break;
        default:
          setEnergyData(getEnergyDataMonthly());
      }
    };

    updateData();
    
    // Set appropriate update interval based on view
    let interval;
    switch (energyView) {
      case 'hourly':
        interval = 60 * 1000; // Update every minute
        break;
      case 'daily':
        interval = 60 * 60 * 1000; // Update every hour
        break;
      case 'weekly':
        interval = 24 * 60 * 60 * 1000; // Update every day
        break;
      case 'monthly':
        interval = 7 * 24 * 60 * 60 * 1000; // Update every week
        break;
    }

    const timer = setInterval(updateData, interval);
    return () => clearInterval(timer);
  }, [energyView]);

  const [unassignedDevices, setUnassignedDevices] = React.useState(discoveredDevices);
  const [assignRoom, setAssignRoom] = React.useState({});

  React.useEffect(() => {
    setUnassignedDevices(discoveredDevices);
  }, [discoveredDevices]);

  React.useEffect(() => {
    // Update energy data based on current view
    const updateData = () => {
      switch (energyView) {
        case 'hourly':
          setEnergyData(getEnergyDataHourly());
          break;
        case 'daily':
          setEnergyData(getEnergyDataDaily());
          break;
        case 'weekly':
          setEnergyData(getEnergyDataWeekly());
          break;
        case 'monthly':
          setEnergyData(getEnergyDataMonthly());
          break;
        default:
          setEnergyData(getEnergyDataMonthly());
      }
    };

    updateData();
    
    // Set appropriate update interval based on view
    let interval;
    switch (energyView) {
      case 'hourly':
        interval = 60 * 1000; // Update every minute
        break;
      case 'daily':
        interval = 60 * 60 * 1000; // Update every hour
        break;
      case 'weekly':
        interval = 24 * 60 * 60 * 1000; // Update every day
        break;
      case 'monthly':
        interval = 7 * 24 * 60 * 60 * 1000; // Update every week
        break;
    }

    const timer = setInterval(updateData, interval);
    return () => clearInterval(timer);
  }, [energyView]);
  const [selectedRoom, setSelectedRoom] = React.useState(null);
  // Initialize roomStates based on roomsData
  const [roomStates, setRoomStates] = React.useState(() => {
    const initialStates = {};
    Object.keys(roomsData).forEach(room => {
      initialStates[room] = false;
    });
    return initialStates;
  });

  // Update roomStates when roomsData changes
  React.useEffect(() => {
    setRoomStates(prevStates => {
      const newStates = { ...prevStates };
      // Add new rooms
      Object.keys(roomsData).forEach(room => {
        if (newStates[room] === undefined) {
          newStates[room] = false;
        }
      });
      // Remove deleted rooms
      Object.keys(newStates).forEach(room => {
        if (!roomsData[room]) {
          delete newStates[room];
        }
      });
      return newStates;
    });
  }, [roomsData]);
  const [editingRoom, setEditingRoom] = React.useState(null);
  const [editRoomValue, setEditRoomValue] = React.useState('');
  // For adding rooms
  const [addRoomDialogOpen, setAddRoomDialogOpen] = React.useState(false);
  const [newRoomName, setNewRoomName] = React.useState('');
  // For adding devices
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = React.useState(false);
  const [addDeviceRoom, setAddDeviceRoom] = React.useState('');
  const [newDeviceName, setNewDeviceName] = React.useState('');

  const handleRoomClick = (room) => {
    setSelectedRoom(selectedRoom === room ? null : room);
  };

  const handleRoomToggle = (room, event) => {
    event.stopPropagation();
    setRoomStates(prev => ({
      ...prev,
      [room]: !prev[room]
    }));
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Rule Triggered',
      message: 'Living Room AC turned ON due to temperature threshold',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unread: true,
      type: 'info'
    },
    {
      id: 2,
      title: 'Energy Alert',
      message: 'High energy consumption detected in Kitchen',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unread: true,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Device Status',
      message: 'Bedroom Light turned OFF automatically',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      unread: false,
      type: 'success'
    }
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  // Add this function to generate notifications for device state changes
  const generateDeviceNotification = (room, device, status) => {
    const newNotification = {
      id: Date.now(),
      title: 'Device Status Change',
      message: `${room} ${device} turned ${status ? 'ON' : 'OFF'}`,
      timestamp: new Date(),
      unread: true,
      type: status ? 'success' : 'info'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    showToast(newNotification.message, newNotification.type);
  };

  // Modify the handleDeviceToggle function to include notifications and API call
  const handleDeviceToggle = async (room, deviceName) => {
    // Define newStatus here so it's accessible throughout the function
    let newStatus;

    setRoomsData(prevRoomsData => {
      const newRoomsData = { ...prevRoomsData };
      const device = newRoomsData[room].devices.find(d => d.name === deviceName);
      newStatus = !device.status; // Assign to the outer scoped newStatus
      
      newRoomsData[room] = { 
        ...newRoomsData[room],
        devices: newRoomsData[room].devices.map(d => 
          d.name === deviceName ? { ...d, status: newStatus } : d
        )
      };
      
      // Generate notification for the state change
      generateDeviceNotification(room, deviceName, newStatus);
      
      return newRoomsData;
    });
    // Node-RED API call removed
  };

  const WelcomeBanner = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundColor: theme.palette.mode === 'dark' ? '#262626' : theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '40px',
    borderRadius: '20px',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    boxShadow: theme.shadows[3],
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
    },
    '&::before': {
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      background: 'linear-gradient(135deg, rgba(45,45,45,0.1), rgba(45,45,45,0.05), rgba(45,45,45,0.1))',
      animation: 'wave 10s ease-in-out infinite',
      transform: 'rotate(45deg)',
      opacity: 0.5,
    },
    '@keyframes wave': {
      '0%': {
        backgroundPosition: '0% 50%',
        opacity: 0.5,
      },
      '50%': {
        backgroundPosition: '100% 50%',
        opacity: 0.3,
      },
      '100%': {
        backgroundPosition: '0% 50%',
        opacity: 0.5,
      },
    },
  }));

  // Add these styled components after the existing styled components
  const GlowingDot = styled('circle')(({ theme }) => ({
    filter: 'drop-shadow(0 0 8px rgba(144, 202, 249, 0.6))',
    transition: 'all 0.3s ease',
    '&:hover': {
      filter: 'drop-shadow(0 0 12px rgba(144, 202, 249, 0.8))',
      transform: 'scale(1.2)',
    },
  }));

  const AnimatedTooltip = styled('div')(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(144, 202, 249, 0.3)',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(144, 202, 249, 0.4)',
      },
      '70%': {
        boxShadow: '0 0 0 10px rgba(144, 202, 249, 0)',
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(144, 202, 249, 0)',
      },
    },
    '& p': {
      margin: '0 0 8px 0',
      '&:last-child': {
        margin: 0,
      },
    },
    '& .label': {
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    '& .value': {
      color: theme.palette.primary.main,
      fontSize: '1.1em',
    },
    '& .timestamp': {
      color: theme.palette.text.secondary,
      fontSize: '0.85em',
      marginTop: '4px',
    },
  }));

  const [expandedSummary, setExpandedSummary] = useState(null);

  const deviceStats = getDeviceStats(roomsData);
  const roomStats = getRoomStats(roomsData);

  // 1. Add state for quick access devices and dialog visibility at the top of the Dashboard component:
  const [quickAccessDevices, setQuickAccessDevices] = React.useState([]);
  const [editQuickAccessOpen, setEditQuickAccessOpen] = React.useState(false);

  // 2. On initial mount, set default quick access devices (first 3 found):
  React.useEffect(() => {
    if (quickAccessDevices.length === 0) {
      const allDevices = Object.entries(roomsData).flatMap(([roomName, roomData]) =>
        (roomData?.devices || [])
          .filter(device => device.name !== 'Only Smart TV')
          .map(device => ({ ...device, room: roomName }))
      );
      setQuickAccessDevices(allDevices.slice(0, 3));
    }
  }, [roomsData]);

  // 1. Add a custom handler for Smart TV in Living Room:
  const handleSmartTVToggle = async (currentStatus) => {
    const newStatus = !currentStatus;
    // Send ON/OFF via WebSocket
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(newStatus ? 'ON' : 'OFF');
      setWsStatus('Sent: ' + (newStatus ? 'ON' : 'OFF'));
    }
    // Optimistically update UI
    setRoomsData(prevRoomsData => {
      const newRoomsData = { ...prevRoomsData };
      const deviceIdx = newRoomsData['Living Room'].devices.findIndex(d => d.name === 'Smart TV');
      if (deviceIdx !== -1) {
        newRoomsData['Living Room'].devices[deviceIdx] = {
          ...newRoomsData['Living Room'].devices[deviceIdx],
          status: newStatus
        };
      }
      return newRoomsData;
    });
  };

  // 1. Add state for the dropdown anchor and open/close logic at the top of the Dashboard component:
  const [occupiedAnchorEl, setOccupiedAnchorEl] = React.useState(null);
  const handleOccupiedClick = (event) => setOccupiedAnchorEl(event.currentTarget);
  const handleOccupiedClose = () => setOccupiedAnchorEl(null);
  const occupiedOpen = Boolean(occupiedAnchorEl);

  // 2. In the Occupied Rooms / Total section, add a Button or IconButton to trigger the dropdown:
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <Typography variant="subtitle2" color="text.secondary">
      Occupied Rooms / Total
    </Typography>
    <Button
      size="small"
      onClick={handleOccupiedClick}
      sx={{
        color: 'secondary.main',
        fontWeight: 800,
        fontSize: '2rem', // Increased font size
        textTransform: 'none',
        p: 0,
        minWidth: 0,
        ml: 1,
        verticalAlign: 'middle',
        lineHeight: 1.1,
        display: 'inline-flex',
        alignItems: 'center',
      }}
      endIcon={<ExpandMoreIcon sx={{ fontSize: '2rem' }} />} // Make icon bigger
    >
      {roomStats.occupied} / {roomStats.total}
    </Button>
    <Menu
      anchorEl={occupiedAnchorEl}
      open={occupiedOpen}
      onClose={handleOccupiedClose}
      PaperProps={{ sx: { minWidth: 200 } }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      {Object.entries(roomsData).map(([roomName, roomData]) => {
        const isOccupied = roomData.devices && roomData.devices.some(d => d.status);
        return (
          <MenuItem key={roomName} dense>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: isOccupied ? 'success.main' : 'grey.500',
                  mr: 1,
                }}
              />
              <Typography variant="body2" sx={{ color: isOccupied ? 'success.main' : 'text.secondary', fontWeight: isOccupied ? 600 : 400 }}>
                {roomName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                {isOccupied ? 'Occupied' : 'Not Occupied'}
              </Typography>
            </Box>
          </MenuItem>
        );
      })}
    </Menu>
  </Box>

  // Add at the top of the Dashboard component (after other useState):
  const [chartTimeRange, setChartTimeRange] = React.useState('24hrs');

  // Update the energyData to filter based on chartTimeRange
  const filteredEnergyData = React.useMemo(() => {
    if (energyView !== 'hourly') return energyData;
    if (chartTimeRange === '12hrs') {
      return energyData.slice(-12);
    } else if (chartTimeRange === '24hrs') {
      return energyData;
    } else if (chartTimeRange === '7days') {
      // For 7 days, use dailyData if available
      return dailyData;
    }
    return energyData;
  }, [energyData, chartTimeRange, energyView, dailyData]);

  // Add at the top of the Dashboard component (after other useState):
  const [wsStatus, setWsStatus] = React.useState('Connecting...');
  const wsRef = React.useRef(null);

  React.useEffect(() => {
    // Only connect once on mount
    const ws = new window.WebSocket(`ws://${window.location.hostname}:1880/ws/switch`);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus('✅ Connected to Node-RED');
    ws.onerror = () => setWsStatus('❌ WebSocket Error');
    ws.onclose = () => setWsStatus('🔌 WebSocket Disconnected');
    ws.onmessage = (msg) => {
      const payload = msg.data;
      setRoomsData(prevRoomsData => {
        const newRoomsData = { ...prevRoomsData };
        const deviceIdx = newRoomsData['Living Room'].devices.findIndex(d => d.name === 'Smart TV');
        if (deviceIdx !== -1) {
          newRoomsData['Living Room'].devices[deviceIdx] = {
            ...newRoomsData['Living Room'].devices[deviceIdx],
            status: payload === 'ON'
          };
        }
        return newRoomsData;
      });
      setWsStatus('State: ' + payload);
    };
    return () => ws.close();
  }, [setRoomsData]);

  const getRoomIcon = (roomName) => {
    const name = roomName.toLowerCase();
    if (name.includes('living')) return <LivingIcon />;
    if (name.includes('bedroom')) return <BedIcon />;
    if (name.includes('kitchen')) return <KitchenIcon />;
    if (name.includes('bathroom')) return <BathtubIcon />;
    return <PowerSettingsNewIcon />;
  }

  return (
    <Box sx={{ pt: { xs: 1, sm: 2, md: 3 }, pr: { xs: 1, sm: 2, md: 3 }, pb: { xs: 1, sm: 2, md: 3 }, pl: 0 }}>
      <DashboardBanner
        sx={(theme) => ({
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(90deg, #e3f2fd 0%, #ffffff 100%)',
          color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.text.primary,
          borderRadius: 4,
          p: { xs: 2, sm: 3, md: 4 },
              display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
          gap: { xs: 2, md: 4 },
          position: 'relative',
          overflow: 'hidden',
        })}
      >
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
                  <Typography
            variant="h2"
            sx={(theme) => ({
              fontWeight: 800,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            })}
                  >
                  {getTimeGreeting()}
                  </Typography>
          <Typography
            variant="subtitle1"
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
              fontWeight: 400,
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
            })}
          >
                    Welcome to your Smart Home Dashboard
                  </Typography>
                </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box
            sx={(theme) => ({
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)',
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
              minWidth: 120,
              textAlign: 'center',
              border: `1.5px solid ${theme.palette.primary.main}`,
              fontFamily: "'Orbitron', monospace",
            })}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'inherit', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography variant="subtitle2" sx={(theme) => ({ color: theme.palette.primary.main, fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' } })}>
              {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
            <Typography variant="caption" sx={(theme) => ({ color: theme.palette.text.secondary, fontSize: { xs: '0.8rem', sm: '0.9rem' } })}>
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={(theme) => ({ color: theme.palette.primary.light, fontWeight: 700, mb: 1, fontSize: { xs: '1rem', sm: '1.2rem' } })}>
                  House Members
                    </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {houseMembers.map((member) => (
                  <Chip 
                    key={member} 
                    label={member} 
                  avatar={<Avatar>{member[0]}</Avatar>}
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(33,150,243,0.1)' : 'rgba(33,150,243,0.15)',
                    color: theme.palette.primary.main,
                      fontWeight: 600, 
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    px: 2,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: theme.palette.primary.main, color: '#fff' },
                  })}
                  />
                ))}
              <IconButton color="primary" sx={{ mt: 1 }}>
                <AddIcon />
              </IconButton>
                  </Box>
          </Box>
        </Box>
      </DashboardBanner>

      {/* Two-column Layout */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        {/* Weather Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#23272a' : '#f5f7fa',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Current Weather <span style={{ color: '#90caf9' }}>({weatherData.current.condition})</span>
              </Typography>
            <Box
                      sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Weather metrics here */}
                <WeatherCard>
                  <WbSunnyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6">{weatherData.current.temperature}°C</Typography>
                <Typography variant="caption" color="text.secondary">Temperature</Typography>
                </WeatherCard>
                <WeatherCard>
                  <WaterDropIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6">{weatherData.current.humidity}%</Typography>
                <Typography variant="caption" color="text.secondary">Humidity</Typography>
                </WeatherCard>
                <WeatherCard>
                  <WindIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6">{weatherData.current.windSpeed} km/h</Typography>
                <Typography variant="caption" color="text.secondary">Wind Speed</Typography>
                </WeatherCard>
                <WeatherCard>
                  <UmbrellaIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6">{weatherData.current.precipitation}%</Typography>
                <Typography variant="caption" color="text.secondary">Precipitation</Typography>
                </WeatherCard>
              </Box>
          </Paper>
        </Grid>
        
        {/* Quick Access Devices Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#23272a' : '#f5f7fa',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Quick Access Devices
              </Typography>
              <Button size="small" variant="outlined" onClick={() => setEditQuickAccessOpen(true)}>
                Edit
              </Button>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
                gap: 2,
              }}
            >
              {quickAccessDevices.filter(device => device.name !== 'Only Smart TV').map((device, idx) => (
                  <DeviceCard key={device.name} status={device.status}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <IconToggle
                        status={device.status}
                        disabled={isGuest}
                        onClick={() => !isGuest && handleDeviceToggle(device.room, device.name)}
                      sx={{ fontSize: '1.5rem', mb: 1 }}
                      >
                        {getDeviceEmoji(device.name)}
                      </IconToggle>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {device.name}
                    </Typography>
                    </Box>
                  </DeviceCard>
                ))}
              </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Room Controls and Energy Consumption */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Room Controls
              </Typography>
              <Grid container spacing={2}>
                {Object.keys(roomsData).map((room) => (
                  <Grid item xs={12} md={6} key={room}>
                    <RoomSection>
                      <RoomHeader onClick={() => handleRoomClick(room)}>
                        <Box className="room-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {getRoomIcon(room)}
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{room}</Typography>
                          </Box>
                          <Box
                            sx={(theme) => ({
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              background: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.02)',
                              borderRadius: 1,
                              px: 1.5,
                              py: 0.5,
                              border: `1px solid ${theme.palette.divider}`,
                              backdropFilter: 'blur(5px)',
                            })}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={(theme) => ({ color: theme.palette.success.main })}
                            >
                              {roomsData[room]?.devices?.filter(d => d.name !== 'Only Smart TV' && d.status).length || 0} ON
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={(theme) => ({ color: theme.palette.error.main })}
                            >
                              {roomsData[room]?.devices?.filter(d => d.name !== 'Only Smart TV' && !d.status).length || 0} OFF
                            </Typography>
                          </Box>
                        </Box>
                        {selectedRoom === room ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </RoomHeader>
                      <Collapse in={selectedRoom === room}>
                        <Box sx={{ p: 2 }}>
                          <RoomSummary>
                            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                              {roomsData[room]?.devices?.filter(d => d.name !== 'Only Smart TV' && d.status).length || 0} ON
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                              {roomsData[room]?.devices?.filter(d => d.name !== 'Only Smart TV' && !d.status).length || 0} OFF
                            </Typography>
                          </RoomSummary>
                          <Box sx={{ mt: 2 }}>
                            {(roomsData[room]?.devices || []).filter(device => device.name !== 'Only Smart TV').map((device, idx) => (
                              <DeviceCard key={device.name} status={device.status}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <DeviceStatusBadge status={device.status} />
                                  <DeviceIcon sx={{ color: device.status ? 'success.main' : 'error.main' }}>
                                    {getDeviceIcon(device.name)}
                                  </DeviceIcon>
                                  <Typography variant="subtitle1" sx={{ flex: 1 }}>{device.name}</Typography>
                                  {room === 'Living Room' && device.name === 'Smart TV' ? (
                                    <>
                                      <IconToggle
                                        status={device.status}
                                        disabled={isGuest}
                                        onClick={() => !isGuest && handleSmartTVToggle(device.status)}
                                        sx={{ fontSize: '1.5rem' }}
                                      >
                                        {getDeviceEmoji(device.name)}
                                      </IconToggle>
                                    </>
                                  ) : (
                                  <IconToggle
                                    status={device.status}
                                    disabled={isGuest}
                                    onClick={() => !isGuest && handleDeviceToggle(room, device.name)}
                                    sx={{ fontSize: '1.5rem' }}
                                  >
                                    {getDeviceEmoji(device.name)}
                                  </IconToggle>
                                  )}
                                </Box>
                              </DeviceCard>
                            ))}
                          </Box>
                        </Box>
                      </Collapse>
                    </RoomSection>
                  </Grid>
                ))}
              </Grid>
            </StyledPaper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper>
              {/* New Block: Device and Room Stats */}
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 3,
                mb: 4,
                p: 3,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: 2,
              }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Devices ON / Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {deviceStats.on} / {deviceStats.total}
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Occupied Rooms / Total
                  </Typography>
                  <Button
                    size="small"
                    onClick={handleOccupiedClick}
                    sx={{
                      color: 'secondary.main',
                      fontWeight: 800,
                      fontSize: '2rem', // Increased font size
                      textTransform: 'none',
                      p: 0,
                      minWidth: 0,
                      ml: 1,
                      verticalAlign: 'middle',
                      lineHeight: 1.1,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                    endIcon={<ExpandMoreIcon sx={{ fontSize: '2rem' }} />} // Make icon bigger
                  >
                    {roomStats.occupied} / {roomStats.total}
                  </Button>
                  <Menu
                    anchorEl={occupiedAnchorEl}
                    open={occupiedOpen}
                    onClose={handleOccupiedClose}
                    PaperProps={{ sx: { minWidth: 200 } }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    {Object.entries(roomsData).map(([roomName, roomData]) => {
                      const isOccupied = roomData.devices && roomData.devices.some(d => d.status);
                      return (
                        <MenuItem key={roomName} dense>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: isOccupied ? 'success.main' : 'grey.500',
                                mr: 1,
                              }}
                            />
                            <Typography variant="body2" sx={{ color: isOccupied ? 'success.main' : 'text.secondary', fontWeight: isOccupied ? 600 : 400 }}>
                              {roomName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                              {isOccupied ? 'Occupied' : 'Not Occupied'}
                  </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ElectricBoltIcon color="primary" />
                  Energy Consumption
                </Typography>
                <StyledButtonGroup sx={{ mb: 2 }}>
                  {['hourly', 'daily', 'weekly', 'monthly'].map((view) => (
                    <Button
                      key={view}
                      variant={energyView === view ? 'contained' : 'outlined'}
                      onClick={() => setEnergyView(view)}
                      startIcon={
                        view === 'hourly' ? <AccessTimeIcon /> :
                        view === 'daily' ? <CalendarTodayIcon /> :
                        view === 'weekly' ? <DateRangeIcon /> :
                        <CalendarMonthIcon />
                      }
                    >
                      {view}
                    </Button>
                  ))}
                </StyledButtonGroup>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box
                    sx={theme => ({
                      height: { xs: '50vh', sm: '45vh', md: '60vh' },
                      minHeight: 180,
                      position: 'relative',
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(20,22,30,0.85)' : 'rgba(255,255,255,0.85)',
                      borderRadius: 4,
                      boxShadow: '0 4px 32px 0 rgba(255,140,0,0.08)',
                      p: { xs: 1, sm: 2, md: 3 }
                    })}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart 
                        data={filteredEnergyData}
                        margin={{ top: 30, right: 40, left: 20, bottom: 30 }}
                      >
                        <defs>
                          <linearGradient id="vibrantGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ffe259" />
                            <stop offset="50%" stopColor="#ffa751" />
                            <stop offset="100%" stopColor="#ff6a00" />
                          </linearGradient>
                          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <RechartsCartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <RechartsXAxis 
                          dataKey="label"
                          stroke="#ffe259"
                          tick={{ fill: '#40a9ff', fontWeight: 'bold', fontSize: 15, fontFamily: 'Roboto, sans-serif' }}
                          tickLine={{ stroke: '#ffa751', strokeWidth: 2 }}
                          axisLine={{ stroke: '#ffa751', strokeWidth: 2 }}
                          label={{ value: '', fontWeight: 'bold', fontSize: 17, position: 'insideBottom', fill: '#ffe259' }}
                          tickFormatter={label => {
                            // Try to parse as date, fallback to label
                            const date = new Date(label);
                            if (!isNaN(date.getTime())) {
                              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                            }
                            // If label is already time, just return it
                            return label;
                          }}
                        />
                        <RechartsYAxis 
                          label={{ value: 'Consumption (kW)', angle: -90, position: 'insideLeft', fill: '#ffe259', fontWeight: 'bold', fontSize: 17 }}
                          domain={energyView === 'hourly' ? [0, 2.5] : energyView === 'daily' ? [0, 45] : energyView === 'weekly' ? [0, 250] : [0, 1200]}
                          tickCount={6}
                          tickFormatter={value => energyView === 'hourly' ? value.toFixed(1) : value % 1 === 0 ? value.toString() : value.toFixed(1)}
                          stroke="#ffe259"
                          tick={{ fill: '#40a9ff', fontWeight: 'bold', fontSize: 15, fontFamily: 'Roboto, sans-serif' }}
                          tickLine={{ stroke: '#ffa751', strokeWidth: 2 }}
                          axisLine={{ stroke: '#ffa751', strokeWidth: 2 }}
                        />
                        {/* Dashed average line */}
                        <RechartsLine
                          type="monotone"
                          dataKey={() => filteredEnergyData.reduce((sum, d) => sum + d.consumption, 0) / filteredEnergyData.length}
                          stroke="#fff"
                          strokeDasharray="6 6"
                          dot={false}
                          isAnimationActive={false}
                          strokeWidth={2}
                          opacity={0.4}
                        />
                        {/* Main vibrant line with glow */}
                        <RechartsLine 
                          type="monotone" 
                          dataKey="consumption" 
                          stroke="url(#vibrantGradient)"
                          strokeWidth={5}
                          dot={({ cx, cy, index }) => {
                            // Highlight max/min points
                            const values = filteredEnergyData.map(d => d.consumption);
                            const max = Math.max(...values);
                            const min = Math.min(...values);
                            const isMax = filteredEnergyData[index].consumption === max;
                            const isMin = filteredEnergyData[index].consumption === min;
                            if (isMax || isMin) {
                              return (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={10}
                                  fill={isMax ? '#ffe259' : '#ff6a00'}
                                  stroke="#fff"
                                  strokeWidth={3}
                                  filter="url(#glow)"
                                />
                              );
                            }
                            return null;
                          }}
                          activeDot={{
                            r: 10,
                            fill: '#fff',
                            stroke: '#ffa751',
                            strokeWidth: 4,
                            filter: 'url(#glow)'
                          }}
                          filter="url(#glow)"
                          animationDuration={1800}
                          animationEasing="ease-in-out"
                        />
                        {/* Data labels for max/min points */}
                        {filteredEnergyData.length > 0 && (() => {
                          const values = filteredEnergyData.map(d => d.consumption);
                          const max = Math.max(...values);
                          const min = Math.min(...values);
                          return [
                            <RechartsTooltip key="tooltip"
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const consumption = payload[0]?.payload?.consumption ?? payload[0]?.value;
                                  // Calculate average for the current filtered data
                                  const avg = filteredEnergyData.reduce((sum, d) => sum + d.consumption, 0) / filteredEnergyData.length;
                                  return (
                                    <div style={{
                                      background: '#181c24',
                                      border: '2px solid #ffa751',
                                      borderRadius: 16,
                                      padding: 18,
                                      color: '#ffe259',
                                      fontWeight: 700,
                                      fontSize: 18,
                                      boxShadow: '0 2px 16px #ff6a00',
                                      minWidth: 130,
                                      textAlign: 'center',
                                    }}>
                                      <div style={{ color: '#ffe259', fontWeight: 800, fontSize: 22, marginBottom: 6 }}>{label}</div>
                                      <div style={{ color: '#40a9ff', fontWeight: 700, fontSize: 24 }}>
                                        {consumption?.toFixed(2)} kW
                                      </div>
                                      <div style={{ color: '#ffe259', fontWeight: 500, fontSize: 15, marginTop: 8 }}>
                                        Avg: {avg.toFixed(2)} kW
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                              cursor={{ stroke: '#ffa751', strokeWidth: 2, strokeDasharray: '5 5' }}
                            />
                          ];
                        })()}
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    {/* Today's Summary */}
                    <SummaryCard>
                      <SummaryHeader onClick={() => setExpandedSummary(expandedSummary === 'today' ? null : 'today')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TodayIcon color="primary" />
                          <Typography variant="h6">Today's Energy Summary</Typography>
                        </Box>
                        <IconButton size="small">
                          {expandedSummary === 'today' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </SummaryHeader>
                      <Collapse in={expandedSummary === 'today'}>
                        <SummaryContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h4" color="primary" sx={{ flexGrow: 1 }}>
                              {hourlyData.reduce((sum, hour) => sum + hour.consumption, 0).toFixed(1)} kW
                            </Typography>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h5" color="error">
                                ₹{(
                                  hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 8
                                ).toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                @ ₹8/kWh
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(144, 202, 249, 0.1)' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Today's Peak: {(
                                Math.max(...hourlyData.map(h => h.consumption))
                              ).toFixed(1)} kW
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Today's Average: {(
                                hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) / 24
                              ).toFixed(1)} kW
                            </Typography>
                          </Box>
                        </SummaryContent>
                      </Collapse>
                    </SummaryCard>

                    {/* Yesterday's Summary */}
                    <SummaryCard>
                      <SummaryHeader onClick={() => setExpandedSummary(expandedSummary === 'yesterday' ? null : 'yesterday')}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HistoryIcon color="primary" />
                          <Typography variant="h6">Yesterday's Energy Summary</Typography>
                        </Box>
                        <IconButton size="small">
                          {expandedSummary === 'yesterday' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </SummaryHeader>
                      <Collapse in={expandedSummary === 'yesterday'}>
                        <SummaryContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h4" color="primary" sx={{ flexGrow: 1 }}>
                              {(hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85).toFixed(1)} kW
                            </Typography>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h5" color="error">
                                ₹{((hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) * 8).toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                @ ₹8/kWh
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(Date.now() - 86400000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(144, 202, 249, 0.1)' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Yesterday's Peak: {(Math.max(...hourlyData.map(h => h.consumption)) * 0.9).toFixed(1)} kW
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Yesterday's Average: {((hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) / 24) * 0.85).toFixed(1)} kW
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              color={hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) > 
                                (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) ? 'error' : 'success.main'}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5,
                                mt: 1,
                                fontWeight: 600,
                              }}
                            >
                              {hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) > 
                              (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) ? 
                              <TrendingUpIcon color="error" /> : 
                              <TrendingDownIcon color="success" />}
                              {hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) > 
                              (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) ? 
                              ((hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) / (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) * 100) - 100).toFixed(1) + 
                              '% higher than yesterday' : 
                              (100 - (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) / (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) * 100)).toFixed(1) + 
                              '% lower than yesterday'}
                            </Typography>
                          </Box>
                        </SummaryContent>
                      </Collapse>
                    </SummaryCard>
                  </Stack>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <ViewAllButton
                      variant="contained"
                      onClick={() => navigate('/energy-details')}
                      startIcon={<AnalyticsIcon />}
                    >
                      View All Energy Details
                    </ViewAllButton>
                  </Box>
                </Grid>
              </Grid>
            </StyledPaper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Temperature Display */}
      <Grid item xs={12} md={6}>
        <TemperatureDisplay roomsData={roomsData} selectedRoom={selectedRoom} setRoomsData={setRoomsData} />
      </Grid>

    {/* Add Room Dialog */}
    <Dialog open={addRoomDialogOpen} onClose={() => setAddRoomDialogOpen(false)}>
      <DialogTitle>Add New Room</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Room Name"
          fullWidth
          value={newRoomName}
          onChange={e => setNewRoomName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAddRoomDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={() => {
            if (newRoomName.trim() && !roomsData[newRoomName.trim()]) {
              setRoomsData(prev => ({ ...prev, [newRoomName.trim()]: { devices: [] } }));
              setRoomStates(prev => ({ ...prev, [newRoomName.trim()]: false }));
              setAddRoomDialogOpen(false);
              setNewRoomName('');
            }
          }}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
    {/* Add Device Dialog */}
    <Dialog open={addDeviceDialogOpen} onClose={() => setAddDeviceDialogOpen(false)}>
      <DialogTitle>Add Device to {addDeviceRoom}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Device Name"
          fullWidth
          value={newDeviceName}
          onChange={e => setNewDeviceName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAddDeviceDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={() => {
            if (newDeviceName.trim()) {
              setRoomsData(prev => {
                const newRoomsData = { ...prev };
                newRoomsData[addDeviceRoom] = {
                  ...newRoomsData[addDeviceRoom],
                  devices: [
                    ...(newRoomsData[addDeviceRoom]?.devices || []),
                    { name: newDeviceName.trim(), status: false }
                  ]
                };
                return newRoomsData;
              });
              setAddDeviceDialogOpen(false);
              setNewDeviceName('');
            }
          }}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>

    {/* Notification Bell and Menu */}
    <Box sx={{ 
      position: 'absolute', 
      top: 20, 
      right: 20, 
      zIndex: 1000 
    }}>
      <NotificationBell
        hasNotifications={notifications.some(n => n.unread)}
        onClick={handleNotificationClick}
        size="large"
      >
        <Badge 
          badgeContent={notifications.filter(n => n.unread).length} 
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </NotificationBell>
      
      <NotificationMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleNotificationClose}
        TransitionComponent={Fade}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            unread={notification.unread}
            onClick={() => handleNotificationRead(notification.id)}
          >
            <Box className="notification-content">
              <Typography className="notification-title">
                {notification.title}
              </Typography>
              <Typography className="notification-message">
                {notification.message}
              </Typography>
              <Typography className="notification-time">
                {notification.timestamp.toLocaleTimeString()}
              </Typography>
            </Box>
          </NotificationItem>
        ))}
      </NotificationMenu>
      
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={handleToastClose} 
          severity={toast.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            backdropFilter: 'blur(8px)',
            '& .MuiAlert-icon': {
              animation: 'pulse 2s infinite',
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>

    {/* Add a dialog for editing quick access devices at the bottom of the component: */}
    <Dialog
      open={editQuickAccessOpen}
      onClose={() => setEditQuickAccessOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: { xs: 2, sm: 4 },
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#23272a' : '#f5f7fa',
          boxShadow: 8,
          minWidth: { xs: '95vw', sm: 480 },
          maxWidth: 600,
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
        Edit Quick Access Devices
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, color: 'text.secondary', fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
          Select devices to show in Quick Access:
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {Object.entries(roomsData).flatMap(([roomName, roomData]) =>
            (roomData?.devices || []).filter(device => device.name !== 'Only Smart TV').map(device => {
              const selected = quickAccessDevices.some(
                d => d.name === device.name && d.room === roomName
              );
              return (
                <Box
                  key={roomName + device.name}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    borderRadius: 3,
                    minHeight: 90,
                    boxShadow: selected ? 4 : 1,
                    bgcolor: selected
                      ? (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(33,150,243,0.15)'
                        : 'rgba(33,150,243,0.08)'
                      : (theme) => theme.palette.background.paper,
                    border: selected ? '2px solid' : '1px solid',
                    borderColor: selected ? 'primary.main' : 'divider',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                      borderColor: 'primary.main',
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                  }}
                  onClick={() => {
                    if (selected) {
                      setQuickAccessDevices(prev => prev.filter(d => !(d.name === device.name && d.room === roomName)));
                    } else {
                      setQuickAccessDevices(prev => [...prev, { ...device, room: roomName }]);
                    }
                  }}
                >
                  <Checkbox
                    checked={selected}
                    color="primary"
                    sx={{
                      mb: 1,
                      '& .MuiSvgIcon-root': { fontSize: 28 },
                    }}
                    onChange={() => {}} // Prevents double toggle on click, handled by parent
                    tabIndex={-1}
                    disableRipple
                  />
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>
                    {device.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.95rem', textAlign: 'center' }}>
                    {roomName}
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setEditQuickAccessOpen(false)}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.2rem' },
            boxShadow: 2,
            py: 1.5,
            letterSpacing: 1,
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
};

export default Dashboard;
