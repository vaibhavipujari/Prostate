import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import matplotlib.pyplot as plt

# Set image size for resizing (adjust as necessary)
IMG_SIZE = (256, 256)

# Thresholding function to reduce noise in predictions
def apply_threshold_to_predictions(predictions, threshold=0.5):
    """
    Apply threshold to the predicted segmentation masks to remove small noise.
    The output will be binary, with values > threshold set to 1, and others set to 0.
    """
    return (predictions > threshold).astype(np.float32)

# Load image and mask
def load_image_and_mask(image_path, mask_path):
    # Load image as grayscale and resize to target size
    image = load_img(image_path, target_size=IMG_SIZE, color_mode='grayscale')
    mask = load_img(mask_path, target_size=IMG_SIZE, color_mode='grayscale')  # Load mask as grayscale
    
    # Convert to numpy arrays
    image = img_to_array(image) / 255.0  # Normalize the image to [0, 1]
    mask = img_to_array(mask) / 255.0  # Normalize the mask to [0, 1]
    
    # Convert mask to binary (0 or 1)
    mask = np.round(mask)  # Since it's black and white, we can round to get 0 or 1
    
    return image, mask

# Load dataset from images and labels directory
def load_data(images_dir, labels_dir):
    images = []
    masks = []
    
    # Iterate through all images in the 'images' folder
    for i in range(1, 601):  # Assuming your images are named 1.jpg to 600.jpg
        image_name = f"{i}.jpg"
        mask_name = f"{i}.jpg"
        image_path = os.path.join(images_dir, image_name)
        mask_path = os.path.join(labels_dir, mask_name)
        
        if os.path.exists(mask_path):
            # Load the image and mask
            image, mask = load_image_and_mask(image_path, mask_path)
            images.append(image)
            masks.append(mask)
    
    # Convert to numpy arrays
    images = np.array(images)
    masks = np.array(masks)
    
    return images, masks

# U-Net model definition for binary segmentation
def unet_model(input_size=(256, 256, 1)):  # Input size adjusted for grayscale images
    inputs = tf.keras.layers.Input(input_size)
    
    # Encoder (Contracting Path)
    c1 = tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same')(inputs)
    c1 = tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c1)
    p1 = tf.keras.layers.MaxPooling2D((2, 2))(c1)

    c2 = tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same')(p1)
    c2 = tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c2)
    p2 = tf.keras.layers.MaxPooling2D((2, 2))(c2)

    c3 = tf.keras.layers.Conv2D(256, (3, 3), activation='relu', padding='same')(p2)
    c3 = tf.keras.layers.Conv2D(256, (3, 3), activation='relu', padding='same')(c3)
    p3 = tf.keras.layers.MaxPooling2D((2, 2))(c3)

    # Bottleneck (Bottleneck Path)
    c4 = tf.keras.layers.Conv2D(512, (3, 3), activation='relu', padding='same')(p3)
    c4 = tf.keras.layers.Conv2D(512, (3, 3), activation='relu', padding='same')(c4)

    # Decoder (Expansive Path)
    u1 = tf.keras.layers.Conv2DTranspose(256, (2, 2), strides=(2, 2), padding='same')(c4)
    u1 = tf.keras.layers.concatenate([u1, c3])
    c5 = tf.keras.layers.Conv2D(256, (3, 3), activation='relu', padding='same')(u1)
    c5 = tf.keras.layers.Conv2D(256, (3, 3), activation='relu', padding='same')(c5)

    u2 = tf.keras.layers.Conv2DTranspose(128, (2, 2), strides=(2, 2), padding='same')(c5)
    u2 = tf.keras.layers.concatenate([u2, c2])
    c6 = tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same')(u2)
    c6 = tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c6)

    u3 = tf.keras.layers.Conv2DTranspose(64, (2, 2), strides=(2, 2), padding='same')(c6)
    u3 = tf.keras.layers.concatenate([u3, c1])
    c7 = tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same')(u3)
    c7 = tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c7)

    outputs = tf.keras.layers.Conv2D(1, (1, 1), activation='sigmoid')(c7)  # Sigmoid for binary segmentation

    model = tf.keras.models.Model(inputs, outputs)
    return model

# Training Setup
images_dir = '/kaggle/input/prostate/Input Images'
labels_dir = '/kaggle/input/prostate/Ground Truth' 

# Load the data
images, masks = load_data(images_dir, labels_dir)

# Split into train and validation sets (80% train, 20% validation)
X_train, X_val, y_train, y_val = train_test_split(images, masks, test_size=0.2, random_state=42)

# Convert the data to the format expected by the model
X_train = np.array(X_train)
y_train = np.array(y_train)
X_val = np.array(X_val)
y_val = np.array(y_val)

# Create the U-Net model
model = unet_model(input_size=(256, 256, 1))

# Compile the model with Adam optimizer and binary cross-entropy loss
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Set up callbacks for saving the best model and early stopping
callbacks = [
    ModelCheckpoint('/kaggle/working/unet_best_model.keras', save_best_only=True, monitor='val_loss', mode='min'),
    EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
]

# Train the model
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=20,
    batch_size=16,
    callbacks=callbacks
)

# Save the final model
model.save('/kaggle/working/unet_final_model.keras')

# Evaluate the model
loss, accuracy = model.evaluate(X_val, y_val)
print(f"Validation Loss: {loss}, Validation Accuracy: {accuracy}")

# Predict on all validation images
predictions = model.predict(X_val)