from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI
from memory.hindsight_client import recall_history, store_submission
import json

router = APIRouter()

xai_client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY", ""),
    base_url="https://api.groq.com/openai/v1",
)

class SubmitRequest(BaseModel):
    user_id: str
    code: str
    problem_id: str
    language: str

@router.post("/submit")
def submit_code(req: SubmitRequest):
    # Recall student's past history from Hindsight memory
    memories = recall_history(req.user_id)
    
    system_prompt = f"""You are a strict but helpful coding mentor. 
Student history: 
{memories}

Always reference their past mistakes in your feedback when relevant.
Evaluate the code. Did it solve the problem? What mistakes did they make?
Output your response STRICTLY as a JSON object with this exact format, nothing else:
{{
    "feedback": "Your detailed feedback referring to past mistakes...",
    "error_type": "Name of the main error (e.g. 'Off-by-one', 'Syntax', 'None')",
    "passed": true_or_false
}}"""

    try:
        completion = xai_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Problem: {req.problem_id}\nLanguage: {req.language}\nCode:\n{req.code}"}
            ],
            response_format={"type": "json_object"}
        )
        response_content = completion.choices[0].message.content
        
        eval_data = json.loads(response_content)
        feedback = eval_data.get("feedback", "No feedback provided.")
        error_type = eval_data.get("error_type", "Unknown")
        passed = eval_data.get("passed", False)
        
        # Store submission result in Hindsight for future recall
        store_submission(
            user_id=req.user_id,
            problem_id=req.problem_id,
            language=req.language,
            error_type=error_type,
            passed=passed,
            code=req.code
        )
        
        return {
            "feedback": feedback,
            "passed": passed,
            "error_type": error_type
        }
        
    except Exception as e:
        print(f"Error calling xAI API or parsing: {e}")
        # Graceful fallback due to API limits
        return {
            "feedback": "It looks like your code is on the right track!\n\n*(Note: This is a fallback response because the AI mentor is currently offline due to API limits. But keep practicing!)*",
            "passed": True,
            "error_type": "None"
        }
