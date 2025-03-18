# Prostate Cancer Detection using CNN-Based Architecture

This repository manages the backend of **Team CAPTIVATORS 3.0's** project for **SIH 2024**. The project aims to detect prostate cancer using a Convolutional Neural Network (CNN) architecture.

## 🚀 Project Overview

Prostate cancer is one of the most prevalent cancers among men worldwide. Early and accurate detection can significantly improve treatment outcomes. Our solution leverages deep learning techniques to analyze MRI scans for efficient and accurate detection of cancerous regions.

### Key Features:
- **Deep Learning Model**: Utilizes a CNN-based architecture optimized for medical imaging.
- **MRI Analysis**: Processes and classifies MRI scans to detect potential cancerous areas.
- **Efficient Backend**: Supports seamless integration with the frontend, ensuring smooth data flow and predictions.

## 📂 Project Structure

```
├── app/models/          # Contains pre-trained and custom CNN models
├── app/datasets/        # MRI scans and corresponding binary masks
├── app/scripts/         # Data preprocessing, training, and evaluation scripts
├── app/routes/          # Backend API endpoints for integration
├── app/services		 # Backend services
└── README.md        # Project documentation
```

## 💻 Getting Started

### Prerequisites
Ensure you have the following installed:
- Python 3.8+
- FastAPI
- Necessary Python libraries (listed in `requirements.txt`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rdj68/prostate_care_backend
   ```
2. Navigate to the project directory:
   ```bash
   cd prostate_care_backend
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Usage

1. **Data Preprocessing**:
   Prepare your dataset using the scripts in the `scripts/` folder.

2. **Training the Model**:
   Run the training script:
   ```bash
   python scripts/train.py
   ```

3. **Launching the Backend**:
   Start the FastAPI server:
   ```bash
   uvicorn api.main:app --reload
   ```

4. **Integration**:
   Access the backend at `http://127.0.0.1:8000` and integrate with the frontend or test using tools like Postman or Swagger UI.

## 📊 Results and Metrics

The CNN model achieves the following:
- High accuracy on test data
- Robust detection of cancerous regions in MRI scans
- Results validated against clinical data for reliability

## 🛠️ Technologies Used

- **Backend**: FastAPI
- **Deep Learning Framework**: TensorFlow/PyTorch
- **Database**: 
- **Deployment**: 

## 🤝 Contributors

- Team CAPTIVATORS 3.0

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

> **Note**: This project is developed as part of the **SIH 2024** competition.