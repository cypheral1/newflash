'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import { getProblem, submitCode, getHint, sendChatMessage } from '@/lib/api'
import { Play, Lightbulb, CheckCircle, XCircle, Loader2, RefreshCw, ChevronDown, MessageCircle, X, Send, Zap } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'rust', 'go']

const DEFAULT_CODE: Record<string, string> = {
    python: '# Write your solution here\ndef solution():\n    pass\n',
    javascript: '// Write your solution here\nfunction solution() {\n  \n}\n',
    typescript: '// Write your solution here\nfunction solution(): void {\n  \n}\n',
    java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
    rust: 'fn main() {\n    // Write your solution here\n}\n',
    go: 'package main\n\nfunc main() {\n    // Write your solution here\n}\n',
}

type Problem = { title: string; description: string; examples: string; difficulty: string }
type FeedbackResult = { feedback: string; passed: boolean; error_type: string }
type ChatMsg = { role: 'user' | 'assistant'; content: string }

export default function PracticePage() {
    const { user } = useUser()
    const userId = user?.id || 'anonymous'

    const [language, setLanguage] = useState('python')
    const [code, setCode] = useState(DEFAULT_CODE['python'])
    const [problem, setProblem] = useState<Problem | null>(null)
    const [problemId, setProblemId] = useState('default-problem')
    const [loadingProblem, setLoadingProblem] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [hinting, setHinting] = useState(false)
    const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
    const [hint, setHint] = useState('')
    const [showHint, setShowHint] = useState(false)
    const [langOpen, setLangOpen] = useState(false)

    // Chat state
    const [chatOpen, setChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<ChatMsg[]>([])
    const [chatInput, setChatInput] = useState('')
    const [chatLoading, setChatLoading] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    const fetchProblem = useCallback(async () => {
        setLoadingProblem(true)
        setFeedback(null)
        setHint('')
        try {
            const data = await getProblem(userId)
            setProblem(data)
            setProblemId(data.title?.toLowerCase().replace(/\s+/g, '-') || `problem-${Date.now()}`)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingProblem(false)
        }
    }, [userId])

    useEffect(() => { fetchProblem() }, [fetchProblem])
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

    const handleSubmit = async () => {
        if (!code.trim()) return
        setSubmitting(true)
        setFeedback(null)
        try {
            const data = await submitCode(userId, code, problemId, language)
            setFeedback(data)
        } catch (e) {
            console.error(e)
        } finally {
            setSubmitting(false)
        }
    }

    const handleHint = async () => {
        setHinting(true)
        try {
            const data = await getHint(userId, code, problemId)
            setHint(data.hint)
            setShowHint(true)
        } catch (e) {
            console.error(e)
        } finally {
            setHinting(false)
        }
    }

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
        setCode(DEFAULT_CODE[lang] || '')
        setLangOpen(false)
    }

    const handleChatSend = async () => {
        if (!chatInput.trim() || chatLoading) return
        const userMsg: ChatMsg = { role: 'user', content: chatInput }
        setChatMessages(prev => [...prev, userMsg])
        setChatInput('')
        setChatLoading(true)
        try {
            const data = await sendChatMessage(userId, chatInput, chatMessages, problemId, code)
            setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } catch {
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
        } finally {
            setChatLoading(false)
        }
    }

    const diffBadge = (d: string) => {
        const l = d?.toLowerCase()
        if (l === 'easy') return 'badge-green'
        if (l === 'hard') return 'badge-red'
        return 'badge-yellow'
    }

    return (
        <div className="max-w-[1600px] mx-auto px-6 py-6 pt-24 fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Practice Arena</h1>
                    <p className="text-gray-500 text-sm">Solve problems — your AI mentor learns from every submission</p>
                </div>
                <button onClick={() => setChatOpen(!chatOpen)}
                    className={`btn-secondary flex items-center gap-2 ${chatOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}`}>
                    <MessageCircle size={16} />
                    AI Chat
                </button>
            </div>

            <div className="flex gap-6">
                {/* Main content */}
                <div className={`flex-1 grid ${chatOpen ? 'xl:grid-cols-2' : 'xl:grid-cols-2'} gap-6 transition-all`}>
                    {/* LEFT: Problem Panel */}
                    <div className="flex flex-col gap-6">
                        <div className="minimal-card p-6 border-indigo-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-slate-900 font-semibold text-lg flex items-center gap-2">
                                    <Zap size={18} className="text-indigo-500" />
                                    Problem Statement
                                </h2>
                                <button onClick={fetchProblem} disabled={loadingProblem}
                                    className="btn-secondary flex items-center gap-2 text-xs py-1.5 px-3">
                                    {loadingProblem ? <span className="spinner border-t-gray-900 !w-3 !h-3" /> : <RefreshCw size={14} />}
                                    New Problem
                                </button>
                            </div>

                            {loadingProblem ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="text-center">
                                        <span className="spinner border-t-gray-900 !w-8 !h-8" />
                                        <p className="text-gray-500 mt-4 text-sm font-medium">Generating your problem...</p>
                                    </div>
                                </div>
                            ) : problem ? (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <h3 className="text-gray-900 font-bold text-xl tracking-tight">{problem.title}</h3>
                                        <span className={`badge ${diffBadge(problem.difficulty)}`}>{problem.difficulty}</span>
                                    </div>
                                    <div className="prose-ai mb-6">
                                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                                    </div>
                                    {problem.examples && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                                            <p className="text-gray-500 text-xs font-semibold mb-3 uppercase tracking-wider">Examples</p>
                                            <pre className="text-gray-700 text-sm whitespace-pre-wrap font-mono !bg-transparent !border-none !p-0 !m-0">{problem.examples}</pre>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-12 text-sm bg-gray-50 rounded-lg border border-gray-100">Click &quot;New Problem&quot; to generate an adaptive challenge</p>
                            )}
                        </div>

                        {/* Feedback */}
                        {feedback && (
                            <div className={`minimal-card p-6 fade-in ${feedback.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    {feedback.passed
                                        ? <CheckCircle size={20} className="text-green-600" />
                                        : <XCircle size={20} className="text-red-500" />}
                                    <span className={`font-bold text-lg ${feedback.passed ? 'text-green-700' : 'text-red-600'}`}>
                                        {feedback.passed ? 'Passed! ✓' : 'Failed'}
                                    </span>
                                    {!feedback.passed && feedback.error_type !== 'None' && (
                                        <span className="badge badge-red font-mono shadow-sm">{feedback.error_type}</span>
                                    )}
                                </div>
                                <div className="prose-ai text-gray-800">
                                    <ReactMarkdown>{feedback.feedback}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Hint */}
                        {showHint && hint && (
                            <div className="minimal-card p-6 fade-in border-blue-200 bg-blue-50/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Lightbulb size={18} className="text-blue-600" />
                                    <span className="text-blue-700 font-semibold text-sm tracking-wide">AI Hint</span>
                                </div>
                                <div className="prose-ai text-gray-800">
                                    <ReactMarkdown>{hint}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Editor Panel */}
                    <div className="flex flex-col gap-4">
                        <div className="minimal-card overflow-hidden flex flex-col h-[600px]">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>

                                <div className="relative">
                                    <button onClick={() => setLangOpen(!langOpen)}
                                        className="btn-secondary flex items-center gap-2 text-xs py-1.5 px-3 bg-white shadow-sm border-gray-300">
                                        {language} <ChevronDown size={12} className="text-gray-400" />
                                    </button>
                                    {langOpen && (
                                        <div className="absolute right-0 top-full mt-1 z-10 py-1 rounded-lg bg-white border border-gray-200 shadow-lg min-w-[120px]">
                                            {LANGUAGES.map(lang => (
                                                <button key={lang} onClick={() => handleLanguageChange(lang)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <MonacoEditor
                                    height="100%"
                                    language={language}
                                    value={code}
                                    onChange={(val) => setCode(val || '')}
                                    theme="light"
                                    options={{
                                        fontSize: 14,
                                        fontFamily: 'JetBrains Mono, monospace',
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        padding: { top: 16, bottom: 16 },
                                        lineNumbersMinChars: 3,
                                        renderLineHighlight: 'line',
                                    }}
                                />
                            </div>

                            {/* Status bar */}
                            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-medium">Language: <span className="text-gray-900 font-mono">{language}</span></span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500 font-medium">Model: <span className="text-gray-900 font-mono">Grok 3</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {submitting && <><span className="spinner border-t-gray-500 !w-3 !h-3" /><span className="text-gray-600 font-medium">Evaluating...</span></>}
                                    {feedback && !submitting && (
                                        <span className={`font-medium ${feedback.passed ? 'text-green-600' : 'text-red-500'}`}>
                                            {feedback.passed ? '✓ Accepted' : '✗ Wrong Answer'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-4">
                            <button onClick={handleSubmit} disabled={submitting || !problem}
                                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 shadow-md hover:shadow-lg">
                                {submitting ? <><span className="spinner border-t-white !w-4 !h-4" /> Evaluating</> : <><Play size={16} /> Submit Solution</>}
                            </button>
                            <button onClick={handleHint} disabled={hinting || !problem}
                                className="btn-secondary flex items-center gap-2 py-3 px-6 hover:border-gray-400">
                                {hinting ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <Lightbulb size={18} className="text-gray-500" />}
                                Need a Hint?
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Panel Overlay (Side drawer) */}
                {chatOpen && (
                    <div className="w-[400px] flex-shrink-0 minimal-card flex flex-col slide-up overflow-hidden shadow-xl" style={{ height: 'calc(100vh - 120px)' }}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-100 bg-indigo-50/50">
                            <div className="flex items-center gap-2">
                                <MessageCircle size={18} className="text-indigo-600" />
                                <span className="text-slate-900 font-bold text-sm">AI Mentor Chat</span>
                            </div>
                            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 bg-white rounded-md border border-slate-200 hover:border-rose-200">
                                <X size={14} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                            {chatMessages.length === 0 && (
                                <div className="text-center py-12 px-4 border border-dashed border-indigo-200 rounded-xl m-4 bg-indigo-50/50">
                                    <MessageCircle size={32} className="text-indigo-300 mx-auto mb-4" />
                                    <p className="text-indigo-600/80 text-sm leading-relaxed">Ask your AI mentor anything about the current problem. It has full context of your code.</p>
                                </div>
                            )}
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={msg.role === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai border border-indigo-100 bg-white shadow-sm shadow-indigo-100/50'}>
                                    <div className="prose-ai">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="chat-bubble-ai typing-indicator border border-gray-100 shadow-sm">
                                    <span /><span /><span />
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                                    placeholder="Ask about this problem..."
                                    className="input-field flex-1 text-sm py-2.5 pr-12 shadow-sm"
                                    disabled={chatLoading}
                                />
                                <button onClick={handleChatSend} disabled={chatLoading || !chatInput.trim()}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
