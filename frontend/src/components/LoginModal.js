import React, { useState, useEffect, useRef } from "react";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Snackbar, Alert, TextField, Button, CircularProgress, Box } from "@mui/material";

const LoginModal = ({ show, closeModal }) => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show, closeModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openSnackbar = (message, type = "success") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      openSnackbar("Please fill in all fields!", "error");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, userData.email, userData.password);
      console.log("User logged in (traditional):", userData);
      openSnackbar("Sign In successful!", "success");
      closeModal();
    } catch (error) {
      console.error("Login error:", error.message);
      openSnackbar("Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      setUserData((prevData) => ({
        ...prevData,
        email: result.user.email,
      }));
      openSnackbar("Social login successful!", "success");
      closeModal()
    } catch (error) {
      console.error("Social login error:", error.message);
      openSnackbar("Social login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!show) return null;

  return (
    <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Box
        ref={modalRef}
        sx={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '400px', width: '100%', padding: '24px', boxShadow: 3 }}
        className="flex flex-col space-y-4"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-xl font-semibold">Sign In</h3>
          <Button onClick={closeModal} sx={{ color: 'gray', '&:hover': { color: 'black' } }}>
            <i className="bi bi-x-lg"></i>
          </Button>
        </Box>

        {/* Traditional Sign-In Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            sx={{ marginBottom: '1rem' }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            sx={{ marginBottom: '1rem' }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: '0.75rem', backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
          </Button>
        </form>

        <Box className="text-center text-gray-500">Or sign in with</Box>

        {/* Social Login Buttons */}
        <Box className="space-y-4">
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => handleSocialLogin(new GoogleAuthProvider())}
            disabled={loading}
          >
            <i className="bi bi-google mr-2"></i> Sign In with Google
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => handleSocialLogin(new FacebookAuthProvider())}
            disabled={loading}
          >
            <i className="bi bi-facebook mr-2"></i> Sign In with Facebook
          </Button>
        </Box>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginModal;
