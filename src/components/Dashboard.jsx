import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Paper, Avatar, Collapse, IconButton, Select, Divider, Switch, Slide, Fade, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
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
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getFirestore, doc, collection, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase/config';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Tooltip from '@mui/material/Tooltip';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import KitchenIcon from '@mui/icons-material/Kitchen';
import RefreshIcon from '@mui/icons-material/Refresh';

// Backend URLs
const backendUrl = "https://app-web-backend-5dd0.onrender.com";
const wsUrl = "wss://app-web-backend-5dd0.onrender.com";

// Recharts components
const RechartsLineChart = LineChart;
const RechartsLine = Line;
const RechartsXAxis = XAxis;
const RechartsYAxis = YAxis;
const RechartsCartesianGrid = CartesianGrid;

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

const RoomControlsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2, 1, 2),
  borderBottom: `1.5px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
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
  const name = deviceName.toLowerCase();
  if (name.includes('tv')) return <TvIcon sx={{ color: '#4fc3f7', fontSize: 36 }} />;
  if (name.includes('ac') || name.includes('air')) return <AcUnitIcon sx={{ color: '#29b6f6', fontSize: 36 }} />;
  if (name.includes('light')) return <LightbulbIcon sx={{ color: '#fff176', fontSize: 36 }} />;
  if (name.includes('fan')) return <WindIcon sx={{ color: '#81d4fa', fontSize: 36 }} />;
  if (name.includes('water')) return <WaterDropIcon sx={{ color: '#4fc3f7', fontSize: 36 }} />;
  if (name.includes('heater')) return <WhatshotIcon sx={{ color: '#ff7043', fontSize: 36 }} />;
  if (name.includes('oven')) return <WhatshotIcon sx={{ color: '#ffa726', fontSize: 36 }} />;
  if (name.includes('dishwasher')) return <KitchenIcon sx={{ color: '#90caf9', fontSize: 36 }} />;
  if (name.includes('refrigerator') || name.includes('fridge')) return <KitchenIcon sx={{ color: '#b3e5fc', fontSize: 36 }} />;
  if (name.includes('mirror')) return <span style={{ fontSize: 36 }}>🪞</span>;
  if (name.includes('oven')) return <span style={{ fontSize: 36 }}>🔥</span>;
  return <PowerSettingsNewIcon sx={{ color: '#bdbdbd', fontSize: 36 }} />;
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

// Base card style for all dashboard widgets
const BaseDashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 34, 44, 0.85)'
    : 'rgba(245, 247, 250, 0.95)',
  boxShadow: theme.shadows[6],
  border: `1.5px solid ${theme.palette.mode === 'dark' ? 'rgba(80,200,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
  backdropFilter: 'blur(8px)',
  transition: 'box-shadow 0.2s, border 0.2s, transform 0.2s',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  '&:hover': {
    boxShadow: theme.shadows[12],
    border: `1.5px solid ${theme.palette.primary.main}`,
    transform: 'scale(1.018)',
    zIndex: 2,
  },
}));

// Typography style helpers
const CardHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.2rem',
  marginBottom: theme.spacing(1.5),
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
  letterSpacing: 0.5,
}));
const CardBody = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '1rem',
  color: theme.palette.text.secondary,
}));

// Room Controls UI enhancements
const RoomCard = styled(Box)(({ theme }) => ({
  borderRadius: 18,
  background: theme.palette.mode === 'dark'
    ? 'rgba(36, 40, 50, 0.92)'
    : 'rgba(245, 247, 250, 0.97)',
  boxShadow: theme.shadows[6],
  border: `1.5px solid ${theme.palette.mode === 'dark' ? 'rgba(80,200,255,0.10)' : 'rgba(0,0,0,0.06)'}`,
  backdropFilter: 'blur(10px)',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2.5, 2, 2, 2),
  transition: 'box-shadow 0.2s, border 0.2s',
}));
const RoomName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.15rem',
  letterSpacing: 0.5,
  color: theme.palette.primary.light,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
const RoomAccentDot = styled('span')(({ theme }) => ({
  display: 'inline-block',
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: theme.palette.primary.main,
  boxShadow: `0 0 8px 2px ${theme.palette.primary.main}55`,
}));
const DeviceList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
}));
const DeviceRow = styled(Box)(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 14,
  background: theme.palette.mode === 'dark'
    ? 'rgba(44, 48, 60, 0.96)'
    : 'rgba(255,255,255,0.98)',
  border: `1.5px solid ${status ? theme.palette.success.main : theme.palette.divider}`,
  boxShadow: status ? `0 2px 12px 0 ${theme.palette.success.main}22` : theme.shadows[1],
  padding: theme.spacing(1.5, 2),
  position: 'relative',
  transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s',
  '&:hover': {
    boxShadow: status
      ? `0 4px 24px 0 ${theme.palette.success.main}55`
      : theme.shadows[6],
    border: `1.5px solid ${theme.palette.primary.main}`,
    transform: 'scale(1.025)',
    zIndex: 2,
  },
}));
const DeviceRowName = styled(Typography)(({ theme, status }) => ({
  fontWeight: 500,
  fontSize: '1.05rem',
  color: status ? '#008000' : theme.palette.error.main,
  flex: 1,
  marginLeft: theme.spacing(1),
}));
const DeviceRowIcon = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'rgba(80,200,255,0.10)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
}));
const DeviceRowSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#39FF14',
    '& + .MuiSwitch-track': {
      background: 'linear-gradient(90deg, #39FF14 0%, #1de782 100%)',
      opacity: 1,
    },
  },
  '& .MuiSwitch-switchBase:not(.Mui-checked)': {
    color: theme.palette.error.main,
    '& + .MuiSwitch-track': {
      background: 'linear-gradient(90deg, #e53935 0%, #ff1744 100%)',
      opacity: 1,
    },
  },
  '& .MuiSwitch-thumb': {
    background: '#fff',
  },
  '& .MuiSwitch-track': {
    borderRadius: 20,
    transition: 'background 0.3s',
  },
}));

// Room Controls Device Card Layout
const RoomBlock = styled(Box)(({ theme }) => ({
  borderRadius: 18,
  background: theme.palette.mode === 'dark' ? 'rgba(36, 40, 50, 0.92)' : 'rgba(245, 247, 250, 0.97)',
  boxShadow: theme.shadows[6],
  border: `1.5px solid ${theme.palette.mode === 'dark' ? 'rgba(80,200,255,0.10)' : 'rgba(0,0,0,0.06)'}`,
  backdropFilter: 'blur(10px)',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2.5, 2, 2, 2),
  transition: 'box-shadow 0.2s, border 0.2s',
}));
const RoomHeaderCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2, 1, 2),
  borderBottom: `1.5px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
}));
const RoomHeaderInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
const RoomHeaderName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.18rem',
  letterSpacing: 0.5,
  color: theme.palette.primary.light,
}));
const RoomHeaderStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: '1.05rem',
}));
const DeviceGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
}));
const RoomDeviceCard = styled(Box)(({ theme, status }) => ({
  borderRadius: 14,
  background: theme.palette.mode === 'dark' ? 'rgba(44, 48, 60, 0.96)' : 'rgba(255,255,255,0.98)',
  border: `1.5px solid ${status ? '#008000' : theme.palette.error.main}`,
  boxShadow: status ? `0 2px 12px 0 #00800022` : theme.shadows[1],
  padding: theme.spacing(2, 2, 2, 2),
  display: 'flex',
  flexDirection: 'row', // changed from column
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s',
  cursor: 'pointer',
  gap: theme.spacing(2), // add spacing between items
  '&:hover': {
    boxShadow: status ? `0 4px 24px 0 #00800055` : theme.shadows[6],
    border: `1.5px solid ${theme.palette.primary.main}`,
    transform: 'scale(1.035)',
    zIndex: 2,
  },
}));
const DeviceIconCircle = styled(Box)(({ theme, status }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: status ? '#008000' : '#e53935',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 28,
  marginBottom: theme.spacing(1),
  transition: 'background 0.2s',
}));
const DeviceCardName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '1.05rem',
  color: theme.palette.text.primary,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

// 1. Update styled components for glassy, modern look
const GlassyCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(36, 40, 50, 0.92)'
    : 'rgba(245, 247, 250, 0.97)',
  boxShadow: theme.shadows[6],
  border: `1.5px solid ${theme.palette.mode === 'dark' ? 'rgba(80,200,255,0.10)' : 'rgba(0,0,0,0.06)'}`,
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(3),
  transition: 'box-shadow 0.2s, border 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[8],
    border: `1.5px solid ${theme.palette.primary.main}`,
  },
}));

const RoomDeviceCardsWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2.2),
  padding: theme.spacing(1, 0, 2, 0),
}));

const HorizontalDeviceCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 22,
  background: theme.palette.mode === 'dark' ? '#26282f' : '#f7f9fc',
  border: `1.5px solid ${theme.palette.mode === 'dark' ? 'rgba(80,200,130,0.18)' : '#d1d5db'}`,
  padding: theme.spacing(0, 2.5),
  minHeight: 64,
  height: 64,
  minWidth: 0,
  maxWidth: 360,
  width: '95%',
  margin: '0 auto',
  boxShadow: 'none',
  gap: theme.spacing(2),
  transition: 'background 0.2s, border 0.2s',
}));

const Dashboard = ({ isGuest, discoveredDevices = [], roomsData, setRoomsData, username }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Firebase and WebSocket state
  const deviceId = localStorage.getItem("deviceId");
  const updateHomeId = localStorage.getItem("updateHomeId");
  const originalHomeId = localStorage.getItem("originalHomeId");
  const currentUsername = localStorage.getItem("username") || username || "User";

  const [relays, setRelays] = useState({});
  const [relayStates, setRelayStates] = useState({});
  const [allRelays, setAllRelays] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkedRelays, setCheckedRelays] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [roomOptionsRoom, setRoomOptionsRoom] = useState("");

  const switchRefs = useRef({});
  const userInitiatedMap = useRef({});
  const latestRelayStates = useRef({});
  const webSocketRef = useRef(null);

  const [quickAccessRelays, setQuickAccessRelays] = useState(() => {
    const saved = localStorage.getItem('quickAccessRelays');
    return saved ? JSON.parse(saved) : [];
  });
  const [qaDialogOpen, setQaDialogOpen] = useState(false);
  const [qaDialogRelay, setQaDialogRelay] = useState(null);
  const [qaDialogAction, setQaDialogAction] = useState('add'); // 'add' or 'remove'

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDeviceRoom, setEditDeviceRoom] = useState(null);
  const [editDeviceName, setEditDeviceName] = useState('');
  const [editDeviceOrigName, setEditDeviceOrigName] = useState('');
  const [editDeviceQuick, setEditDeviceQuick] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);

  // Add at the top level of the Dashboard component:
  const [collapsedRooms, setCollapsedRooms] = useState({});

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

  // Firebase and WebSocket functions
  const fetchRelayData = async () => {
    try {
      const res = await fetch(`${backendUrl}/relays/${deviceId}?originalHomeId=${originalHomeId}`);
      const relaysArray = await res.json();
      const statesRes = await fetch(`${backendUrl}/states/${deviceId}`);
      const statesMap = await statesRes.json();
      
      // Store current states globally
      Object.entries(statesMap).forEach(([relay, state]) => {
        latestRelayStates.current[relay] = state;
      });
      
      setRelayStates(statesMap);
      setAllRelays(relaysArray.map(r => r.relay));
    } catch (err) {
      console.error("Error fetching relay data:", err);
    }
  };

  const fetchRoomMap = async () => {
    const roomMap = {};
    const snapshot = await getDocs(collection(db, "relays", deviceId, "relays"));
    snapshot.forEach(doc => {
      roomMap[doc.id] = doc.data().relays || [];
    });
    setRelays(roomMap);
  };

  const sendCommand = async (relay, command) => {
    try {
      await fetch(`${backendUrl}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, updateHomeId, relay, command })
      });
    } catch (err) {
      console.error("Send command failed:", err);
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
    
    setRelayStates(prev => ({ ...prev, [relayName]: value }));

    // Update switch ref if it exists and user didn't initiate the change
    for (const room in relays) {
      const key = `${room}_${relayName}`;
      if (switchRefs.current[key] && !userInitiatedMap.current[key]) {
        switchRefs.current[key].checked = isOn;
      }
    }
  };

  const openRoomDialog = (roomName = "") => {
    setSelectedRoom(roomName);
    const currentRelays = relays[roomName] || [];
    
    // If editing an existing room, show all relays with current selections
    if (roomName && relays[roomName]) {
      const newChecked = {};
      allRelays.forEach(r => {
        newChecked[r] = currentRelays.includes(r);
      });
      setCheckedRelays(newChecked);
    } else {
      // If creating a new room, only show unassigned relays
      const assignedRelays = Object.values(relays).flat();
      const unassignedRelays = allRelays.filter(r => !assignedRelays.includes(r));
      const newChecked = {};
      unassignedRelays.forEach(r => {
        newChecked[r] = false;
      });
      setCheckedRelays(newChecked);
    }
    setOpenDialog(true);
  };

  const saveRoomRelays = async () => {
    const selected = Object.entries(checkedRelays)
      .filter(([, v]) => v)
      .map(([k]) => k);
    
    // Validate that room name is provided
    if (!selectedRoom.trim()) {
      showToast('Please enter a room name', 'error');
      return;
    }
    
    // Validate that at least one relay is selected
    if (selected.length === 0) {
      showToast('Please select at least one relay for the room', 'error');
      return;
    }
    
    const roomDoc = doc(db, "relays", deviceId, "relays", selectedRoom);
    await setDoc(roomDoc, { relays: selected });
    setRelays(prev => ({ ...prev, [selectedRoom]: selected }));
    setOpenDialog(false);
    showToast(`Room "${selectedRoom}" ${relays[selectedRoom] ? 'updated' : 'created'} successfully`, 'success');

    // Also update roomsData if setRoomsData is provided
    if (setRoomsData) {
      setRoomsData(prev => ({
        ...prev,
        [selectedRoom]: {
          ...(prev[selectedRoom] || {}),
          devices: selected.map(relay => ({
            name: relay,
            status: relayStates[relay] === "ON"
          }))
        }
      }));
    }
  };

  const deleteRoom = async () => {
    const docRef = doc(db, "relays", deviceId, "relays", roomOptionsRoom);
    await deleteDoc(docRef);
    const updated = { ...relays };
    delete updated[roomOptionsRoom];
    setRelays(updated);
    setAnchorEl(null);

    // Also update roomsData if setRoomsData is provided
    if (setRoomsData) {
      setRoomsData(prev => {
        const newRooms = { ...prev };
        delete newRooms[roomOptionsRoom];
        return newRooms;
      });
    }
  };

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

  // Initialize Firebase and WebSocket
  useEffect(() => {
    fetchRelayData();
    fetchRoomMap();
    connectWebSocket();
    
    // Cleanup function
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
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

  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
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

  const deviceStats = getDeviceStats(roomsData);
  const roomStats = getRoomStats(roomsData);

  // Exact-match styled grid for quick access device cards
  const QuickAccessGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    '@media (max-width:900px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width:600px)': {
      gridTemplateColumns: '1fr',
    },
  }));

  const QuickAccessDeviceCard = styled(Box)(({ theme }) => ({
    borderRadius: 16,
    background: theme.palette.mode === 'dark' ? '#23252c' : '#f5f7fa',
    border: `1.5px solid ${theme.palette.mode === 'dark' ? '#444' : '#ddd'}`,
    padding: theme.spacing(3, 2, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 170,
    minWidth: 160,
    boxShadow: 'none',
    transition: 'border 0.2s, background 0.2s',
  }));

  const QuickAccessIconToggle = styled(IconButton)(({ theme, status }) => ({
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: status ? '#39B54A' : '#e53935',
    color: '#fff',
    fontSize: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    border: 'none',
    transition: 'background 0.2s, color 0.2s',
    '&:hover': {
      background: status ? '#2e9e3e' : '#c62828',
      color: '#fff',
      boxShadow: 'none',
    },
  }));

  const QuickAccessDeviceName = styled(Typography)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
    fontWeight: 700,
    fontSize: '1.1rem',
    textAlign: 'center',
    marginTop: theme.spacing(1),
    whiteSpace: 'pre-line',
  }));

  const handleQuickAccessClick = (relay) => {
    if (quickAccessRelays.includes(relay)) {
      setQaDialogAction('remove');
    } else {
      setQaDialogAction('add');
    }
    setQaDialogRelay(relay);
    setQaDialogOpen(true);
  };
  const handleQaDialogClose = () => {
    setQaDialogOpen(false);
    setQaDialogRelay(null);
  };
  const handleQaDialogConfirm = () => {
    if (qaDialogRelay) {
      let updated;
      if (qaDialogAction === 'add') {
        updated = [...quickAccessRelays, qaDialogRelay];
      } else {
        updated = quickAccessRelays.filter(r => r !== qaDialogRelay);
      }
      setQuickAccessRelays(updated);
      localStorage.setItem('quickAccessRelays', JSON.stringify(updated));
    }
    handleQaDialogClose();
  };

  const handleEditDeviceClick = (room, relay) => {
    setEditDeviceRoom(room);
    setEditDeviceName(relay);
    setEditDeviceOrigName(relay);
    setEditDeviceQuick(quickAccessRelays.includes(relay));
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditDeviceRoom(null);
    setEditDeviceName('');
    setEditDeviceOrigName('');
    setEditDeviceQuick(false);
  };
  const handleEditDeviceSave = () => {
    if (!editDeviceRoom || !editDeviceOrigName) return;
    // Update device name in relays state
    setRelays(prev => {
      const updated = { ...prev };
      const idx = updated[editDeviceRoom].indexOf(editDeviceOrigName);
      if (idx !== -1) {
        updated[editDeviceRoom][idx] = editDeviceName;
      }
      return updated;
    });
    // Update quick access relays
    setQuickAccessRelays(prev => {
      let updated = prev.filter(r => r !== editDeviceOrigName);
      if (editDeviceQuick) updated = [...updated, editDeviceName];
      return updated;
    });
    // If device name changed, remove old from quick access
    if (editDeviceOrigName !== editDeviceName) {
      setQuickAccessRelays(prev => prev.map(r => r === editDeviceOrigName ? editDeviceName : r));
    }
    localStorage.setItem('quickAccessRelays', JSON.stringify(
      editDeviceQuick
        ? [...quickAccessRelays.filter(r => r !== editDeviceOrigName), editDeviceName]
        : quickAccessRelays.filter(r => r !== editDeviceOrigName)
    ));
    handleEditDialogClose();
  };
  const handleRemoveDevice = () => {
    if (!editDeviceRoom || !editDeviceOrigName) return;
    setRelays(prev => {
      const updated = { ...prev };
      updated[editDeviceRoom] = updated[editDeviceRoom].filter(r => r !== editDeviceOrigName);
      return updated;
    });
    setQuickAccessRelays(prev => prev.filter(r => r !== editDeviceOrigName));
    localStorage.setItem('quickAccessRelays', JSON.stringify(quickAccessRelays.filter(r => r !== editDeviceOrigName)));
    setRemoveConfirmOpen(false);
    handleEditDialogClose();
  };

  // Enhanced DeviceCard for Room Controls
  const EnhancedDeviceCard = styled(DeviceCard)(({ theme }) => ({
    position: 'relative',
    boxShadow: theme.shadows[2],
    borderRadius: 14,
    transition: 'box-shadow 0.2s, border 0.2s, transform 0.2s',
    border: `2px solid transparent`,
    '&:hover': {
      boxShadow: theme.shadows[6],
      border: `2px solid ${theme.palette.primary.main}`,
      transform: 'translateY(-2px) scale(1.02)',
      zIndex: 2,
    },
  }));

  const StarButtonCircle = styled(IconButton)(({ theme, active }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 3,
    background: active ? theme.palette.warning.light : theme.palette.background.paper,
    boxShadow: active ? `0 0 8px 2px ${theme.palette.warning.main}55` : theme.shadows[1],
    borderRadius: '50%',
    padding: 4,
    transition: 'all 0.2s',
    '&:hover': {
      background: theme.palette.warning.main,
      transform: 'scale(1.15)',
      boxShadow: `0 0 12px 2px ${theme.palette.warning.main}99`,
    },
  }));

  // 1. Add styled toggle button after styled components
  const DeviceToggleButton = styled(IconButton)(({ theme, status }) => ({
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: status ? '#008000' : '#e53935',
    color: '#fff',
    boxShadow: status ? '0 0 0 2px #00800044' : '0 0 0 2px #e5393544',
    transition: 'background 0.25s, box-shadow 0.25s, color 0.25s',
    '&:hover': {
      background: status ? '#009900' : '#c62828',
      boxShadow: status ? '0 0 0 4px #00800066' : '0 0 0 4px #e5393566',
    },
    outline: 'none',
    marginBottom: theme.spacing(1),
  }));

  const StatusDotRow = styled('span')(({ theme, status }) => ({
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: status ? '#39B54A' : theme.palette.grey[600],
    display: 'inline-block',
  }));

  const DeviceIconNameGroup = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    flex: 1,
    minWidth: 0,
  }));

  const DeviceIconCircleRow = styled(Box)(({ theme }) => ({
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: theme.palette.mode === 'dark' ? '#363843' : '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    fontSize: 20,
  }));

  const DeviceNameRow = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.08rem',
    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }));

  const ToggleButtonRow = styled(IconButton)(({ theme, status }) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: status ? '#39B54A' : '#e53935',
    color: '#fff',
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none',
    border: 'none',
    transition: 'none',
    '&:hover': {
      background: status ? '#39B54A' : '#e53935',
      color: '#fff',
      boxShadow: 'none',
    },
  }));

  const EditButtonRow = styled(IconButton)(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: theme.palette.mode === 'dark' ? '#363843' : '#e0e0e0',
    color: '#fff',
    fontSize: 20,
    boxShadow: 'none',
    border: 'none',
    transition: 'background 0.15s',
    '&:hover': {
      background: theme.palette.mode === 'dark' ? '#444' : '#ccc',
      color: '#fff',
      boxShadow: 'none',
    },
  }));

  return (
    <Box sx={{ p: 3 }}>
      <DashboardBanner
        sx={(theme) => ({
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(90deg, #e3f2fd 0%, #ffffff 100%)',
          color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.text.primary,
          borderRadius: 4,
          p: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          position: 'relative',
          overflow: 'hidden',
        })}
      >
        <Box>
          <Typography
            variant="h2"
            sx={(theme) => ({
              fontWeight: 800,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
              mb: 1,
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
            })}
          >
            Welcome to your Smart Home Dashboard
          </Typography>
          {/* Quick Access Devices removed from here */}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box
            sx={(theme) => ({
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)',
              borderRadius: 3,
              p: 3,
              minWidth: 160,
              textAlign: 'center',
              border: `1.5px solid ${theme.palette.primary.main}`,
              fontFamily: "'Orbitron', monospace",
            })}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'inherit', mb: 0.5 }}>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography variant="subtitle2" sx={(theme) => ({ color: theme.palette.primary.main, fontWeight: 500 })}>
              {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
            <Typography variant="caption" sx={(theme) => ({ color: theme.palette.text.secondary })}>
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={(theme) => ({ color: theme.palette.primary.light, fontWeight: 700, mb: 1 })}>
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
                    fontSize: '1rem',
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

      {/* Weather Card and Quick Access Devices Side by Side */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <GlassyCard>
            <CardHeading>
              Current Weather <span style={{ color: '#90caf9' }}>({weatherData.current.condition})</span>
            </CardHeading>
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
          </GlassyCard>
        </Grid>
        {/* Quick Access Devices Card */}
        <Grid item xs={12} md={6}>
          <GlassyCard>
            <CardHeading>Quick Access Devices</CardHeading>
            <QuickAccessGrid>
              {(() => {
                const quickDevices = Object.entries(relays)
                  .flatMap(([room, items]) => items.map(relay => ({ room, relay })))
                  .filter(({ relay }) => quickAccessRelays.includes(relay))
                  .slice(0, 6);
                if (quickDevices.length === 0) {
                  return (
                    <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                      <StarBorderIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                      <Typography variant="subtitle1">No Quick Access Devices</Typography>
                      <Typography variant="body2">Add devices using the star icon in Room Controls.</Typography>
                    </Box>
                  );
                }
                return quickDevices.map(({ room, relay }) => {
                  const key = `${room}_${relay}`;
                  const isOn = relayStates[relay] === "ON";
                  return (
                    <QuickAccessDeviceCard key={key}>
                      <QuickAccessIconToggle
                        status={isOn}
                        aria-label={isOn ? `Turn OFF ${relay}` : `Turn ON ${relay}`}
                        title={isOn ? 'Turn OFF' : 'Turn ON'}
                        onClick={() => {
                          userInitiatedMap.current[key] = true;
                          handleSwitchChange(relay, room, !isOn);
                        }}
                      >
                        {getDeviceIcon(relay)}
                      </QuickAccessIconToggle>
                      <QuickAccessDeviceName>
                        {relay.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ')}
                      </QuickAccessDeviceName>
                    </QuickAccessDeviceCard>
                  );
                });
              })()}
            </QuickAccessGrid>
          </GlassyCard>
        </Grid>
      </Grid>

      {/* Room Controls and Energy Consumption */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <GlassyCard>
            <CardHeading sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Room Controls
              <Tooltip title="Refresh Devices">
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    fetchRelayData();
                    fetchRoomMap();
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </CardHeading>
            {Object.entries(relays).map(([roomName, items]) => {
              const onCount = items.filter(relay => relayStates[relay] === "ON").length;
              const offCount = items.length - onCount;
              const collapsed = collapsedRooms[roomName] || false;
              return (
                <RoomBlock key={roomName}>
                  <RoomHeaderCard>
                    <RoomHeaderInfo>
                      <RoomHeaderName>{roomName}</RoomHeaderName>
                      <RoomHeaderStats>
                        <span style={{ color: '#008000' }}>{onCount} ON</span>
                        <span style={{ color: '#e53935' }}>{offCount} OFF</span>
                      </RoomHeaderStats>
                    </RoomHeaderInfo>
                    <IconButton onClick={() => setCollapsedRooms(prev => ({ ...prev, [roomName]: !prev[roomName] }))}>
                      {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                  </RoomHeaderCard>
                  <Collapse in={!collapsed}>
                    <RoomDeviceCardsWrapper>
                      {items.map(relay => {
                        const isOn = relayStates[relay] === "ON";
                        const key = `${roomName}_${relay}`;
                        // Determine device type for icon
                        let deviceType = 'Device';
                        if (relay.toLowerCase().includes('ac') || relay.toLowerCase().includes('air')) deviceType = 'AC';
                        else if (relay.toLowerCase().includes('light')) deviceType = 'Light';
                        else if (relay.toLowerCase().includes('tv')) deviceType = 'TV';
                        else if (relay.toLowerCase().includes('fan')) deviceType = 'Fan';
                        else if (relay.toLowerCase().includes('water')) deviceType = 'Water';
                        else if (relay.toLowerCase().includes('heater')) deviceType = 'Heater';
                        else if (relay.toLowerCase().includes('oven')) deviceType = 'Oven';
                        else if (relay.toLowerCase().includes('dishwasher')) deviceType = 'Dishwasher';
                        else if (relay.toLowerCase().includes('refrigerator')) deviceType = 'Fridge';

                        return (
                          <HorizontalDeviceCard key={key}>
                            {/* <StatusDotRow status={isOn} /> */}
                            <DeviceIconNameGroup>
                              <DeviceIconCircleRow>
                                {getDeviceIcon(relay)}
                              </DeviceIconCircleRow>
                              <DeviceNameRow>{relay}</DeviceNameRow>
                            </DeviceIconNameGroup>
                            <ToggleButtonRow
                              status={isOn}
                              aria-label={isOn ? `Turn OFF ${relay}` : `Turn ON ${relay}`}
                              title={isOn ? 'Turn OFF' : 'Turn ON'}
                              onClick={() => {
                                userInitiatedMap.current[key] = true;
                                handleSwitchChange(relay, roomName, !isOn);
                              }}
                            >
                              {getDeviceIcon(relay)}
                            </ToggleButtonRow>
                            <EditButtonRow
                              aria-label="Edit Device"
                              title="Edit Device"
                              onClick={() => handleEditDeviceClick(roomName, relay)}
                            >
                              <EditIcon fontSize="small" />
                            </EditButtonRow>
                          </HorizontalDeviceCard>
                        );
                      })}
                    </RoomDeviceCardsWrapper>
                  </Collapse>
                </RoomBlock>
              );
            })}
            <Box mt={4} display="flex" justifyContent="center">
              <Button variant="outlined" color="secondary" onClick={() => openRoomDialog("")}>Add Room</Button>
            </Box>
          </GlassyCard>
        </Grid>
        <Grid item xs={12} md={8}>
          <GlassyCard>
            <CardHeading>Energy Consumption</CardHeading>
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
              <Box sx={{ height: 400, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart 
                    data={energyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#90caf9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#90caf9" stopOpacity={0.1}/>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <RechartsCartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(144, 202, 249, 0.1)"
                    />
                    <RechartsXAxis 
                      dataKey="label" 
                      stroke="rgba(144, 202, 249, 0.5)"
                      tick={{ fill: 'rgba(144, 202, 249, 0.7)' }}
                    />
                    <RechartsYAxis 
                      label={{ 
                        value: 'Consumption (kW)', 
                        angle: -90, 
                        position: 'insideLeft',
                        fill: 'rgba(144, 202, 249, 0.7)'
                      }}
                      domain={
                        energyView === 'hourly' ? [0, 2.5] : 
                        energyView === 'daily' ? [0, 45] :
                        energyView === 'weekly' ? [0, 250] :
                        [0, 1200]
                      }
                      tickCount={6}
                      tickFormatter={(value) => 
                        energyView === 'hourly' ? value.toFixed(1) : 
                        value % 1 === 0 ? value.toString() : value.toFixed(1)
                      }
                      stroke="rgba(144, 202, 249, 0.5)"
                      tick={{ fill: 'rgba(144, 202, 249, 0.7)' }}
                    />
                    <RechartsTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const value = payload[0].value;
                          const timestamp = payload[0].payload.timestamp;
                          return (
                            <AnimatedTooltip>
                              <p className="label">{label}</p>
                              <p className="value">
                                Power: {value.toFixed(2)} kW
                              </p>
                              <p className="timestamp">
                                {timestamp ? new Date(timestamp).toLocaleString() : 
                                 energyView === 'hourly' ? 'Current hour' : 
                                 energyView === 'daily' ? 'Daily total' : 
                                 energyView === 'weekly' ? 'Weekly total' : 'Monthly total'}
                              </p>
                            </AnimatedTooltip>
                          );
                        }
                        return null;
                      }}
                      cursor={{
                        stroke: 'rgba(144, 202, 249, 0.3)',
                        strokeWidth: 2,
                        strokeDasharray: '5 5',
                      }}
                    />
                    <RechartsLine 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#90caf9"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{
                        r: 8,
                        stroke: '#90caf9',
                        strokeWidth: 2,
                        fill: '#fff',
                        filter: 'url(#glow)',
                      }}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <RechartsLine 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="url(#lineGradient)"
                      strokeWidth={20}
                      dot={false}
                      activeDot={false}
                      opacity={0.1}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={2} sx={{ mt: 2 }}>
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
          </GlassyCard>
        </Grid>
      </Grid>

      {/* Temperature Display */}
      <Grid item xs={12} md={6}>
        <TemperatureDisplay roomsData={roomsData} selectedRoom={selectedRoom} setRoomsData={setRoomsData} />
      </Grid>



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
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
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

    {/* Room Management Dialog */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
      <DialogTitle>{selectedRoom ? `Edit Room: ${selectedRoom}` : "Add New Room"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Room Name"
          fullWidth
          margin="normal"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          disabled={!!relays[selectedRoom]}
        />
        <Box>
          {(() => {
            // If editing an existing room, show relays assigned to this room and unassigned relays
            if (selectedRoom && relays[selectedRoom]) {
              const assignedRelays = relays[selectedRoom];
              const assignedToOtherRooms = Object.entries(relays)
                .filter(([room]) => room !== selectedRoom)
                .flatMap(([, relaysList]) => relaysList);
              const unassignedRelays = allRelays.filter(r => !assignedToOtherRooms.includes(r) && !assignedRelays.includes(r));
              const relaysToShow = [...assignedRelays, ...unassignedRelays];
              if (relaysToShow.length === 0) {
                return (
                  <Typography color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    No relays are available for this room.
                  </Typography>
                );
              }
              return (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Select relays for this room (checked = assigned to this room)
                  </Typography>
                  {relaysToShow.map((relay) => (
                    <FormControlLabel
                      key={relay}
                      control={
                        <Checkbox
                          checked={!!checkedRelays[relay]}
                          onChange={(e) =>
                            setCheckedRelays(prev => ({ ...prev, [relay]: e.target.checked }))
                          }
                        />
                      }
                      label={relay}
                    />
                  ))}
                </>
              );
            } else {
              // If creating a new room, only show unassigned relays
              const assignedRelays = Object.values(relays).flat();
              const unassignedRelays = allRelays.filter(r => !assignedRelays.includes(r));
              if (unassignedRelays.length === 0) {
                return (
                  <Typography color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    All relays are already assigned to rooms. Remove relays from existing rooms to create new ones.
                  </Typography>
                );
              }
              return (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Select relays for the new room (only unassigned relays shown)
                  </Typography>
                  {unassignedRelays.map((relay) => (
                    <FormControlLabel
                      key={relay}
                      control={
                        <Checkbox
                          checked={!!checkedRelays[relay]}
                          onChange={(e) =>
                            setCheckedRelays(prev => ({ ...prev, [relay]: e.target.checked }))
                          }
                        />
                      }
                      label={relay}
                    />
                  ))}
                </>
              );
            }
          })()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={saveRoomRelays} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>

    {/* Room Options Menu */}
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={() => openRoomDialog(roomOptionsRoom)}>Edit</MenuItem>
      <MenuItem onClick={deleteRoom}>Remove</MenuItem>
    </Menu>

    {/* Quick Access Add/Remove Dialog */}
    <Dialog open={qaDialogOpen} onClose={handleQaDialogClose} TransitionComponent={Fade}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StarIcon color={qaDialogAction === 'add' ? 'warning' : 'disabled'} sx={{ fontSize: 28 }} />
        <span style={{ fontWeight: 700, fontSize: '1.1em' }}>{qaDialogRelay}</span>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 1 }}>
          {qaDialogAction === 'add'
            ? `Do you want to add "${qaDialogRelay}" to Quick Access Devices?`
            : `Do you want to remove "${qaDialogRelay}" from Quick Access Devices?`}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={handleQaDialogClose} variant="outlined">Cancel</Button>
        <Button
          onClick={handleQaDialogConfirm}
          color={qaDialogAction === 'add' ? 'primary' : 'error'}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          {qaDialogAction === 'add' ? 'Add' : 'Remove'}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Edit Device Dialog */}
    <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Device</DialogTitle>
      <DialogContent>
        <TextField
          label="Device Name"
          value={editDeviceName}
          onChange={e => setEditDeviceName(e.target.value)}
          fullWidth
          margin="normal"
          autoFocus
          inputProps={{ maxLength: 32 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Switch
            checked={editDeviceQuick}
            onChange={e => setEditDeviceQuick(e.target.checked)}
            color="primary"
            inputProps={{ 'aria-label': 'Show in Quick Access Devices' }}
          />
          <Typography variant="body2">Show in Quick Access Devices</Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ mt: 3 }}
          onClick={() => setRemoveConfirmOpen(true)}
          fullWidth
        >
          Remove Device
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDialogClose}>Cancel</Button>
        <Button onClick={handleEditDeviceSave} variant="contained" disabled={!editDeviceName.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>

    {/* Remove Device Confirmation Dialog */}
    <Dialog open={removeConfirmOpen} onClose={() => setRemoveConfirmOpen(false)} maxWidth="xs">
      <DialogTitle>Remove Device</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to remove "{editDeviceOrigName}" from this room?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setRemoveConfirmOpen(false)}>Cancel</Button>
        <Button onClick={handleRemoveDevice} color="error" variant="contained">Remove</Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
};

export default Dashboard;
