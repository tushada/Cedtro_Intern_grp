import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import PasswordReset from "./PasswordReset";

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
      : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  position: "relative",
  overflow: "hidden",
}));

const BackgroundPattern = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    theme.palette.mode === "dark"
      ? "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)"
      : "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)",
  opacity: 0.1,
  pointerEvents: "none",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 400,
  borderRadius: 24,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backdropFilter: "blur(10px)",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(26, 26, 26, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 48px rgba(0, 0, 0, 0.4)"
        : "0 12px 48px rgba(0, 0, 0, 0.2)",
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(5),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 16,
    transition: "all 0.3s ease",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)",
    "& fieldset": {
      borderColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.12)",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    color:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.7)"
        : "rgba(0, 0, 0, 0.7)",
  },
  "& .MuiInputBase-input": {
    padding: "16px 14px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  height: 56,
  borderRadius: 16,
  fontWeight: "bold",
  textTransform: "none",
  fontSize: "1.1rem",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  fontWeight: 500,
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.dark,
    textDecoration: "underline",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: "16px auto",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  width: 80,
  height: 80,
  fontSize: 40,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "scale(1.05) rotate(360deg)",
    boxShadow: theme.shadows[4],
  },
}));

const Login = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Log Firebase authentication errors for debugging
  const logFirebaseError = (error) => {
    console.error("Firebase Authentication Error:", {
      code: error.code,
      message: error.message,
      email: email,
      timestamp: new Date().toISOString(),
      authConfig: {
        apiKey: auth.app.options.apiKey,
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId,
      },
    });

    // Add more detailed error information to the error message
    const detailedError = `Authentication Error:
      Code: ${error.code}
      Message: ${error.message}
      Email: ${email}
      Timestamp: ${new Date().toISOString()}`;

    return detailedError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Quick validation before making any async calls
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Log the authentication attempt (non-blocking)
      const authAttempt = {
        email: email,
        timestamp: new Date().toISOString(),
      };
      console.log("Attempting to authenticate:", authAttempt);

      // Proceed with authentication without artificial delay
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("Authentication successful:", userCredential.user.email);
      onLogin();
    } catch (error) {
      const detailedError = logFirebaseError(error);

      // Handle specific Firebase authentication errors
      const errorCode = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case "auth/invalid-email":
          setError("Please enter a valid email address");
          break;
        case "auth/user-not-found":
          setError(
            "No user found with this email address. Please check the email or create a new account.",
          );
          setShowRegistration(true);
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;
        case "auth/invalid-credential":
          setError(
            "Invalid credentials. Please check your email and password.",
          );
          break;
        default:
          setError(detailedError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Quick validation before making any async calls
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Log the registration attempt (non-blocking)
      const registerAttempt = {
        email: email,
        timestamp: new Date().toISOString(),
      };
      console.log("Attempting to register:", registerAttempt);

      // Proceed with registration without artificial delay
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User registered successfully:", userCredential.user.email);
      setError("Account created successfully! Please log in.");
      setShowRegistration(false);
    } catch (error) {
      const detailedError = logFirebaseError(error);
      setError(`Registration failed: ${error.message}`);
      console.error("Registration failed:", detailedError);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  if (showPasswordReset) {
    return <PasswordReset onBack={() => setShowPasswordReset(false)} />;
  }

  return (
    <StyledContainer>
      <BackgroundPattern />
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: "100%",
          maxWidth: { xs: "95vw", sm: 400 },
          mx: "auto",
        }}
      >
        <StyledPaper sx={{ p: { xs: 2, sm: 4 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 2, sm: 4 },
              p: { xs: 2, sm: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <StyledAvatar>
                <LockIcon />
              </StyledAvatar>
              <Typography
                variant="h4"
                component="h1"
                color="primary"
                textAlign="center"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                {showRegistration ? "Create Account" : "Sign in"}
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: 2,
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={showRegistration ? handleRegister : handleSubmit}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <StyledTextField
                  fullWidth
                  label="Email Address"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                  }}
                  autoComplete="email"
                  error={error && error.includes("email")}
                  helperText={error && error.includes("email") ? error : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          error && error.includes("email")
                            ? theme.palette.error.main
                            : undefined,
                      },
                    },
                  }}
                />

                <StyledTextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    showRegistration ? "new-password" : "current-password"
                  }
                  error={error && error.includes("password")}
                  helperText={error && error.includes("password") ? error : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VisibilityIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          error && error.includes("password")
                            ? theme.palette.error.main
                            : undefined,
                      },
                    },
                  }}
                />

                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    height: 56,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {loading ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                    >
                      <CircularProgress
                        size={20}
                        sx={{
                          color: theme.palette.primary.contrastText,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.primary.contrastText,
                          fontWeight: 600,
                        }}
                      >
                        {showRegistration ? "Creating..." : "Signing in..."}
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon
                        sx={{
                          fontSize: 20,
                          color: theme.palette.primary.contrastText,
                        }}
                      />
                      {showRegistration ? "Create Account" : "Sign In"}
                    </Box>
                  )}
                </StyledButton>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: 18,
                        color: theme.palette.text.secondary,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?
                    </Typography>
                    <Button
                      color="primary"
                      size="small"
                      onClick={handleNavigateToRegister}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Create one
                    </Button>
                  </Box>

                  <Button
                    fullWidth
                    variant="text"
                    color="primary"
                    onClick={() => setShowPasswordReset(true)}
                    sx={{
                      mt: 1,
                      height: 40,
                      borderRadius: 2,
                      textTransform: "none",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          theme.palette.mode === "dark"
                            ? "linear-gradient(45deg, rgba(144, 202, 249, 0.1) 0%, rgba(144, 202, 249, 0.05) 100%)"
                            : "linear-gradient(45deg, rgba(144, 202, 249, 0.05) 0%, rgba(144, 202, 249, 0.02) 100%)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      },
                      "&:hover::before": {
                        opacity: 1,
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: theme.palette.primary.main,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          color: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <LockIcon
                        sx={{
                          fontSize: 18,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "rotate(-10deg)",
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                        }}
                      >
                        Forgot Password?
                      </Typography>
                    </Box>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </StyledContainer>
  );
};

export default Login;
