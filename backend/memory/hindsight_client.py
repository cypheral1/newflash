"""
Hindsight Cloud API Client
Connects to https://api.hindsight.vectorize.io for persistent AI memory.

Uses tags to scope memories per user_id, so all users share the same bank
but their data is isolated via tag filtering.
"""

import os
import json
import requests
from datetime import datetime, timedelta

# ── Configuration ──────────────────────────────────────────────────
API_BASE = "https://api.hindsight.vectorize.io"
API_KEY = os.environ.get("HINDSIGHT_API_KEY", "")
BANK_NAME = os.environ.get("HINDSIGHT_BANK_NAME", "flashcode")

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}


def _url(path: str) -> str:
    """Build full URL for a bank-scoped endpoint."""
    return f"{API_BASE}/v1/default/banks/{BANK_NAME}{path}"


# ── Core API Calls ─────────────────────────────────────────────────

def retain(content: str, tags: list[str] = None, context: str = None, metadata: dict = None):
    """
    Store a memory item in Hindsight (retain).
    Hindsight auto-extracts facts, entities, and timestamps.
    """
    item = {"content": content}
    if tags:
        item["tags"] = tags
    if context:
        item["context"] = context
    if metadata:
        item["metadata"] = {k: str(v) for k, v in metadata.items()}
    item["timestamp"] = datetime.now().isoformat()

    payload = {"items": [item]}

    try:
        resp = requests.post(_url("/memories/retain"), headers=HEADERS, json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"[Hindsight] Retain failed: {e}")
        return None


def recall(query: str, tags: list[str] = None, types: list[str] = None, max_tokens: int = 4096):
    """
    Recall memories from Hindsight using semantic similarity.
    Returns a list of matching memory results.
    """
    payload = {
        "query": query,
        "max_tokens": max_tokens,
        "budget": "mid",
    }
    if types:
        payload["types"] = types
    if tags:
        payload["tags"] = tags
        payload["tags_match"] = "any"

    try:
        resp = requests.post(_url("/memories/recall"), headers=HEADERS, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data.get("results", [])
    except Exception as e:
        print(f"[Hindsight] Recall failed: {e}")
        return []


def reflect(query: str, tags: list[str] = None, max_tokens: int = 4096):
    """
    Ask Hindsight to reflect — it retrieves relevant memories, world facts,
    and opinions, then uses an LLM to formulate a contextual answer.
    """
    payload = {
        "query": query,
        "max_tokens": max_tokens,
        "budget": "mid",
    }
    if tags:
        payload["tags"] = tags
        payload["tags_match"] = "any"

    try:
        resp = requests.post(_url("/reflect"), headers=HEADERS, json=payload, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        return data.get("text", "")
    except Exception as e:
        print(f"[Hindsight] Reflect failed: {e}")
        return ""


def list_memories(tags: list[str] = None, memory_type: str = None, limit: int = 100):
    """List stored memory units with optional filtering."""
    params = {"limit": limit}
    if memory_type:
        params["type"] = memory_type
    if tags:
        params["tags"] = tags
        params["tags_match"] = "any"

    try:
        resp = requests.get(_url("/memories/list"), headers=HEADERS, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"[Hindsight] List memories failed: {e}")
        return {"items": [], "total": 0}


# ── Application-Level Functions (used by routes) ────────────────────

def store_submission(user_id: str, problem_id: str, language: str, error_type: str, passed: bool, code: str):
    """
    Store a code submission result in Hindsight.
    Uses natural language content so Hindsight can extract facts.
    Tags with user_id for per-user scoping.
    """
    status = "PASSED" if passed else f"FAILED with error: {error_type}"
    content = (
        f"Student '{user_id}' submitted code for problem '{problem_id}' in {language}. "
        f"Result: {status}. "
        f"Code:\n```{language}\n{code}\n```"
    )
    context = "coding practice submission"
    metadata = {
        "problem_id": problem_id,
        "language": language,
        "error_type": error_type,
        "passed": str(passed),
    }
    tags = [f"user:{user_id}", "submission"]

    return retain(content=content, tags=tags, context=context, metadata=metadata)


def store_chat_memory(user_id: str, problem_id: str, user_msg: str, ai_response: str):
    """
    Store an AI Chat interaction in Hindsight.
    This helps the mentor remember what the student asked and what was discussed.
    """
    content = (
        f"Student '{user_id}' asked the AI Mentor a question.\n"
        f"Student: \"{user_msg}\"\n"
        f"Mentor: \"{ai_response}\""
    )
    context = "AI mentor coding chat"
    
    metadata = {"type": "chat_interaction"}
    if problem_id:
        metadata["problem_id"] = problem_id
        content = f"(While working on problem '{problem_id}') " + content
        
    tags = [f"user:{user_id}", "chat"]

    return retain(content=content, tags=tags, context=context, metadata=metadata)


def recall_history(user_id: str):
    """
    Recall past submissions for a student.
    Returns a formatted string for injecting into AI prompts.
    """
    results = recall(
        query=f"coding submissions, mistakes, and errors by student {user_id}",
        tags=[f"user:{user_id}"],
        types=["world", "experience"],
        max_tokens=4096,
    )

    if not results:
        return "No previous history recorded."

    history_lines = []
    for i, r in enumerate(results):
        text = r.get("text", "")
        history_lines.append(f"Memory {i+1}: {text}")

    return "\n\n".join(history_lines)


def get_weak_spots(user_id: str):
    """
    Use Hindsight's reflect to analyze the student's top recurring error types.
    Returns a list of error type strings.
    """
    answer = reflect(
        query=(
            f"What are the top 3 most common error types that student '{user_id}' "
            f"makes in their code submissions? List only the error type names, "
            f"such as 'Off-by-one', 'Syntax Error', 'Null Reference', etc."
        ),
        tags=[f"user:{user_id}"],
    )

    if not answer:
        return []

    # Parse the reflect response — extract error type names
    lines = [line.strip().lstrip("-•*0123456789.) ") for line in answer.split("\n") if line.strip()]
    # Filter to non-empty, reasonable-length items
    errors = [line for line in lines if 3 < len(line) < 60]
    return errors[:3]


def get_recent_history(user_id: str, days: int = 7):
    """
    Recall recent submission history for the weekly report.
    Uses reflect for a more intelligent summary instead of raw recall.
    """
    cutoff = (datetime.now() - timedelta(days=days)).isoformat()

    results = recall(
        query=f"all coding submissions and practice results for student {user_id} in the past {days} days",
        tags=[f"user:{user_id}"],
        types=["world", "experience"],
        max_tokens=8192,
    )

    if not results:
        return []

    # Convert recall results into the format the report route expects
    events = []
    for r in results:
        text = r.get("text", "")
        metadata = r.get("metadata", {})
        events.append({
            "data": {
                "problem_id": metadata.get("problem_id", "unknown"),
                "passed": metadata.get("passed", "").lower() == "true",
                "error_type": metadata.get("error_type", "Unknown"),
            },
            "text": text,
            "timestamp": r.get("mentioned_at", ""),
        })

    return events
