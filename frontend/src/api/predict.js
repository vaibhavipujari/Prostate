export const analyzeImage = async (image, user, patientName) => {
	try {
	  const token = await user.getIdToken(); // Fetch Firebase token for authentication
  
	  // Prepare FormData to send to backend
	  const formData = new FormData();
	  formData.append("user_id", user.uid || "default_user_id"); // Use a unique identifier for the user
	  formData.append("firebase_token", token); // Send the Firebase token as required by the backend
	  formData.append("patient_name", patientName); // Attach the patient's name
	  formData.append("image", image); // Attach the uploaded image
  
	  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  
	  // Call the backend API
	  const response = await fetch(`${backendUrl}/predict`, {
		method: "POST",
		body: formData,
	  });
  
	  const data = await response.json();
  
	  if (response.ok) {
		return { success: true, data }; // Return success if response is OK
	  } else {
		return { success: false, message: data.detail || "Something went wrong." };
	  }
	} catch (error) {
	  console.error("Error analyzing image:", error);
	  return { success: false, message: "Error analyzing image. Please try again." };
	}
  };
  