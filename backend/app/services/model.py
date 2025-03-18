import os
from dotenv import load_dotenv
from tensorflow.keras.models import load_model
import numpy as np
from tensorflow.keras.preprocessing.image import img_to_array

# Get model path from the environment variable
MODEL_PATH = os.getenv("MODEL_PATH", "app/model/segmentation_model.keras")

# Set image size for the model's input
IMG_SIZE = (256, 256)

# Load the model globally when the application starts
model = load_model(MODEL_PATH)

def preprocess_image(image):
    """
    Preprocess the input image for prediction.
    Args:
        image (PIL.Image): Input grayscale image.
    Returns:
        np.ndarray: Preprocessed image ready for the model.
    """
    image = image.convert("L")  # Convert to grayscale
    image = image.resize(IMG_SIZE)  # Resize to model's input size
    image = img_to_array(image) / 255.0  # Normalize pixel values to [0, 1]
    return np.expand_dims(image, axis=0)  # Add batch dimension

def predict_mask(preprocessed_image):
    """
    Generate the segmentation mask from the pre-trained model.
    Args:
        preprocessed_image: Preprocessed input image.
    Returns:
        np.ndarray: Predicted mask.
    """
    prediction = model.predict(preprocessed_image)
    return prediction.squeeze()  # Remove batch dimension
