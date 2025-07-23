import React, { useEffect, useState } from 'react';
import { Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WEATHER_API_KEY = 'd37a636da8786b8ce56070ad9246c406';
const NEWS_API_KEY = 'a676f877180943d1a819de1b82f433c9';
const DEFAULT_CITY = 'Hyderabad';

const HomeUpdates = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [weather, setWeather] = useState({ temp: null, desc: '', icon: '', city: DEFAULT_CITY });
  const [air, setAir] = useState({ aqi: null, pm25: null });
  const [news, setNews] = useState({ title: '', url: '' });
  const [loading, setLoading] = useState(true);
  const [airLoading, setAirLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherByCoords = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          desc: data.weather[0].main,
          icon: data.weather[0].icon,
          city: data.name,
        });
      } catch (e) {
        setWeather({ temp: '--', desc: 'N/A', icon: '', city: DEFAULT_CITY });
      } finally {
        setLoading(false);
      }
    };

    const fetchAirByCoords = async (lat, lon) => {
      setAirLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
        );
        const data = await res.json();
        setAir({
          aqi: data.list[0].main.aqi,
          pm25: data.list[0].components.pm2_5,
        });
      } catch (e) {
        setAir({ aqi: '--', pm25: '--' });
      } finally {
        setAirLoading(false);
      }
    };

    const fetchWeatherByCity = async (city) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          desc: data.weather[0].main,
          icon: data.weather[0].icon,
          city: data.name,
        });
        // Use city coordinates for air quality
        if (data.coord) {
          fetchAirByCoords(data.coord.lat, data.coord.lon);
        } else {
          setAir({ aqi: '--', pm25: '--' });
        }
      } catch (e) {
        setWeather({ temp: '--', desc: 'N/A', icon: '', city });
        setAir({ aqi: '--', pm25: '--' });
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          fetchAirByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeatherByCity(DEFAULT_CITY);
        }
      );
    } else {
      fetchWeatherByCity(DEFAULT_CITY);
    }

    // Fetch news
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?country=in&pageSize=1&apiKey=${NEWS_API_KEY}`
        );
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setNews({ title: data.articles[0].title, url: data.articles[0].url });
        } else {
          setNews({ title: 'No news available', url: '' });
        }
      } catch (e) {
        setNews({ title: 'Error fetching news', url: '' });
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // AQI scale mapping (1-5)
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

  const cardStyle = {
    background: theme.palette.background.paper,
    borderRadius: 16,
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    minHeight: '90px',
    minWidth: 0,
    gap: '14px',
    boxShadow: theme.shadows[2],
  };

  return (
    <Paper elevation={4} sx={{
      borderRadius: 16,
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      width: '100%',
      p: 3,
      boxShadow: theme.shadows[6],
      mb: 2,
      minHeight: 340,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.6rem', marginBottom: '24px', textAlign: 'center' }}>Home Updates</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '18px',
        marginBottom: '18px',
      }}>
        {/* Weather */}
        <div style={cardStyle}>
          <span style={{ fontSize: '1.6rem', marginRight: '8px' }}>
            {weather.icon ? (
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather icon" style={{ width: 32, height: 32, verticalAlign: 'middle' }} />
            ) : '⛅'}
          </span>
          <div>
            <div style={{ fontWeight: 600 }}>Weather</div>
            <div style={{ color: theme.palette.text.secondary, fontSize: '0.98rem' }}>
              {weather.city}: {loading ? '--' : `${weather.temp}°C, ${weather.desc}`}
            </div>
          </div>
        </div>
        {/* Air Quality */}
        <div style={cardStyle}>
          <span style={{ fontSize: '1.6rem', marginRight: '8px' }}>😟</span>
          <div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              Air Quality
              <a
                href="#"
                onClick={e => { e.preventDefault(); navigate('/air-quality-details'); }}
                style={{ color: theme.palette.primary.main, fontWeight: 500, fontSize: '0.95rem', marginLeft: 8, textDecoration: 'underline', cursor: 'pointer' }}
              >
                View More
              </a>
            </div>
            <div style={{ color: theme.palette.text.secondary, fontSize: '0.98rem' }}>
              AQI {airLoading ? '--' : air.aqi} ({aqiText(air.aqi)})<br />
              PM2.5: {airLoading ? '--' : air.pm25}
            </div>
          </div>
        </div>
        {/* News */}
        <div style={cardStyle}>
          <span style={{ fontSize: '1.6rem', marginRight: '8px' }}>📰</span>
          <div>
            <div style={{ fontWeight: 600 }}>News</div>
            <div style={{ color: theme.palette.text.secondary, fontSize: '0.98rem' }}>
              {newsLoading ? 'Loading...' : (
                news.url ? <a href={news.url} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.text.secondary, textDecoration: 'underline' }}>{news.title}</a> : news.title
              )}
            </div>
          </div>
        </div>
        {/* Reminders */}
        <div style={cardStyle}>
          <span style={{ fontSize: '1.6rem', marginRight: '8px' }}>⏰</span>
          <div>
            <div style={{ fontWeight: 600 }}>Reminders</div>
            <div style={{ color: theme.palette.text.secondary, fontSize: '0.98rem' }}>Buy groceries at 6:00 PM</div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <a href="#" style={{ color: theme.palette.primary.main, fontWeight: 600, textDecoration: 'none', fontSize: '1.1rem' }}>View More</a>
      </div>
    </Paper>
  );
};

export default HomeUpdates; 