from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI
from memory.hindsight_client import recall_history

router = APIRouter()

xai_client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY", ""),
    base_url="https://api.groq.com/openai/v1",
)

class HintRequest(BaseModel):
    user_id: str
    code: str
    problem_id: str

@router.post("/hint")
def get_smart_hint(req: HintRequest):
    # Recall student history from Hindsight for personalized hints
    memories = recall_history(req.user_id)
    
    system_prompt = f"""You are a patient coding mentor.
Student history: 
{memories}

Give ONE hint only. Do not give the full solution. 
Reference their past mistakes if relevant.
Example: 'Last time you forgot the base case in recursion. Check your loop exit condition here.'"""

    try:
        completion = xai_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Problem: {req.problem_id}\nCurrent Code:\n{req.code}\n\nGive me a helpful hint."}
            ]
        )
        hint = completion.choices[0].message.content
        
        return {"hint": hint}
        
    except Exception as e:
        print(f"Error generating hint: {e}")
        # Graceful fallback
        return {"hint": "Try breaking the problem down into smaller steps. Are you handling the edge cases? *(AI mentor offline due to API credit limits)*"}
