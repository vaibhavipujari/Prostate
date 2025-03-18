import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateCurrentUser } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Import MUI components
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography, Box, Divider, Snackbar, CircularProgress } from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon, ArrowBack } from '@mui/icons-material';

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "", // User type must be selected
  });
  const [isSocialSignUp, setIsSocialSignUp] = useState(false); // Track if it's a social sign-up
  const [loading, setLoading] = useState(false); // Loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Success or error message
  const navigate = useNavigate();

  // Handle input changes for traditional sign-up
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save user data in Firestore
  const saveUserDataInFirestore = async (uid, name, email, userType) => {
    try {
      await setDoc(doc(db, "users-procare", uid), {
        name,
        email,
        userType,
      });
      console.log("User data saved in Firestore");
    } catch (error) {
      console.error("Error saving user data to Firestore:", error.message);
      showSnackbar("Failed to save user information. Please try again.", "error");
    }
  };

  // Handle traditional sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.userType) {
      showSnackbar("Please select your user type!", "error");
      return;
    }

    if (!userData.name || !userData.email || !userData.password) {
      showSnackbar("Please fill in all fields!", "error");
      return;
    }

    setLoading(true); // Start loading spinner

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Update the user's name in Firebase Authentication
      const user = userCredential.user;
      user.displayName = userData.name;
      await updateCurrentUser(auth, user);


      // Save user details in Firestore
      await saveUserDataInFirestore(user.uid, userData.name, user.email, userData.userType);

      showSnackbar(`Registration successful! Welcome, ${userData.name} (${userData.userType})`, "success");
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error registering user:", error.message);
      showSnackbar("Registration failed. Please try again.", "error");
    } finally {
      setLoading(false); // End loading spinner
    }
  };

  // Social Sign-Up Handlers
  const handleSocialSignUp = async (provider) => {
    setLoading(true); // Start loading spinner
    try {
      const result = await signInWithPopup(auth, provider);
      setUserData((prevData) => ({
        ...prevData,
        name: result.user.displayName,
        email: result.user.email,
      }));
      setIsSocialSignUp(true); // Mark it as a social sign-up
    } catch (error) {
      console.error("Social sign-up error:", error.message);
      showSnackbar("Social sign-up failed. Please try again.", "error");
    } finally {
      setLoading(false); // End loading spinner
    }
  };

  // Finalize Social Sign-Up
  const finalizeSocialSignUp = async () => {
    if (!userData.userType) {
      showSnackbar("Please select your user type!", "error");
      return;
    }

    setLoading(true); // Start loading spinner
    try {
      const user = auth.currentUser;

      // Save user details in Firestore
      await saveUserDataInFirestore(user.uid, userData.name, userData.email, userData.userType);

      showSnackbar(`Registration successful! Welcome, ${userData.name} (${userData.userType})`, "success");
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error finalizing social sign-up:", error.message);
      showSnackbar("Failed to complete registration. Please try again.", "error");
    } finally {
      setLoading(false); // End loading spinner
    }
  };

  // Snackbar to show messages
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, mt: 12 }}>

      <Box sx={{ display: 'flex', gap:12, alignItems: 'center'}}>
        <Link to='/'>
          <ArrowBack />
        </Link>
          <Typography variant="h4" align="center" gutterBottom>Sign Up</Typography>
      </Box>
      

      {!isSocialSignUp ? (
        <>
          {/* Traditional Sign-Up Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
            />

            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">User Type</FormLabel>
              <RadioGroup row name="userType" value={userData.userType} onChange={handleChange}>
                <FormControlLabel value="patient" control={<Radio />} label="Patient" />
                <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ padding: '0.75rem', backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>Or sign up with</Divider>

          {/* Social Sign-Up Buttons */}
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={() => handleSocialSignUp(new GoogleAuthProvider())}
            sx={{ mb: 2 }}
            disabled={loading}
          >
            Sign Up with Google
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<FacebookIcon />}
            onClick={() => handleSocialSignUp(new FacebookAuthProvider())}
            disabled={loading}
          >
            Sign Up with Facebook
          </Button>
        </>
      ) : (
        <>

          {/* Finalize Social Sign-Up */}
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Welcome, <strong>{userData.name}</strong>! Please select your user type to complete the registration.
          </Typography>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">User Type</FormLabel>
            <RadioGroup row name="userType" value={userData.userType} onChange={handleChange}>
              <FormControlLabel value="patient" control={<Radio />} label="Patient" />
              <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
            </RadioGroup>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={finalizeSocialSignUp}
            disabled={loading}
            sx={{ padding: '0.75rem', backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Complete Registration"}
          </Button>
        </>
      )}

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default SignUp;
