import requests
import urllib.parse
from typing import Dict, Any, List
from utils.database import get_db_connection

def get_drug_suggestions(query: str) -> Dict[str, Any]:
    """Get drug suggestions based on query"""
    try:
        with get_db_connection() as (cursor, conn):
            cursor.execute(
                "SELECT DISTINCT drug_name FROM fda_drugs WHERE drug_name ILIKE %s LIMIT 10;",
                (f"%{query}%",)
            )
            suggestions = [row[0] for row in cursor.fetchall()]
            return {"suggestions": suggestions}
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_drug_info(drug_name: str) -> Dict[str, Any]:
    """Get drug information from database or OpenFDA"""
    try:
        with get_db_connection() as (cursor, conn):
            cursor.execute("""
                SELECT sponsor_name, disease_name
                FROM fda_drugs
                WHERE drug_name ILIKE %s;
            """, (f"%{drug_name}%",))
            rows = cursor.fetchall()

            if not rows:
                return {
                    "success": False,
                    "message": f"Drug '{drug_name}' not found in local database."
                }

            manufacturers = sorted(set(row[0] for row in rows if row[0]))
            existing_disease = next((row[1] for row in rows if row[1]), None)

            if existing_disease:
                return {
                    "success": True,
                    "drug_name": drug_name,
                    "manufacturers": manufacturers,
                    "description": existing_disease
                }

            # Query OpenFDA
            encoded_name = urllib.parse.quote(drug_name)
            url = f"https://api.fda.gov/drug/label.json?search=openfda.brand_name:\"{encoded_name}\"&limit=1"
            response = requests.get(url, timeout=10)
            data = response.json()

            if "results" not in data or not data["results"]:
                return {
                    "success": True,
                    "drug_name": drug_name,
                    "manufacturers": manufacturers,
                    "description": "No disease info found in OpenFDA."
                }

            result = data["results"][0]

            def clean_section(field, label):
                val = result.get(field, [None])[0]
                if val:
                    val_clean = val.strip().replace("\n", " ")
                    return f"**{label}:**\n{val_clean}\n\n"
                return ""

            formatted = f"**{drug_name.title()}: A Comprehensive Overview**\n\n"
            formatted += clean_section("indications_and_usage", "Indications and Usage")
            formatted += clean_section("overdosage", "Overdosage")
            formatted += clean_section("drug_interactions", "Drug Interactions")
            formatted += clean_section("warnings_and_cautions", "Warnings and Cautions")
            formatted += clean_section("storage_and_handling", "Storage and Handling")
            formatted += clean_section("pregnancy", "Pregnancy")

            formatted = formatted.strip()
            if formatted:
                cursor.execute("""
                    UPDATE fda_drugs
                    SET disease_name = %s
                    WHERE drug_name ILIKE %s;
                """, (formatted, f"%{drug_name}%"))
                conn.commit()

            return {
                "success": True,
                "drug_name": drug_name,
                "manufacturers": manufacturers,
                "description": formatted or "No description available."
            }

    except Exception as e:
        return {"success": False, "message": "Server error", "error": str(e)}