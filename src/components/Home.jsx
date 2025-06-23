import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styled from '@mui/material/styles/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: theme.palette.error.main,
    '&.Mui-checked': {
      color: theme.palette.success.main,
      '&:hover': {
        boxShadow: '0 0 0 8px rgba(0, 255, 0, 0.2)'
      }
    },
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(255, 0, 0, 0.2)'
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.error.main,
    opacity: 0.3,
    '&.Mui-checked': {
      backgroundColor: theme.palette.success.main,
      opacity: 0.3,
      '&:hover': {
        boxShadow: '0 0 0 8px rgba(0, 255, 0, 0.2)'
      }
    },
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(255, 0, 0, 0.2)'
    },
  },
  '& .MuiSwitch-thumb': {
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(26, 26, 26, 0.9)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '10px 24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(26, 26, 26, 0.9)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const Home = ({ roomsData = {}, setRoomsData }) => {
  const [addRoomDialogOpen, setAddRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [selectedRoomForDevice, setSelectedRoomForDevice] = useState('');
  // Handle adding a new device
  const handleAddDevice = () => {
    if (newDeviceName.trim() && selectedRoomForDevice) {
      setRoomsData(prev => {
        const updatedRooms = { ...prev };
        const updatedDevices = [...updatedRooms[selectedRoomForDevice].devices];
        updatedDevices.push({
          name: newDeviceName.trim(),
          status: false
        });
        updatedRooms[selectedRoomForDevice] = { ...updatedRooms[selectedRoomForDevice], devices: updatedDevices };
        return updatedRooms;
      });
      setAddDeviceDialogOpen(false);
      setNewDeviceName('');
      setSelectedRoomForDevice('');
    }
  };

  // Helper function to get last active time
  const getLastActiveTime = (status) => {
    const now = new Date();
    const minutes = status ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 1440);
    return new Date(now.getTime() - minutes * 60000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Calculate statistics
  const totalRooms = Object.keys(roomsData).length;
  const totalDevices = Object.values(roomsData).reduce((acc, room) => acc + (room.devices?.length || 0), 0);
  const devicesOn = Object.values(roomsData).reduce((acc, room) => 
    acc + (room.devices?.filter(device => device.status).length || 0), 0
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
      setRoomsData(prev => ({
        ...prev,
        [newRoomName.trim()]: {
          devices: []
        }
      }));
      setNewRoomName('');
      setAddRoomDialogOpen(false);
    }
  };
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRoomName, setEditRoomName] = useState('');
  const [editDevices, setEditDevices] = useState([]);
  const [originalRoomName, setOriginalRoomName] = useState('');

  const handleDeviceToggle = (roomName, deviceIdx) => {
    setRoomsData(prevRooms => {
      const updatedRooms = { ...prevRooms };
      const updatedDevices = [...updatedRooms[roomName].devices];
      updatedDevices[deviceIdx] = {
        ...updatedDevices[deviceIdx],
        status: !updatedDevices[deviceIdx].status
      };
      updatedRooms[roomName] = {
        ...updatedRooms[roomName],
        devices: updatedDevices
      };
      return updatedRooms;
    });
  };

  const handleEditRoom = (roomName) => {
    setEditRoomName(roomName);
    setOriginalRoomName(roomName);
    if (roomsData[roomName]?.devices) {
      setEditDevices(roomsData[roomName].devices.map(device => ({ ...device })));
    } else {
      setEditDevices([]);
    }
    setEditDialogOpen(true);
  };

  const handleDeviceNameChange = (idx, newName) => {
    setEditDevices(devs => devs.map((d, i) => i === idx ? { ...d, name: newName } : d));
  };

  const handleEditAddDevice = () => {
    setEditDevices(devs => [...devs, { name: '', status: false }]);
  };

  const handleRemoveDevice = (idx) => {
    setEditDevices(devs => devs.filter((_, i) => i !== idx));
  };

  const handleSaveRoom = () => {
    setRoomsData(prevRooms => {
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

  return (
    <Box sx={{ p: 4 }}>
      {/* Home Statistics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Home Overview
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatCard>
              <Typography variant="h6" color="primary" gutterBottom>
                Total Rooms
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {Object.keys(roomsData).length}
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatCard>
              <Typography variant="h6" color="primary" gutterBottom>
                Total Devices
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {Object.values(roomsData).reduce((acc, room) => acc + (room.devices?.length || 0), 0)}
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatCard>
              <Typography variant="h6" color="primary" gutterBottom>
                Devices ON
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {Object.values(roomsData).reduce((acc, room) => 
                  acc + (room.devices?.filter(device => device.status).length || 0), 0)
                }
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <StatCard>
              <Typography variant="h6" color="primary" gutterBottom>
                Devices OFF
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {Object.values(roomsData).reduce((acc, room) => 
                  acc + (room.devices?.filter(device => !device.status).length || 0), 0)
                }
              </Typography>
            </StatCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Room Controls Section */}
      <Box sx={{ mb: 3 }}>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddRoomDialogOpen(true)}
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
              <StyledPaper sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
                    {roomName}
                  </Typography>
                  <Box>
                    <StyledIconButton onClick={() => handleEditRoom(roomName)} size="large">
                      <EditIcon />
                    </StyledIconButton>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  {roomData.devices?.map((device, deviceIdx) => (
                    <Grid item xs={12} key={deviceIdx}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 },
                      }}>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>{device.name}</Typography>
                        <StyledSwitch
                          checked={device.status}
                          onChange={() => handleDeviceToggle(roomName, deviceIdx)}
                          size="medium"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </StyledPaper>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Room Status
              </Typography>
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
                <Box sx={{ p: 2, textAlign: 'center', background: 'rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Room Temperature
                  </Typography>
                  <Typography variant="h3">
                    {Math.floor(Math.random() * 15) + 20}°C
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, textAlign: 'center', background: 'rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
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
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StyledSwitch
                      checked={device.status}
                      onChange={(e) => {
                        setRoomsData(prev => {
                          const updatedRooms = { ...prev };
                          const updatedDevices = [...updatedRooms[selectedRoom].devices];
                          updatedDevices[index] = { ...device, status: e.target.checked };
                          updatedRooms[selectedRoom] = { ...updatedRooms[selectedRoom], devices: updatedDevices };
                          return updatedRooms;
                        });
                      }}
                    />
                    <Typography sx={{ ml: 2 }}>
                      {device.name}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
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
            onChange={e => setEditRoomName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>Devices</Typography>
          {editDevices.map((device, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label={`Device ${idx + 1}`}
                value={device.name}
                onChange={e => handleDeviceNameChange(idx, e.target.value)}
                size="small"
                sx={{ flex: 1, mr: 1 }}
              />
              <IconButton onClick={() => handleRemoveDevice(idx)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleEditAddDevice} color="primary">
            Add Device
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveRoom} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addDeviceDialogOpen} onClose={() => setAddDeviceDialogOpen(false)}>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Select Room:</Typography>
            <Select
              value={selectedRoomForDevice}
              onChange={e => setSelectedRoomForDevice(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            >
              {Object.keys(roomsData).map(room => (
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
          <Button onClick={() => setAddDeviceDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddDevice} variant="contained">Add Device</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addRoomDialogOpen} onClose={() => setAddRoomDialogOpen(false)}>
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
          <Button onClick={handleAddNewRoom} variant="contained">Add Room</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
