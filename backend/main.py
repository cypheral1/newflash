from dotenv import load_dotenv
# Load environment variables FIRST, before any imports that read os.environ
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import submit, hint, problem, report, chat

app = FastAPI(title="FlashCode — AI Coding Mentor")

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(submit.router, prefix="/api", tags=["Code Evaluation"])
app.include_router(hint.router, prefix="/api", tags=["AI Hints"])
app.include_router(problem.router, prefix="/api", tags=["Adaptive Problems"])
app.include_router(report.router, prefix="/api", tags=["Weekly Reports"])
app.include_router(chat.router, prefix="/api", tags=["AI Chat"])

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {"status": "ok", "message": "FlashCode AI Coding Mentor API is running."}
