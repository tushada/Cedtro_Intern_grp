import React, { useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Box, Button, TextField, Typography, Alert, CircularProgress, Paper } from "@mui/material";

const HomeIdPrompt = ({ userCredential, onSuccess }) => {
  const [homeId, setHomeId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!homeId) {
      setError("Please enter your Home ID");
      return;
    }
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const { deviceId, originalHomeId, updateHomeId } = userDocSnap.data();
        if (deviceId) localStorage.setItem("deviceId", deviceId);
        if (originalHomeId) localStorage.setItem("originalHomeId", originalHomeId);
        if (updateHomeId) localStorage.setItem("updateHomeId", updateHomeId);
        if (updateHomeId !== homeId) {
          setError("Invalid Home ID for this user");
          setLoading(false);
          return;
        }
        // Success: call onSuccess to proceed to dashboard
        onSuccess();
      } else {
        setError("User profile not found");
      }
    } catch (err) {
      setError("Error validating Home ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>Enter Your Home ID</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Home ID"
            value={homeId}
            onChange={(e) => setHomeId(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error}
            autoFocus
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Continue"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default HomeIdPrompt; 