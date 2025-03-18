from firebase_admin import credentials, initialize_app, storage, auth, firestore
from firebase_admin.exceptions import FirebaseError
from fastapi import Form, HTTPException
import logging
from app.utils.config import FIREBASE_CREDENTIALS, FIREBASE_STORAGE_BUCKET

# Initialize Firebase Admin SDK
cred = credentials.Certificate(FIREBASE_CREDENTIALS)
initialize_app(cred, {"storageBucket": FIREBASE_STORAGE_BUCKET})

bucket = storage.bucket()
db = firestore.client()

def verify_firebase_token(firebase_token: str = Form(...)) -> dict:
    """
    Verifies the Firebase token sent from the frontend.

    Args:
        token (str): Firebase ID Token.

    Returns:
        dict: Decoded token containing user information.

    Raises:
        HTTPException: If token verification fails.
    """
    try:
        decoded_token = auth.verify_id_token(firebase_token)
        return decoded_token
    except FirebaseError as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification error: {str(e)}")

def upload_to_firebase(directory: str, file_name: str, file_data: bytes, content_type: str):
    """
    Upload a file to Firebase Storage under a specified directory.
    
    Args:
        directory (str): The directory where the file will be uploaded (e.g., 'image' or 'mask').
        file_name (str): The name of the file to be uploaded.
        file_data (bytes): The data of the file to be uploaded.
        content_type (str): The content type of the file (e.g., 'image/jpeg').

    Returns:
        str: The public URL of the uploaded file.
    """
    bucket = storage.bucket()
    blob = bucket.blob(f"{directory}/{file_name}")
    blob.upload_from_string(file_data, content_type=content_type)
    return blob.public_url

def update_user_images(user_id: str, original_image_url: str, mask_image_url: str):
    """
    Updates the Firestore document for the user with the image URLs.
    
    Args:
        user_id (str): The user ID to identify the document.
        original_image_url (str): The URL of the original uploaded image.
        mask_image_url (str): The URL of the generated mask image.
    """
    try:
        # Get the user document
        user_ref = db.collection('users-procare').document(user_id)
        
        # Prepare the data to update
        new_image_data = {
            'images': firestore.ArrayUnion([
                {
                    'original_image_url': original_image_url,
                    'mask_image_url': mask_image_url,
                }
            ])
        }
        
        # Update the user's document with the new image URLs
        user_ref.update(new_image_data)
        logging.info(f"Updated Firestore with image URLs for user {user_id}")
    
    except Exception as e:
        logging.error(f"Error updating Firestore for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating Firestore: {str(e)}")

