import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WEATHER_API_KEY = 'd37a636da8786b8ce56070ad9246c406';
const DEFAULT_CITY = 'Hyderabad';

const pollutantLabels = {
  pm2_5: 'PM2.5 (μg/m³)',
  pm10: 'PM10 (μg/m³)',
  co: 'CO (mg/m³)',
  no: 'NO (μg/m³)',
  no2: 'NO₂ (μg/m³)',
  o3: 'O₃ (μg/m³)',
  so2: 'SO₂ (μg/m³)',
  nh3: 'NH₃ (μg/m³)',
};

const aqiText = (aqi) => {
  switch (aqi) {
    case 1: return 'Good';
    case 2: return 'Fair';
    case 3: return 'Moderate';
    case 4: return 'Poor';
    case 5: return 'Very Poor';
    default: return '--';
  }
};

const AirQualityDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [air, setAir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const fetchAirByCoords = async (lat, lon) => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
        );
        const data = await res.json();
        setAir(data.list[0]);
      } catch (e) {
        setAir(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchCoordsByCity = async (city) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`
        );
        const data = await res.json();
        if (data.coord) {
          fetchAirByCoords(data.coord.lat, data.coord.lon);
          setCity(data.name);
        } else {
          setAir(null);
        }
      } catch (e) {
        setAir(null);
      }
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAirByCoords(position.coords.latitude, position.coords.longitude);
          setUsedFallback(false);
        },
        () => {
          fetchCoordsByCity(DEFAULT_CITY);
          setUsedFallback(true);
        }
      );
    } else {
      fetchCoordsByCity(DEFAULT_CITY);
      setUsedFallback(true);
    }
  }, []);

  return (
    <Paper elevation={4} sx={{
      borderRadius: 16,
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      width: '100%',
      maxWidth: 500,
      margin: '40px auto',
      p: 4,
      boxShadow: theme.shadows[6],
      minHeight: 340,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
        Air Quality Details
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary, textAlign: 'center' }}>
        {usedFallback
          ? 'Showing air quality for Hyderabad (location access denied)'
          : 'Showing air quality for your current location'}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
        {city}
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : air ? (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            AQI: {air.main.aqi} ({aqiText(air.main.aqi)})
          </Typography>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <tbody>
              {Object.entries(pollutantLabels).map(([key, label]) => (
                <tr key={key}>
                  <td style={{ padding: '8px 0', color: theme.palette.text.secondary }}>{label}</td>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: theme.palette.text.primary, textAlign: 'right' }}>{air.components[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <Typography color="error">Could not fetch air quality data.</Typography>
      )}
      <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
        Back to Dashboard
      </Button>
    </Paper>
  );
};

export default AirQualityDetails; 