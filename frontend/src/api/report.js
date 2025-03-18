export const analyzeImage = async (image, user, patientName) => {
	try {
	  const token = await user.getIdToken();
  
	  const formData = new FormData();
	  formData.append("user_id", user.uid || "default_user_id"); 
	  formData.append("firebase_token", token);
	  formData.append("patient_name", patientName); 
	  formData.append("image", image); 
  
	  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  
	  const response = await fetch(`${backendUrl}/predict`, {
		method: "POST",
		body: formData,
	  });
  
	  const data = await response.json();
  
	  if (response.ok) {
		return { success: true, data }; 
	  } else {
		return { success: false, message: data.detail || "Something went wrong." };
	  }
	} catch (error) {
	  console.error("Error analyzing image:", error);
	  return { success: false, message: "Error analyzing image. Please try again." };
	}
  };
  