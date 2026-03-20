'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Code2, LayoutDashboard, Lightbulb, BarChart3, MessageCircle } from 'lucide-react'

const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/practice', label: 'Practice', icon: Code2 },
    { href: '/problems', label: 'Problems', icon: Lightbulb },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
    { href: '/report', label: 'Report', icon: BarChart3 },
]

export default function Navbar() {
    const pathname = usePathname()
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-md border-b border-slate-100">
            <Link href="/dashboard" className="flex items-center gap-2.5 outline-none group focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono text-xs font-bold shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                    {'{'}⚡{'}'}
                </div>
                <span className="text-slate-900 font-bold tracking-tight text-lg">FlashCode</span>
            </Link>

            <div className="flex items-center gap-6">
                <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>Dashboard</Link>
                <Link href="/problems" className={`text-sm font-medium transition-colors ${pathname === '/problems' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>Problems</Link>
                <Link href="/practice" className={`text-sm font-medium transition-colors ${pathname === '/practice' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>Practice</Link>
                <Link href="/chat" className={`text-sm font-medium transition-colors ${pathname === '/chat' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>AI Chat</Link>
                <Link href="/report" className={`text-sm font-medium transition-colors ${pathname === '/report' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>Report</Link>
            </div>

            <UserButton afterSignOutUrl="/" appearance={{
                elements: { avatarBox: "w-8 h-8 ring-1 ring-gray-200" }
            }} />
        </nav>
    )
}
