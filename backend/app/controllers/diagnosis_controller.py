import json
import re
from typing import Dict, Any
from config.settings import groq_client
from utils.text_processing import strip_think_block
from utils.file_handler import save_patient_data

def analyze_patient_data(patient_data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze patient data and return diagnosis"""
    try:
        prompt = f"""
You are a medical assistant. Here is a patient's intake information:
{json.dumps(patient_data, indent=2)}

1. Structure the patient details as a JSON object under the key 'patient_details'.
2. Based on the provided information, search for rare diseases that match the patient's symptoms and history.
3. For the top 3 most likely rare diseases, provide the following for each (as an array under the key 'top_rare_diseases', each with a 'score' field indicating likelihood):
    - Disease_Name
    - Score (likelihood or relevance) (1-100)
    - Description
    - Disease_Overview
    - Symptoms (array of strings)
    - Clinical_Significance
    - Causes
    - Related_Disorders (Disorders with Similar Symptoms)(array of strings)
    - Diagnosis (array of strings)
    - Treatment (array of strings)
    - Clinical_Trials
    - Key_Aspects
4. Return a single JSON object with keys: patient_details, top_rare_diseases (array of objects as above).

Example output:
{{
  "patient_details": {{ ... }},
  "top_rare_diseases": [
    {{
      "disease_name": "...",
      "score": 92,
      "description": "...",
      "overview": "...",
      "signs_symptoms": ["...", "..."],
      "clinical_significance": "...",
      "causes": "...",
      "related_disorders": ["...", "..."],
      "diagnosis": "...",
      "treatment": "...",
      "clinical_trials": ["...", "..."],
      "key_aspects": ["...", "..."]
    }},
    ...
  ]
}}


IMPORTANT: Do NOT include any reasoning, explanation, <think> tags, or any text before or after the JSON. ONLY return the JSON object as the output.
"""
        completion = groq_client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[{"role": "user", "content": prompt}],
            temperature=1,
            max_tokens=4096,
            top_p=1,
            stream=False,
        )
        
        content = completion.choices[0].message.content.strip()
        content = strip_think_block(content)
        
        # Try to extract JSON from the response
        try:
            # Try to find JSON in the response
            json_match = re.search(r'({.*})', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(1))
            return json.loads(content)
        except json.JSONDecodeError:
            return {"error": "Failed to parse AI response", "raw_response": content}
            
    except Exception as e:
        return {"error": str(e)}

def process_diagnosis(patient_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process patient diagnosis and save data"""
    # Save patient data to file
    save_patient_data(patient_data)
    
    # Analyze patient data
    diagnosis = analyze_patient_data(patient_data)
    
    if "error" in diagnosis:
        return {
            "success": False,
            "message": "Diagnosis failed",
            "error": diagnosis["error"]
        }
    
    return {
        "success": True,
        "data": diagnosis
    }