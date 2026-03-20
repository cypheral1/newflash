'use client'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { getReport } from '@/lib/api'
import { BarChart3, RefreshCw, Zap, TrendingUp, Lightbulb } from 'lucide-react'

export default function ReportPage() {
    const { user } = useUser()
    const userId = user?.id || 'anonymous'
    const [report, setReport] = useState('')
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const fetchReport = async () => {
        setLoading(true)
        try {
            const data = await getReport(userId)
            setReport(data.report)
            setLoaded(true)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 pt-24 fade-in">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
                        Weekly Report
                    </h1>
                    <p className="text-gray-500 text-sm">AI-generated performance summary based on Hindsight memory</p>
                </div>
                <button onClick={fetchReport} disabled={loading} className="btn-primary flex items-center gap-2 px-5 shadow hover:shadow-md">
                    {loading
                        ? <><span className="spinner border-t-white" />Analyzing...</>
                        : <><Zap size={15} />{loaded ? 'Regenerate' : 'Generate Now'}</>}
                </button>
            </div>

            {!loaded && !loading && (
                <div className="minimal-card p-16 text-center bg-gray-50/50 border-dashed border-gray-300">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-white border border-gray-200 shadow-sm">
                        <TrendingUp size={28} className="text-blue-600" />
                    </div>
                    <h2 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">Ready for analysis</h2>
                    <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">Let Grok analyze your past 7 days of memory data to produce a personalized skill report.</p>
                    <button onClick={fetchReport} className="btn-primary text-base px-8 py-3">
                        <BarChart3 size={16} className="mr-2 inline" />Analyze My Progress
                    </button>
                </div>
            )}

            {loading && (
                <div className="minimal-card p-16 text-center border-blue-100 bg-blue-50/30">
                    <span className="spinner !w-10 !h-10 border-4 border-gray-200 !border-t-blue-600 mb-6" />
                    <h3 className="text-gray-900 font-semibold mb-2">Scanning Hindsight Bank</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">Retrieving submissions, code metrics, and chat history for the past 7 days...</p>
                </div>
            )}

            {loaded && report && !loading && (
                <div className="minimal-card p-8 md:p-12 fade-in shadow-md">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                                <BarChart3 size={20} className="text-gray-900" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-bold text-lg">Performance Summary</h3>
                                <div className="text-xs text-gray-500">Based on Hindsight Memory</div>
                            </div>
                        </div>
                        <button onClick={fetchReport} className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3">
                            <RefreshCw size={14} />Refresh
                        </button>
                    </div>
                    <div className="prose-ai max-w-none text-[15px] leading-relaxed">
                        <ReactMarkdown>{report}</ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Tips footer */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-gray-900 font-bold text-sm mb-4 flex items-center gap-2 tracking-wide uppercase">
                    <Lightbulb size={16} className="text-yellow-600" /> Practice Principles
                </h3>
                <ul className="space-y-3">
                    {[
                        'Consistent practice feeds the memory engine faster than cramming.',
                        'Use the Hint button to understand the root cause rather than cheating the problem.',
                        'Focus your time on areas where the AI reports high failure rates.',
                    ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="text-gray-400 mt-0.5 mt-0">—</span>
                            <span className="text-gray-600 text-[13px]">{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
