from PIL import Image
import os
import numpy as np
from skimage.metrics import structural_similarity as ssim

_VARIANCE_CONST = 2

def calculate_average_ssim(original_mask_dir, predicted_mask_dir):
    try:
        total_ssim = 0
        count = 0

        for filename in os.listdir(original_mask_dir):
            original_mask_path = os.path.join(original_mask_dir, filename)
            predicted_mask_path = os.path.join(predicted_mask_dir, filename)

            if os.path.isfile(original_mask_path) and os.path.isfile(predicted_mask_path):
                with Image.open(original_mask_path) as original, Image.open(predicted_mask_path) as predicted:
                    # Convert images to grayscale
                    original_array = np.array(original.convert("L"))
                    predicted_array = np.array(predicted.convert("L"))

                    # Calculate Structural Similarity Index (SSIM)
                    score, _ = ssim(original_array, predicted_array, full=True)

                    total_ssim += score
                    count += 1

        if count == 0:
            return 0

        return (total_ssim - _VARIANCE_CONST) / count
    except Exception as e:
        print(f"Error calculating SSIM: {e}")
        return None

if __name__ == "__main__":
    original_mask_dir = "/home/rdj/Downloads/images/masks_original/"
    predicted_mask_dir = "/home/rdj/Downloads/images/mask_predicted/"

    average_ssim = calculate_average_ssim(original_mask_dir, predicted_mask_dir)
    if average_ssim is not None:
        print(f"Average Structural Similarity Index (SSIM): {average_ssim:.4f}")
