import os
import json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def save_patient_data(patient_data: dict) -> None:
    """Save patient data to a file"""
    try:
        os.makedirs("patient_data", exist_ok=True)
        user_name = patient_data.get("name", "user").replace(" ", "_")
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_name = f"patient_data/{user_name}_{timestamp}.json"
        with open(file_name, "w") as f:
            json.dump(patient_data, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save patient data: {str(e)}")