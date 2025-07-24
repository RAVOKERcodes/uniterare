from typing import Tuple, Dict, Any, List
from utils.database import get_db_connection
from utils.text_processing import strip_think_block
from config.settings import groq_client

def get_disease_suggestions(query: str) -> Dict[str, Any]:
    """Get disease suggestions based on query"""
    try:
        with get_db_connection() as (cursor, conn):
            cursor.execute(
                "SELECT DISTINCT disease FROM diseases WHERE disease ILIKE %s LIMIT 10;",
                (f"%{query}%",)
            )
            suggestions = [row[0] for row in cursor.fetchall()]
            return {"suggestions": suggestions}
    except Exception as e:
        return {"success": False, "error": str(e)}

def fetch_or_generate_description(disease_name: str) -> Tuple[Dict[str, Any], int]:
    """Fetch or generate disease description"""
    try:
        with get_db_connection() as (cursor, conn):
            cursor.execute("SELECT id, description FROM diseases WHERE disease ILIKE %s;", (disease_name,))
            result = cursor.fetchone()

            if not result:
                return {"success": False, "message": "Disease not found in the database."}, 404

            disease_id, description = result

            if description and description.strip():
                return {
                    "success": True,
                    "message": "Description already in database.",
                    "disease": disease_name,
                    "description": description
                }, 200

            prompt = f"{disease_name}: give long description, symptoms, Clinical Significance, related disorders, treatment, and key aspects."

            completion = groq_client.chat.completions.create(
                model="deepseek-r1-distill-llama-70b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.6,
                max_tokens=2048,
                top_p=0.95,
                stream=False,
            )

            raw_output = completion.choices[0].message.content.strip()
            final_content = strip_think_block(raw_output)

            cursor.execute("UPDATE diseases SET description = %s WHERE id = %s;", (final_content, disease_id))
            conn.commit()

            return {
                "success": True,
                "message": "Description fetched and stored successfully.",
                "disease": disease_name,
                "description": final_content
            }, 200

    except Exception as e:
        return {"success": False, "message": "Something went wrong", "error": str(e)}, 500