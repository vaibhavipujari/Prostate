# openai_service.py

import openai
from PIL import Image
import logging
import numpy as np
from app.utils.config import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

# Function to extract image features and calculate pixel ratio (mask-to-image ratio)
def extract_image_features(image_path, mask_path):
    try:
        # Open original image and mask image files
        original_image = Image.open(image_path)
        mask_image = Image.open(mask_path)
        
        # Convert images to RGB
        original_image = original_image.convert("RGB")  # Ensure it's RGB
        mask_image = mask_image.convert("L")  # Convert mask to grayscale
        
        # Convert images to numpy arrays
        original_image_np = np.array(original_image)
        mask_image_np = np.array(mask_image)
        
        # Calculate the number of masked pixels
        masked_pixels = np.sum(mask_image_np > 0)  # Assuming non-zero values indicate the mask
        
        # Calculate the ratio of masked pixels to total pixels
        total_pixels = original_image_np.shape[0] * original_image_np.shape[1]
        mask_ratio = masked_pixels / total_pixels

        # Create an embedding (for simplicity, let's assume it's a placeholder function for CLIP)
        image_embedding = "image_embedding_placeholder"  # Ideally, call CLIP here

        # Return the image embedding and mask ratio
        return image_embedding, mask_ratio
    except Exception as e:
        logging.error(f"Error extracting image features: {str(e)}")
        raise

# Function to generate a medical report from image features, mask ratio, and patient history
def generate_medical_report(image_features, mask_ratio, patient_history):
    try:
        # Create the prompt for GPT-4
        prompt = f"""
        Based on the following image features, mask-to-image ratio, and the patient's history, generate a severity report:
        Image Features: {image_features}
        Mask-to-Image Ratio: {mask_ratio:.2%}
        Patient History: {patient_history}
        Generate a detailed severity report describing the MRI scan, the severity of the condition, and any treatment recommendations.
        """
        
        # Send prompt to OpenAI's GPT model
        response = openai.Completion.create(
            model="gpt-4",
            prompt=prompt,
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].text.strip()
    except Exception as e:
        logging.error(f"Error generating medical report: {str(e)}")
        raise
