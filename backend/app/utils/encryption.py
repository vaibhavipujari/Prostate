import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import hashlib

# Load encryption key from environment variable
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY environment variable is not set.")

# Ensure the key is 32 bytes (256 bits) long by hashing the ENCRYPTION_KEY
key = hashlib.sha256(ENCRYPTION_KEY.encode()).digest()

def encrypt_data(data: str) -> str:
    """Encrypts the provided data deterministically using AES in ECB mode."""
    cipher = AES.new(key, AES.MODE_ECB)
    # Pad data to make its length a multiple of AES block size (16 bytes)
    padded_data = pad(data.encode(), AES.block_size)
    encrypted_data = cipher.encrypt(padded_data)
    return encrypted_data.hex()  # Return the encrypted data as a hex string

def decrypt_data(data: str) -> str:
    """Decrypts the provided data."""
    cipher = AES.new(key, AES.MODE_ECB)
    encrypted_data = bytes.fromhex(data)
    decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)
    return decrypted_data.decode()
