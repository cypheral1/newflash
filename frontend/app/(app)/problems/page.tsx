'use client'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { getProblem } from '@/lib/api'
import { Target, RefreshCw, Zap, Code2, Search, Filter, CheckCircle2, Clock, Minus } from 'lucide-react'
import Link from 'next/link'

type Problem = { title: string; description: string; examples: string; difficulty: string }

const CATEGORIES = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs', 'Math', 'Sorting']

const CURATED_PROBLEMS = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', status: 'new' as const },
    { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Strings', status: 'new' as const },
    { id: 3, title: 'Merge Two Sorted Lists', difficulty: 'Easy', category: 'Linked Lists', status: 'new' as const },
    { id: 4, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', category: 'Dynamic Programming', status: 'new' as const },
    { id: 5, title: 'Valid Palindrome', difficulty: 'Easy', category: 'Strings', status: 'new' as const },
    { id: 6, title: 'Invert Binary Tree', difficulty: 'Easy', category: 'Trees', status: 'new' as const },
    { id: 7, title: 'Maximum Subarray', difficulty: 'Medium', category: 'Dynamic Programming', status: 'new' as const },
    { id: 8, title: 'Container With Most Water', difficulty: 'Medium', category: 'Arrays', status: 'new' as const },
    { id: 9, title: '3Sum', difficulty: 'Medium', category: 'Arrays', status: 'new' as const },
    { id: 10, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'Strings', status: 'new' as const },
    { id: 11, title: 'Group Anagrams', difficulty: 'Medium', category: 'Strings', status: 'new' as const },
    { id: 12, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', category: 'Trees', status: 'new' as const },
    { id: 13, title: 'Coin Change', difficulty: 'Medium', category: 'Dynamic Programming', status: 'new' as const },
    { id: 14, title: 'Course Schedule', difficulty: 'Medium', category: 'Graphs', status: 'new' as const },
    { id: 15, title: 'Merge Intervals', difficulty: 'Medium', category: 'Sorting', status: 'new' as const },
    { id: 16, title: 'Word Search', difficulty: 'Medium', category: 'Graphs', status: 'new' as const },
    { id: 17, title: 'Trapping Rain Water', difficulty: 'Hard', category: 'Arrays', status: 'new' as const },
    { id: 18, title: 'Merge K Sorted Lists', difficulty: 'Hard', category: 'Linked Lists', status: 'new' as const },
    { id: 19, title: 'Longest Valid Parentheses', difficulty: 'Hard', category: 'Dynamic Programming', status: 'new' as const },
    { id: 20, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', category: 'Trees', status: 'new' as const },
]

const diffBadge = (d: string) => {
    const l = d?.toLowerCase()
    if (l === 'easy') return 'badge-green'
    if (l === 'hard') return 'badge-red'
    return 'badge-yellow'
}

const statusIcon = (s: string) => {
    if (s === 'solved') return <CheckCircle2 size={16} className="text-green-600" />
    if (s === 'attempted') return <Clock size={16} className="text-yellow-500" />
    return <Minus size={14} className="text-gray-300" />
}

export default function ProblemsPage() {
    const { user } = useUser()
    const userId = user?.id || 'anonymous'
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [difficulty, setDifficulty] = useState('All')
    const [aiProblem, setAiProblem] = useState<Problem | null>(null)
    const [loadingAi, setLoadingAi] = useState(false)

    const filteredProblems = CURATED_PROBLEMS.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
        const matchCategory = category === 'All' || p.category === category
        const matchDifficulty = difficulty === 'All' || p.difficulty === difficulty
        return matchSearch && matchCategory && matchDifficulty
    })

    const fetchAiProblem = async () => {
        setLoadingAi(true)
        try {
            const data = await getProblem(userId)
            setAiProblem(data)
        } catch (e) { console.error(e) }
        finally { setLoadingAi(false) }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 pt-24 fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 gap-4 relative z-10">
                <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-indigo-100/50 rounded-full blur-[80px] -z-10 pointer-events-none" />
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        Problem Library
                    </h1>
                    <p className="text-slate-500 text-sm">Classic problems + Adaptive AI challenges</p>
                </div>
                <button onClick={fetchAiProblem} disabled={loadingAi} className="btn-primary flex items-center gap-2 shadow-sm">
                    {loadingAi
                        ? <><span className="spinner border-t-white" />Generating...</>
                        : <><Zap size={15} />Generate Target Problem</>}
                </button>
            </div>

            {/* AI Generated Problem */}
            {aiProblem && (
                <div className="minimal-card p-6 mb-8 bg-indigo-50/30 fade-in border-indigo-100 shadow-sm shadow-indigo-100/50">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap size={14} className="text-indigo-600 focus-visible:outline-none" />
                        <span className="text-indigo-700 text-xs font-semibold uppercase tracking-wider">AI-Generated for Your Weaknesses</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-slate-900 text-xl font-bold">{aiProblem.title}</h3>
                        <span className={`badge ${diffBadge(aiProblem.difficulty)}`}>
                            {aiProblem.difficulty}
                        </span>
                    </div>
                    <div className="prose-ai mb-6 text-slate-700">
                        <ReactMarkdown>{aiProblem.description}</ReactMarkdown>
                    </div>
                    {aiProblem.examples && (
                        <div className="bg-white border border-indigo-100 rounded-lg p-4 mb-6">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Examples</p>
                            <pre className="text-slate-600 text-sm whitespace-pre-wrap font-mono !m-0 !p-0 !bg-transparent !border-none">{aiProblem.examples}</pre>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <Link href={`/practice`}>
                            <button className="btn-primary flex items-center gap-2">
                                <Code2 size={16} />Solve in Editor
                            </button>
                        </Link>
                        <button onClick={fetchAiProblem} className="btn-secondary bg-white hover:bg-slate-50 flex items-center gap-1.5 text-sm">
                            <RefreshCw size={14} />Regenerate
                        </button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search problems..."
                        className="input-field pl-10 h-10 shadow-sm"
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter size={14} className="text-gray-400" />
                    </div>
                    <select
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}
                        className="input-field pl-9 pr-8 h-10 w-full md:w-auto appearance-none shadow-sm bg-white"
                    >
                        <option value="All">All Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map(cat => (
                    <button key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 shadow-sm ${category === cat
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50/50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Problem List */}
            <div className="minimal-card overflow-hidden border-slate-200 shadow-sm">
                <div className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-2 items-center px-6 py-3 border-b border-indigo-100 bg-indigo-50/60 text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                    <span className="text-center">#</span>
                    <span>Title</span>
                    <span>Category</span>
                    <span>Difficulty</span>
                    <span className="text-center">Status</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {filteredProblems.map((p) => (
                        <Link key={p.id} href="/practice" className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-2 items-center px-6 py-4 hover:bg-slate-50 transition-colors group">
                            <span className="text-slate-400 text-sm font-mono text-center group-hover:text-indigo-600">{p.id}</span>
                            <span className="text-slate-900 font-medium text-sm group-hover:text-indigo-700">{p.title}</span>
                            <span className="text-gray-500 text-sm">{p.category}</span>
                            <span className={`badge ${diffBadge(p.difficulty)} w-fit`}>
                                {p.difficulty}
                            </span>
                            <span className="flex justify-center">{statusIcon(p.status)}</span>
                        </Link>
                    ))}
                </div>

                {filteredProblems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search size={20} className="text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">No problems found</h3>
                        <p className="text-gray-500 text-sm max-w-sm">We couldn't find anything matching your current filters. Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
