import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Messages from './components/Messages';
import UserProfile from './components/UserProfile';
import Settings from './components/Settings';
import EnergyDetails from './components/EnergyDetails';
import Logout from './components/Logout';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#26a69a', light: '#64d8cb', dark: '#00766c', contrastText: '#fff' },
    secondary: { main: '#43a047', light: '#76d275', dark: '#00701a', contrastText: '#fff' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#fff', secondary: '#b0b0b0' },
    divider: '#333',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#26a69a', light: '#64d8cb', dark: '#00766c', contrastText: '#222' },
    secondary: { main: '#43a047', light: '#76d275', dark: '#00701a', contrastText: '#fff' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
    text: { primary: '#222', secondary: '#666' },
    divider: '#ececec',
  },
});

function Layout({ children, themeMode, setThemeMode }) {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebar && (
        <Sidebar themeMode={themeMode} setThemeMode={setThemeMode} authenticated={true} isGuest={false} />
      )}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function App() {
  const [themeMode, setThemeMode] = useState('light');
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout themeMode={themeMode} setThemeMode={setThemeMode}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/energy" element={<EnergyDetails />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
