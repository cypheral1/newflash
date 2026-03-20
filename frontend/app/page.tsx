import { SignedIn, SignedOut } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Zap, Code2, Target, BarChart3, ArrowRight, MessageCircle, Brain, Shield } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="bg-slate-50/50 min-h-screen font-sans text-text selection:bg-indigo-100">
            {/* Soft decorative background gradients */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-50/80 via-white to-transparent -z-10 pointer-events-none" />
            <div className="absolute top-0 right-[-20%] w-[50%] h-[500px] bg-rose-50/50 blur-[100px] rounded-full -z-10 pointer-events-none" />

            <SignedIn>
                {/* Will redirect via middleware */}
            </SignedIn>

            {/* Nav */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-indigo-50 bg-white/70 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono text-sm font-bold shadow-sm shadow-indigo-200">
                        {'{'}⚡{'}'}
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">FlashCode</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Log in</Link>
                    <Link href="/sign-up" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all shadow-sm shadow-indigo-200 hover:shadow">Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative z-10 max-w-4xl mx-auto pt-32 pb-20 px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/50 mb-8 text-indigo-700">
                    <Brain size={14} />
                    <span className="text-sm font-semibold tracking-wide">Powered by Grok AI & Hindsight Memory</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                    An AI mentor that actually <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-400">remembers you.</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
                    Write code, make mistakes, and learn. FlashCode remembers your specific weaknesses and gives you personalized practice problems and hints that adapt to your exact skill level.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/sign-up" className="bg-indigo-600 text-white text-base font-semibold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5">
                        Start Coding Free <ArrowRight size={18} />
                    </Link>
                    <Link href="/sign-in" className="text-slate-600 bg-white border border-slate-200 text-base font-medium px-8 py-3.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Stats bar */}
            <div className="max-w-3xl mx-auto mb-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                    { value: 'Grok 3', label: 'Language Model', color: 'text-indigo-600' },
                    { value: '7+', label: 'Supported Languages', color: 'text-rose-500' },
                    { value: 'Hindsight', label: 'Memory Engine', color: 'text-emerald-600' },
                ].map(({ value, label, color }) => (
                    <div key={label} className="text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100">
                        <div className={`text-2xl font-bold tracking-tight mb-1 ${color}`}>{value}</div>
                        <div className="text-sm font-medium text-slate-500">{label}</div>
                    </div>
                ))}
            </div>

            {/* Feature cards */}
            <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                    { icon: Code2, title: 'Smart Code Editor', desc: 'Monaco editor with multi-language support, real-time AI evaluation, and instant feedback.', bg: 'bg-blue-50', iconColor: 'text-blue-600', borderHover: 'hover:border-blue-200' },
                    { icon: Target, title: 'Adaptive Problems', desc: 'Challenges uniquely generated for you based on the specific concepts you struggle with.', bg: 'bg-rose-50', iconColor: 'text-rose-500', borderHover: 'hover:border-rose-200' },
                    { icon: MessageCircle, title: 'AI Chat Mentor', desc: 'A conversational sidekick that sees your code, knows your history, and guides you.', bg: 'bg-purple-50', iconColor: 'text-purple-600', borderHover: 'hover:border-purple-200' },
                    { icon: BarChart3, title: 'Memory Reports', desc: 'Weekly performance summaries powered by persistent AI memory tracking your growth.', bg: 'bg-emerald-50', iconColor: 'text-emerald-600', borderHover: 'hover:border-emerald-200' },
                    { icon: Brain, title: 'Hindsight Memory', desc: 'Every line of code and chat interaction is mapped to give you increasingly better feedback.', bg: 'bg-amber-50', iconColor: 'text-amber-500', borderHover: 'hover:border-amber-200' },
                    { icon: Shield, title: 'Smart Hints', desc: 'Get contextual hints that teach without giving away the answer, referencing past mistakes.', bg: 'bg-indigo-50', iconColor: 'text-indigo-600', borderHover: 'hover:border-indigo-200' },
                ].map(({ icon: Icon, title, desc, bg, iconColor, borderHover }) => (
                    <div key={title} className={`bg-white border border-slate-100 rounded-2xl p-8 transition-all hover:shadow-md ${borderHover} group relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-current to-transparent opacity-[0.03] rounded-bl-full pointer-events-none" style={{ color: 'inherit' }} />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${bg}`}>
                            <Icon size={22} className={iconColor} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg mb-3">{title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>

            {/* How it works */}
            <div className="max-w-4xl mx-auto px-6 pb-32 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">How it works</h2>
                    <p className="text-slate-500">A seamless loop of coding, failing, and learning.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { n: '01', t: 'You code', d: 'Write your solution in our rich editor.', color: 'text-blue-200' },
                        { n: '02', t: 'AI evaluates', d: 'Get instant, context-aware feedback.', color: 'text-rose-200' },
                        { n: '03', t: 'Memory saved', d: 'Your mistakes are logged into Hindsight.', color: 'text-indigo-200' },
                        { n: '04', t: 'Gets smarter', d: 'Future problems adapt to your weaknesses.', color: 'text-emerald-200' },
                    ].map(({ n, t, d, color }) => (
                        <div key={n} className="flex flex-col items-center text-center">
                            <div className={`text-5xl font-black mb-4 tracking-tighter ${color}`}>{n}</div>
                            <div className="text-slate-900 font-bold mb-2">{t}</div>
                            <div className="text-slate-600 text-sm leading-relaxed">{d}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="relative z-10 px-6 pb-24">
                <div className="max-w-3xl mx-auto bg-indigo-50/50 border border-indigo-100 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/40 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/40 rounded-full blur-[60px] pointer-events-none" />
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4 relative">
                        Ready to write better code?
                    </h2>
                    <p className="text-slate-600 mb-10 max-w-lg mx-auto relative">
                        Stop doing standard practice. Start learning with an AI mentor that adapts to your exact skill level.
                    </p>
                    <Link href="/sign-up" className="relative bg-indigo-600 text-white text-base font-medium px-8 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg shadow-indigo-600/20">
                        Start Coding Free <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-8 px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-gray-400 text-sm font-medium">© 2026 FlashCode</span>
                <span className="text-gray-400 text-sm font-medium">Built with clean architecture & precise AI</span>
            </footer>
        </div>
    )
}
