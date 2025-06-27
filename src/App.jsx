import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Messages from './components/Messages';
import DeviceDiscovery from './components/DeviceDiscovery';
import UserProfile from './components/UserProfile';
import Settings from './components/Settings';
import EnergyDetails from './components/EnergyDetails';
import Logout from './components/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Fab from '@mui/material/Fab';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#26a69a', // Teal
      light: '#64d8cb',
      dark: '#00766c',
      contrastText: '#fff',
    },
    secondary: {
      main: '#43a047', // Green
      light: '#76d275',
      dark: '#00701a',
      contrastText: '#fff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#fff',
      secondary: '#b0b0b0',
    },
    divider: '#333',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#26a69a', // Teal
      light: '#64d8cb',
      dark: '#00766c',
      contrastText: '#222',
    },
    secondary: {
      main: '#43a047', // Green
      light: '#76d275',
      dark: '#00701a',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#222',
      secondary: '#666',
    },
    divider: '#ececec',
  },
});

const AppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 0, // Remove the default 240 or 280px margin
}));


// Initial room data shared between components
const initialRoomsData = {
  'Living Room': {
    devices: [
      { name: 'Smart TV', status: true },
      { name: 'Air Conditioner', status: false },
      { name: 'Smart Lights', status: true },
    ]
  },
  'Kitchen': {
    devices: [
      { name: 'Refrigerator', status: true },
      { name: 'Oven', status: false },
      { name: 'Dishwasher', status: false },
    ]
  },
  'Bedroom': {
    devices: [
      { name: 'Smart Lights', status: true },
      { name: 'Air Conditioner', status: true },
      { name: 'Smart Fan', status: false },
    ]
  },
  'Bathroom': {
    devices: [
      { name: 'Smart Lights', status: true },
      { name: 'Water Heater', status: true },
      { name: 'Smart Mirror', status: false },
    ]
  }
};

function AppContent({ themeMode, setThemeMode }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState('Login');
  const [roomsData, setRoomsData] = useState(initialRoomsData);
  const [username, setUsername] = useState('User');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize with Login page if not authenticated
  useEffect(() => {
    if (!authenticated && currentPage !== 'Login' && currentPage !== 'Register') {
      setCurrentPage('Login');
    }
  }, [authenticated, currentPage]);

  const handleLogin = (guest) => {
    setAuthenticated(true);
    setIsGuest(!!guest);
    setCurrentPage('DeviceDiscovery');
    navigate('/device-discovery');
  };

  const handleRegister = (guest) => {
    setAuthenticated(true);
    setIsGuest(!!guest);
    setCurrentPage('DeviceDiscovery');
    navigate('/device-discovery');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setIsGuest(false);
    setDiscoveredDevices([]);
    setRoomsData(initialRoomsData);
    setCurrentPage('Login');
    navigate('/login');
  };

  const handleDiscoveryComplete = (devices) => {
    setDiscoveredDevices(devices);
    setCurrentPage('Dashboard');
    navigate('/dashboard');
  };

  const handlePageChange = (page, options = {}) => {
    setCurrentPage(page);
    if (options.themeMode) {
      setThemeMode(options.themeMode);
    }
    navigate(`/${page.toLowerCase()}`);
  };

  return (
    <>
      {authenticated ? (
        <AppContainer>
          {isMobile && (
            <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setSidebarOpen(true)}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 700 }}>
                  Smart Home
                </Typography>
              </Toolbar>
            </AppBar>
          )}
          <Sidebar
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
            authenticated={authenticated}
            isGuest={isGuest}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            onLogout={handleLogout}
            mobileOpen={isMobile ? sidebarOpen : undefined}
            onMobileClose={isMobile ? () => setSidebarOpen(false) : undefined}
            variant={isMobile ? 'temporary' : 'permanent'}
          />
          <MainContent sx={{ mt: isMobile ? 7 : 0 }}>
            <Routes>
              <Route 
                path="/" 
                element={<Navigate to="/dashboard" replace />} 
              />
              <Route 
                path="/device-discovery" 
                element={
                  <DeviceDiscovery 
                    onDiscoveryComplete={handleDiscoveryComplete}
                    roomsData={roomsData}
                    setRoomsData={setRoomsData}
                  />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <Dashboard 
                    roomsData={roomsData} 
                    setRoomsData={setRoomsData} 
                    themeMode={themeMode}
                    setThemeMode={setThemeMode}
                    username={username}
                    discoveredDevices={discoveredDevices}
                  />
                } 
              />
              <Route 
                path="/profile" 
                element={<UserProfile onNavigate={handlePageChange} />} 
              />
              <Route 
                path="/home" 
                element={<Home roomsData={roomsData} setRoomsData={setRoomsData} />} 
              />
              <Route 
                path="/messages" 
                element={<Messages isGuest={isGuest} />} 
              />
              <Route 
                path="/settings" 
                element={
                  <Settings 
                    onThemeChange={setThemeMode}
                    onLogout={handleLogout}
                  />
                } 
              />
              <Route 
                path="/energy-details" 
                element={<EnergyDetails />} 
              />
              <Route 
                path="/logout" 
                element={<Logout onLogout={handleLogout} />} 
              />
            </Routes>
          </MainContent>
          {isMobile && (
            <Fab
              color="primary"
              aria-label="toggle theme"
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 2000,
                boxShadow: 4,
              }}
            >
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </Fab>
          )}
        </AppContainer>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Registration onRegister={handleRegister} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  const [themeMode, setThemeMode] = useState('dark');
  
  return (
    <BrowserRouter>
      <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <AppContent themeMode={themeMode} setThemeMode={setThemeMode} />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
