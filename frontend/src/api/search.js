export const searchPatients = async (user, patientName) => {
	try {
	  const token = await user.getIdToken(); // Fetch Firebase token for authentication
	  console.log("patientName", patientName);
  
	  // Prepare FormData to send to the backend
	  const formData = new FormData();
	  formData.append("doctor_id", user.uid || "default_user_id"); // Use the doctor's unique ID
	  formData.append("firebase_token", token); // Send the Firebase token for authentication
	  formData.append("name", patientName); // Attach the patient's name
  
	  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  
	  // Call the backend API
	  const response = await fetch(`${backendUrl}/patients`, {
		method: "POST",
		body: formData,
	  });
  
	  const data = await response.json();
  
	  if (response.ok) {
		return { success: true, patients: data.patients }; // Return success with the patients data
	  } else {
		return { success: false, message: data.detail || "Something went wrong." }; // Handle errors
	  }
	} catch (error) {
	  console.error("Error searching patients:", error);
	  return { success: false, message: "Error searching patients. Please try again." };
	}
  };
  