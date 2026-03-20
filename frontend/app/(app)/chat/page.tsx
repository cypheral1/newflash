'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendChatMessage } from '@/lib/api'
import { MessageCircle, Send, Sparkles, Trash2, Code2 } from 'lucide-react'

type ChatMsg = { role: 'user' | 'assistant'; content: string }

const QUICK_PROMPTS = [
    'Explain Big O notation simply',
    'What is dynamic programming?',
    'Help me understand recursion',
    'Tips for solving tree problems',
    'How to approach graph problems',
    'Common array manipulation patterns',
]

export default function ChatPage() {
    const { user } = useUser()
    const userId = user?.id || 'anonymous'
    const name = user?.firstName || 'there'

    const [messages, setMessages] = useState<ChatMsg[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (text?: string) => {
        const msg = text || input.trim()
        if (!msg || loading) return

        const userMsg: ChatMsg = { role: 'user', content: msg }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const data = await sendChatMessage(userId, msg, messages)
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
        } finally {
            setLoading(false)
            inputRef.current?.focus()
        }
    }

    const clearChat = () => {
        setMessages([])
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 pt-24 fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2 flex items-center gap-3">
                        <MessageCircle size={32} className="text-blue-600" />
                        AI Mentor Chat
                    </h1>
                    <p className="text-gray-500 text-sm">Chat about coding concepts — I remember your entire history</p>
                </div>
                {messages.length > 0 && (
                    <button onClick={clearChat} className="btn-secondary flex items-center gap-2 text-xs text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50">
                        <Trash2 size={13} /> Clear History
                    </button>
                )}
            </div>

            {/* Messages area */}
            <div className="minimal-card flex-1 flex flex-col overflow-hidden mb-6 bg-slate-50/50 shadow-sm border-indigo-100/60">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 blur-[60px] rounded-full pointer-events-none -z-10" />
                <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto py-12">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 border border-blue-100 shadow-sm">
                                <Sparkles size={28} className="text-blue-600" />
                            </div>
                            <h2 className="text-gray-900 font-bold text-2xl tracking-tight mb-3">Hey {name}! \uD83D\uDC4B</h2>
                            <p className="text-gray-500 text-base leading-relaxed mb-10">
                                I'm your AI coding mentor running on Grok 3. I remember all of your past mistakes and successful submissions. Ask me anything!
                            </p>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                {QUICK_PROMPTS.map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => handleSend(prompt)}
                                        className="text-left bg-white border border-gray-200 px-4 py-3 rounded-xl hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/50 transition-all group"
                                    >
                                        <Code2 size={16} className="text-blue-400 mb-2 group-hover:text-blue-600" />
                                        <span className="block text-sm font-medium text-gray-700 group-hover:text-gray-900">{prompt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`${msg.role === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai border-slate-200 bg-white shadow-sm'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-1.5 mb-2 border-b border-gray-100 pb-2">
                                        <Sparkles size={12} className="text-blue-600" />
                                        <span className="text-gray-900 text-xs font-bold tracking-wide">AI Mentor</span>
                                    </div>
                                )}
                                <div className="prose-ai text-[15px]">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="chat-bubble-ai typing-indicator bg-white border-gray-200">
                                <span className="!bg-gray-400" /><span className="!bg-gray-400" /><span className="!bg-gray-400" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-3 relative max-w-4xl mx-auto">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Ask your AI mentor anything..."
                            className="input-field flex-1 py-3.5 pr-14 text-base shadow-sm bg-gray-50 focus:bg-white"
                            disabled={loading}
                        />
                        <button onClick={() => handleSend()} disabled={loading || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
