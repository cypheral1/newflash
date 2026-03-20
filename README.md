# FlashCode ⚡ | An AI Mentor That Actually Remembers You

![FlashCode Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=FlashCode+%E2%9A%A1+AI+Coding+Mentor)

## 💡 The Inspiration
Standard algorithmic practice platforms (like LeetCode or HackerRank) are static. You solve problems, they say "Correct" or "Wrong Answer", and that's it. If you struggle with dynamic programming or graph traversal, you have to manually hunt for tutorials or similar problems. 

We built **FlashCode** because we wanted an AI mentor that creates a seamless loop of coding, failing, and learning. We wanted an AI that doesn't just evaluate your code in a vacuum, but **remembers your specific weaknesses** to hyper-personalize your practice journey.

## 🚀 What it does
FlashCode is a beautifully designed, minimalist AI coding mentor powered by **Grok AI / Llama 3** and **Hindsight Memory**. 
Every line of code you submit, every mistake you make, and every chat interaction you have is mapped and saved into the Hindsight Memory Engine.

- **Adaptive Problem Generation**: FlashCode analyzes your historical weaknesses and generates completely custom coding challenges targeting the exact concepts you struggle with.
- **Smart Code Editor**: A rich Monaco-based editor with multi-language support (Python, JS, TS, Java, C++, Go, Rust) offering real-time AI evaluation and instant, context-aware feedback.
- **Contextual Smart Hints**: When you're stuck, the AI gives you hints that intentionally reference your past mistakes rather than just giving away the answer.
- **AI Chat Mentor**: A persistent chat interface where the AI mentor has full awareness of your current editor state and your entire historical learning progression.
- **Memory Reports**: Automatically generated weekly performance summaries powered by persistent AI memory tracking your growth.

## 🛠️ How we built it
- **Frontend**: Built with **Next.js 15**, React, and heavily styled with vanilla CSS + Tailwind CSS. The beautiful minimalist UI is inspired by modern tools like Notion and Linear, emphasizing clarity and focus over distracting visual clutter. Features Clerk for authentication.
- **Backend & AI**: A high-performance **FastAPI** backend that acts as the orchestration layer for our AI logic. We integrated **Groq Cloud API** for blisteringly fast LLM inference, and **Hindsight Cloud API** to act as the persistent "brain" of the mentor, storing and retrieving context about the user's coding journey.
- **Code Execution**: Handled securely via the LLM context flow, validating edge cases and Big O constraints on the fly.

## 🛑 Challenges we ran into
Integrating a persistent memory layer that scales uniquely per user was a massive challenge. We had to ensure the LLM didn't just hallucinate feedback, but explicitly leveraged *accurate* historical data retrieved from Hindsight. We fine-tuned the prompt pipeline heavily so the AI mentor would act as a true teacher rather than an answer-bot.

## 🏆 Accomplishments that we're proud of
- Successfully decoupling the "dark mode glowing hacker vibe" typical of coding platforms and delivering a genuinely stunning, bright, human-readable minimalist application.
- Building a seamless, real-time memory loop where failing a problem dynamically informs the very next problem the platform generates for you.

## 📖 What we learned
- How to effectively implement long-term conversational and contextual memory in an LLM application using the Hindsight API.
- Deep architectural patterns in Next.js 15 Server/Client component integration combined with Monaco Editor.

## 🔮 What's next for FlashCode
We want to introduce competitive adaptive arenas (multiplayer where the AI generates a problem balancing the weaknesses of both players), deeper IDE integrations (VS Code Extension), and support for system design architecture questions beyond just algorithmic coding!

---

### Setup Instructions

1. **Clone the repository:**
```bash
git clone https://github.com/your-repo/flashcode.git
cd flashcode
```

2. **Backend Setup (FastAPI):**
```bash
cd backend
python3 -m venv fenv
source fenv/bin/activate
pip install -r requirements.txt
# Set GROQ_API_KEY and HINDSIGHT_API_KEY in .env
uvicorn main:app --reload
```

3. **Frontend Setup (Next.js):**
```bash
cd frontend
npm install
# Set up NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and NEXT_PUBLIC_API_URL in .env.local
npm run dev
```

4. **Visit** `http://localhost:3000` **and start practicing!**
