import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../config/firebaseConfig";
import { searchPatients } from "../api/search";
import {
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  Container,
  Paper,
  Button,
} from "@mui/material";
import { getDoc, doc } from "firebase/firestore";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser);
      } else {
        console.log("User is not logged in");
        setLoading(false);
      }
    });

    const fetchUserData = async (currentUser) => {
      try {
        const userRef = doc(db, "users-procare", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);

          if (userData.userType === "doctor") {
            const response = await searchPatients(currentUser, "");
            if (response.success) {
              setPatients(response.patients);
            } else {
              console.error(response.message);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
      setLoading(false);
    };

    return () => unsubscribe();
  }, []);

  const handlePatientClick = (patient) => {
    navigate("/results", { state: { resultUrls: patient.results } });
  };

  const handleSearch = async () => {
    const patientName = searchQuery.trim();

    if (patientName) {
      try {
        const currentUser = auth.currentUser;
        const response = await searchPatients(currentUser, patientName);

        if (response.success) {
          setPatients(response.patients);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error searching patients:", error.message);
      }
    }
  };

  return user ? (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box mb={4}>
            <Typography variant="h5" gutterBottom>
              User Information
            </Typography>
            {loading ? (
              <Typography>Loading user information...</Typography>
            ) : user ? (
              <>
                <Typography>
                  <strong>Name:</strong> {user.name || "N/A"}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {user.email || "N/A"}
                </Typography>
                <Typography>
                  <strong>User Type:</strong> {user.userType || "N/A"}
                </Typography>
              </>
            ) : (
              <Typography>User not found.</Typography>
            )}
          </Box>

          {user?.userType === "doctor" && (
            <>
              <Box sx={{ display: "flex", mb: 4 }}>
                <TextField
                  label="Search Patients"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ mr: 2, width: 300 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  sx={{ height: "100%" }}
                >
                  Search
                </Button>
              </Box>

              <Typography variant="h5" gutterBottom>
                Patients
              </Typography>
              <List>
                {patients.map((patient) => (
                  <ListItem key={patient.id}>
                    <Typography>{patient.name}</Typography>
                    <Button
                      variant="outlined"
                      color="success"
                      sx={{ ml: 2 }}
                      onClick={() => handlePatientClick(patient)}
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Paper>
      </Container>
    </div>
  ) : (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" align="center">
        Please sign in to view your profile.
      </Typography>
    </div>
  );
};

export default Profile;