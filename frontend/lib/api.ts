const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function submitCode(userId: string, code: string, problemId: string, language: string) {
    const res = await fetch(`${API}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, code, problem_id: problemId, language }),
    })
    if (!res.ok) throw new Error('Failed to submit code')
    return res.json()
}

export async function getHint(userId: string, code: string, problemId: string) {
    const res = await fetch(`${API}/api/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, code, problem_id: problemId }),
    })
    if (!res.ok) throw new Error('Failed to get hint')
    return res.json()
}

export async function getProblem(userId: string) {
    const res = await fetch(`${API}/api/problem?user_id=${encodeURIComponent(userId)}`)
    if (!res.ok) throw new Error('Failed to get problem')
    return res.json()
}

export async function getReport(userId: string) {
    const res = await fetch(`${API}/api/report?user_id=${encodeURIComponent(userId)}`)
    if (!res.ok) throw new Error('Failed to get report')
    return res.json()
}

export async function sendChatMessage(
    userId: string,
    message: string,
    conversationHistory: { role: string; content: string }[] = [],
    problemId?: string,
    codeContext?: string
) {
    const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            message,
            conversation_history: conversationHistory,
            problem_id: problemId || null,
            code_context: codeContext || null,
        }),
    })
    if (!res.ok) throw new Error('Failed to send chat message')
    return res.json()
}
