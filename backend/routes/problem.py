from fastapi import APIRouter, HTTPException
import os
from openai import OpenAI
from memory.hindsight_client import get_weak_spots
import json

router = APIRouter()

xai_client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY", ""),
    base_url="https://api.groq.com/openai/v1",
)

@router.get("/problem")
def get_adaptive_problem(user_id: str):
    # Query Hindsight for student's weak spots
    weak_spots = get_weak_spots(user_id)
    weak_spots_str = ", ".join(weak_spots) if weak_spots else "No specific weak spots identified yet"
    
    system_prompt = f"""You are an expert computer science instructor.
The student has weak spots in: {weak_spots_str}.
Generate a NEW coding problem that specifically targets these weak spots to help them practice.

Output your response STRICTLY as a JSON object with this exact format:
{{
    "title": "Problem Title",
    "description": "Detailed problem description and requirements...",
    "examples": "Example inputs and outputs...",
    "difficulty": "Easy / Medium / Hard"
}}"""

    try:
        completion = xai_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate an adaptive problem for me."}
            ],
            response_format={"type": "json_object"}
        )
        
        problem_data = json.loads(completion.choices[0].message.content)
        return problem_data
        
    except Exception as e:
        print(f"Error generating problem: {e}")
        # Graceful fallback due to API credit limits
        return {
            "title": "Reverse Linked List (AI Fallback)",
            "description": "Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.\n\n*Note: This is a fallback problem because the AI mentor is currently unreachable (API credit limit).* \n\nLet's keep practicing!",
            "examples": "Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
            "difficulty": "Easy"
        }
