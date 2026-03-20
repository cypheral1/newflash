from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI
from memory.hindsight_client import recall_history, store_chat_memory
from typing import Optional

router = APIRouter()

xai_client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY", ""),
    base_url="https://api.groq.com/openai/v1",
)

class ChatRequest(BaseModel):
    user_id: str
    message: str
    problem_id: Optional[str] = None
    code_context: Optional[str] = None
    conversation_history: list[dict] = []

@router.post("/chat")
def chat_with_mentor(req: ChatRequest):
    """AI chat endpoint — talk to your coding mentor about anything."""
    # Recall student history from Hindsight
    memories = recall_history(req.user_id)
    
    # Build context-aware system prompt
    context_parts = [
        "You are FlashCode AI, a friendly and expert coding mentor.",
        "You help students learn programming through conversation.",
        f"\nStudent history from memory:\n{memories}",
    ]
    
    if req.code_context:
        context_parts.append(f"\nThe student is currently working on this code:\n```\n{req.code_context}\n```")
    
    if req.problem_id:
        context_parts.append(f"\nThey are solving problem: {req.problem_id}")
    
    context_parts.append(
        "\nBe encouraging but honest. Reference their past mistakes when relevant. "
        "Use code examples when helpful. Keep responses concise and actionable. "
        "Format your responses with markdown for readability."
    )
    
    system_prompt = "\n".join(context_parts)
    
    # Build messages list with conversation history
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add up to last 10 messages of conversation history
    for msg in req.conversation_history[-10:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    
    # Add the current message
    messages.append({"role": "user", "content": req.message})
    
    try:
        completion = xai_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
        )
        
        response_text = completion.choices[0].message.content
        
        # Store the interaction in Hindsight so the AI actually remembers it
        store_chat_memory(
            user_id=req.user_id,
            problem_id=req.problem_id,
            user_msg=req.message,
            ai_response=response_text
        )
        
        return {
            "response": response_text,
            "model": "llama-3.3-70b-versatile",
        }
        
    except Exception as e:
        print(f"Error in chat: {e}")
        # Graceful fallback due to API credit limits
        return {
            "response": "I'm sorry, I'm currently unable to chat because of API credit limits. Please check your xAI or Hindsight console to add credits!\n\n*(Fallback Mode)*",
            "model": "fallback-offline",
        }
