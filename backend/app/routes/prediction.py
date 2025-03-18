from typing import Optional
from fastapi import APIRouter, Form, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import logging
from app.services.firebase import verify_firebase_token, upload_to_firebase, update_user_images
from app.services.model import predict_mask, preprocess_image
from io import BytesIO
from PIL import Image, UnidentifiedImageError
import time
from app.services.firebase import db
from app.utils.encryption import encrypt_data, decrypt_data
from app.services.openai import extract_image_features, generate_medical_report

router = APIRouter()

# Configure logger
logging.basicConfig(level=logging.INFO)

@router.post("/predict")
async def predict(
    user_id: str = Form(...),
    firebase_token: str = Form(...),
    image: UploadFile = File(...),
    patient_name: Optional[str] = Form(None),
    verified_user: dict = Depends(verify_firebase_token)
):
    """
    Handle the prediction request: Upload image and mask to Firebase Storage, make a prediction, 
    return the result, and store the image URLs in Firestore.
    """
    try:
        # Log the received values
        logging.info(f"Received user_id: {user_id}")
        logging.info(f"Verified user: {verified_user}")  # Log the decoded token information

        # Validate file type
        if not image.filename.lower().endswith((".jpg", ".jpeg")):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a JPG or JPEG image.")

        # Read and validate image data
        image_data = await image.read()
        try:
            input_image = Image.open(BytesIO(image_data))
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Invalid image file. Could not process the uploaded image.")

        # Generate a unique filename based on user_id and current time
        timestamp = int(time.time())
        base_name = f"{user_id}_{timestamp}"

        # Upload the original image to Firebase
        original_image_url = upload_to_firebase("procare-images/image", f"{base_name}_original.jpg", image_data, "image/jpeg")

        # Preprocess the image and make a prediction
        preprocessed_image = preprocess_image(input_image)
        predicted_mask = predict_mask(preprocessed_image)

        # Convert the prediction to an image
        mask_image = Image.fromarray((predicted_mask * 255).astype("uint8"))  # Convert to grayscale image

        # Save the mask to a BytesIO buffer
        mask_byte_arr = BytesIO()
        mask_image.save(mask_byte_arr, format="JPEG")
        mask_byte_arr.seek(0)

        # Upload the mask image to Firebase
        mask_image_url = upload_to_firebase("procare-images/mask", f"{base_name}_mask.jpg", mask_byte_arr.getvalue(), "image/jpeg")

        # Update the Firestore document with the image URLs
        update_user_images(user_id, original_image_url, mask_image_url)

        if patient_name:
            encrypted_name = encrypt_data(patient_name)
            db.collection('patients').add({
                'name': encrypted_name,
                'doctor_id': user_id,
                'results': {
                    'original_image_url': original_image_url,
                    'mask_image_url': mask_image_url,
                }
            })

        # Return the response with image and mask URLs
        return JSONResponse(
            content={
                "message": "Prediction successful",
                "original_image_url": original_image_url,
                "mask_image_url": mask_image_url,
            }
        )

    except HTTPException as http_ex:
        logging.error(http_ex)
        raise http_ex
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/patients")
async def get_patients(
    doctor_id: str = Form(...),   # Doctor's ID, passed as a form field
    name: Optional[str] = Form(None),  # Patient's name, passed as a form field
    firebase_token: str = Form(...),  # Firebase token for authentication
    verified_user: dict = Depends(verify_firebase_token)  # Verify the user's identity
):
    """
    Fetch patients assigned to the doctor based on doctor's ID and patient name.
    """
    try:
        # Ensure the requesting doctor is the one associated with the doctor_id
        if verified_user.get("uid") != doctor_id:
            raise HTTPException(status_code=403, detail="Unauthorized access. Only the doctor can fetch their patients.")

        # Query Firestore
        
        if name:
            print(name, "name")
            encrypted_name = encrypt_data(name)
            print(encrypted_name)
            patients_snapshot = (
                db.collection('patients')
                .where('doctor_id', '==', doctor_id)
                .where('name', '==', encrypted_name)
                .limit(10)
                .stream()
            )
        else:
            patients_snapshot = (
                db.collection('patients')
                .where('doctor_id', '==', doctor_id)
                .limit(10)
                .stream()
            )

        patients = []
        for doc in patients_snapshot:
            data = doc.to_dict()
            data["name"] = decrypt_data(data["name"])
            patients.append({"id": doc.id, **data})

        return {"patients": patients}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error fetching patients: {str(e)}")

@router.post("/generate_report")
async def generate_report(
    mri_image: UploadFile = File(...),
    mask_image: UploadFile = File(...),
    patient_history: str = Form(...),
    firebase_token: str = Form(...),
    verified_user: dict = Depends(verify_firebase_token)
):
    """
    Endpoint to generate a medical severity report from an MRI image, mask, and patient history.
    """
    try:
        # Log received values
        logging.info(f"Received patient history: {patient_history}")
        logging.info(f"Verified user: {verified_user}")

        # Read MRI image and mask image as bytes
        mri_image_data = await mri_image.read()
        mask_image_data = await mask_image.read()

        # Save the images to temporary files for processing (in real-world apps, use proper file storage)
        mri_image_path = "/tmp/mri_image.png"
        mask_image_path = "/tmp/mask_image.png"
        
        with open(mri_image_path, "wb") as f:
            f.write(mri_image_data)
        
        with open(mask_image_path, "wb") as f:
            f.write(mask_image_data)

        # Extract image features from MRI image using OpenAI's CLIP model
        image_features = extract_image_features(mri_image_path)

        # Generate a severity report based on the extracted features and patient history
        severity_report = generate_medical_report(image_features, patient_history)

        # Return the generated report
        return JSONResponse(content={"severity_report": severity_report})

    except Exception as e:
        logging.error(f"Error generating report: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
