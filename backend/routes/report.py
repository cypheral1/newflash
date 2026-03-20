from fastapi import APIRouter, HTTPException
import os
from openai import OpenAI
from memory.hindsight_client import get_recent_history

router = APIRouter()

xai_client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY", ""),
    base_url="https://api.groq.com/openai/v1",
)

@router.get("/report")
def get_weekly_report(user_id: str):
    # Recall all memories from past 7 days from Hindsight
    recent_events = get_recent_history(user_id, days=7)
    
    if not recent_events:
        return {"report": "You haven't solved any problems this week. Time to start practicing!"}
        
    history_lines = []
    for i, ev in enumerate(recent_events):
        data = ev.get("data", {})
        status = "Passed" if data.get("passed") else f"Failed ({data.get('error_type')})"
        history_lines.append(f"Problem: {data.get('problem_id')}, Status: {status}")
        
    history_str = "\n".join(history_lines)

    system_prompt = f"""You are an encouraging coding mentor.
Here is the student's submission history for the past 7 days:
{history_str}

Analyze their performance and generate a concise weekly report.
Example format: 'You made 5 off-by-one errors in loops this week. Here is a targeted drill for you.'
Keep it under 3 short paragraphs."""

    try:
        completion = xai_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate my weekly report."}
            ]
        )
        
        report_text = completion.choices[0].message.content
        return {"report": report_text}
        
    except Exception as e:
        print(f"Error generating report: {e}")
        # Graceful fallback due to API credit limits
        return {"report": "Great job practicing this week! You've tackled some tough problems.\n\n*(Note: This is a fallback report because your AI mentor is currently offline due to API limits. Keep up the good work!)*"}
