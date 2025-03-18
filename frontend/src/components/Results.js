import React, { useEffect, useState } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Card, Link, Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from "../config/firebaseConfig"; // Import the auth from your firebase configuration

const Results = () => {
  const { state } = useLocation();
  const resultUrls = state?.resultUrls;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imageUrls, setImageUrls] = useState({ originalImageUrl: "", maskImageUrl: "" });

  useEffect(() => {
    // Check if the user is authenticated
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && resultUrls) {
      const storage = getStorage();
      
      console.log(resultUrls.original_image_url);
      // Ensure the correct path to the image is specified
      const originalImageRef = ref(storage,  resultUrls.original_image_url);
      const maskImageRef = ref(storage, resultUrls.mask_image_url);

      // Get the download URLs for both images
      getDownloadURL(originalImageRef)
        .then((url) => {
          setImageUrls((prev) => ({ ...prev, originalImageUrl: url }));
        })
        .catch((error) => {
          console.error("Error fetching original image:", error);
        });

      getDownloadURL(maskImageRef)
        .then((url) => {
          setImageUrls((prev) => ({ ...prev, maskImageUrl: url }));
        })
        .catch((error) => {
          console.error("Error fetching mask image:", error);
        });
    }
  }, [isAuthenticated, resultUrls]);

  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#e6f7e6"
        height="calc(100vh - 128px)"
      >
        <Typography variant="h6" color="error">
          Please log in to view the images.
        </Typography>
      </Box>
    );
  }

  return resultUrls ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#e6f7e6"
      height="calc(100vh - 128px)" // Adjust for navbar + footer height
      px={2}
    >
      <Card
        sx={{
          maxWidth: 800,
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0, 128, 0, 0.2)",
          bgcolor: "#ffffff",
          p: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom color="#16a34a">
          Analysis Results
        </Typography>
        <Box
          sx={{
            mt: 3,
            p: 3,
            bgcolor: "#f1fdf1",
            border: "1px solid #16a34a",
            borderRadius: 2,
            boxShadow: "0 2px 5px rgba(0, 128, 0, 0.1)",
          }}
        >
          <Typography>
            <strong>Image Preview:</strong>
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            sx={{ gap: 2 }}
          >
            <Box textAlign="center">
              <Typography variant="subtitle1" gutterBottom>
                Original Image
              </Typography>
              {imageUrls.originalImageUrl ? (
                <img
                  src={imageUrls.originalImageUrl}
                  alt="Original"
                  style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: 8 }}
                />
              ) : (
                <Typography>Loading...</Typography>
              )}
              <Link
                href={imageUrls.originalImageUrl}
                target="_blank"
                color="#16a34a"
                display="block"
                mt={1}
              >
                View Full Image
              </Link>
            </Box>
            <Box textAlign="center">
              <Typography variant="subtitle1" gutterBottom>
                Mask Image
              </Typography>
              {imageUrls.maskImageUrl ? (
                <img
                  src={imageUrls.maskImageUrl}
                  alt="Mask"
                  style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: 8 }}
                />
              ) : (
                <Typography>Loading...</Typography>
              )}
              <Link
                href={imageUrls.maskImageUrl}
                target="_blank"
                color="#16a34a"
                display="block"
                mt={1}
              >
                View Full Image
              </Link>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#16a34a",
              color: "white",
              textTransform: "none",
              px: 4,
              "&:hover": { bgcolor: "#0f9c2d" },
            }}
            component={RouterLink}
            to="/"
          >
            Analyze Another Image
          </Button>
        </Box>
      </Card>
    </Box>
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#e6f7e6"
      height="calc(100vh - 128px)"
    >
      <Typography variant="h6" color="error">
        No results found! Please analyze an image first.
      </Typography>
    </Box>
  );
};

export default Results;
