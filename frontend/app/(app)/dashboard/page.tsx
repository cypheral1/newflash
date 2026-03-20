'use client'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Code2, Lightbulb, BarChart3, Zap, Target, ArrowRight, MessageCircle, Trophy, Flame, Clock } from 'lucide-react'

export default function DashboardPage() {
    const { user } = useUser()
    const name = user?.firstName || user?.username || 'Coder'

    const cards = [
        { href: '/practice', icon: Code2, title: 'Practice Arena', desc: 'Write code, get AI feedback that references your past mistakes.', color: 'text-indigo-600', bgHover: 'hover:bg-indigo-50/50', iconBg: 'bg-indigo-50 border-indigo-100', hoverIconBg: 'group-hover:bg-indigo-100' },
        { href: '/problems', icon: Target, title: 'Problem Library', desc: 'Browse curated problems or generate AI-targeted challenges.', color: 'text-rose-600', bgHover: 'hover:bg-rose-50/50', iconBg: 'bg-rose-50 border-rose-100', hoverIconBg: 'group-hover:bg-rose-100' },
        { href: '/chat', icon: MessageCircle, title: 'AI Chat Mentor', desc: 'Chat with your AI mentor about any coding concept or question.', color: 'text-purple-600', bgHover: 'hover:bg-purple-50/50', iconBg: 'bg-purple-50 border-purple-100', hoverIconBg: 'group-hover:bg-purple-100' },
        { href: '/report', icon: BarChart3, title: 'Weekly Report', desc: 'Your 7-day performance breakdown with personalized insights.', color: 'text-emerald-600', bgHover: 'hover:bg-emerald-50/50', iconBg: 'bg-emerald-50 border-emerald-100', hoverIconBg: 'group-hover:bg-emerald-100' },
    ]

    const stats = [
        { icon: Flame, label: 'Streak', value: '—', desc: 'Start coding!', color: 'text-rose-500', bg: 'bg-rose-50/50', iconBg: 'bg-rose-100/50 border-rose-100' },
        { icon: Trophy, label: 'Problems Solved', value: '—', desc: 'Submit to track', color: 'text-amber-500', bg: 'bg-amber-50/50', iconBg: 'bg-amber-100/50 border-amber-100' },
        { icon: Clock, label: 'This Week', value: '—', desc: 'Keep going', color: 'text-blue-500', bg: 'bg-blue-50/50', iconBg: 'bg-blue-100/50 border-blue-100' },
    ]

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 pt-24 fade-in">
            {/* Hero */}
            <div className="mb-12 relative z-10">
                <div className="absolute top-[-50px] left-[-100px] w-64 h-64 bg-indigo-100/60 rounded-full blur-[80px] -z-10 pointer-events-none" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 mb-6">
                    <Zap size={14} className="text-indigo-600" />
                    <span className="text-indigo-700 text-xs font-semibold uppercase tracking-wider">AI-Powered Mentor</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                    Welcome back, <span className="text-indigo-600 italic font-serif">{name}</span>
                </h1>
                <p className="text-slate-500 text-lg">Your AI mentor learns from every mistake and gets smarter over time.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 relative z-10">
                {stats.map(({ icon: Icon, label, value, desc, color, bg, iconBg }) => (
                    <div key={label} className={`minimal-card p-6 flex flex-col justify-between h-full ${bg} border-transparent shadow-sm`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${iconBg}`}>
                                <Icon size={18} className={color} />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">{label}</div>
                                <div className="text-3xl font-bold text-slate-900">{value}</div>
                            </div>
                        </div>
                        <div className="text-xs font-medium text-slate-400 mt-auto">{desc}</div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 relative z-10">
                {cards.map(({ href, icon: Icon, title, desc, color, bgHover, iconBg, hoverIconBg }) => (
                    <Link key={href} href={href} className="group outline-none">
                        <div className={`minimal-card p-6 h-full flex flex-col justify-between transition-all group-hover:-translate-y-1 ${bgHover} group-focus-visible:ring-2 focus-visible:border-transparent cursor-pointer`}>
                            <div>
                                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-5 transition-colors ${iconBg} ${hoverIconBg}`}>
                                    <Icon size={18} className={color} />
                                </div>
                                <h3 className="text-slate-900 font-semibold text-base mb-2">{title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                            <div className={`mt-6 flex items-center gap-1.5 text-sm font-semibold ${color} group-hover:underline underline-offset-4`}>
                                Start <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* How it works */}
            <div className="minimal-card p-8 md:p-10 mb-8 bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100/50 relative z-10 overflow-hidden">
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-100/30 rounded-tl-full -z-10 pointer-events-none" />
                <h2 className="text-slate-900 font-bold text-xl mb-8 flex items-center gap-2">
                    <Lightbulb size={20} className="text-indigo-600" />
                    How the AI remembers you
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { n: '01', t: 'You code', d: 'Write your solution in the editor', color: 'text-indigo-200' },
                        { n: '02', t: 'AI evaluates', d: 'References past mistakes', color: 'text-rose-200' },
                        { n: '03', t: 'Memory saved', d: 'Stores your progress', color: 'text-emerald-200' },
                        { n: '04', t: 'Gets smarter', d: 'Tailors future challenges', color: 'text-amber-200' },
                    ].map(({ n, t, d, color }) => (
                        <div key={n} className="flex flex-col">
                            <div className={`text-4xl font-black tracking-tighter mb-3 ${color}`}>{n}</div>
                            <div className="text-slate-900 font-semibold text-sm mb-1">{t}</div>
                            <div className="text-slate-500 text-xs leading-snug">{d}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
