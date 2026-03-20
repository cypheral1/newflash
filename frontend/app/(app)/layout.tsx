import Navbar from '@/components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-slate-50/50 min-h-screen text-slate-900 selection:bg-indigo-100 flex flex-col relative isolate">
            <Navbar />

            {/* Soft decorative background gradients for the whole app */}
            <div className="fixed top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-50/80 via-white to-transparent -z-10 pointer-events-none" />
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[600px] bg-rose-50/60 blur-[120px] rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[500px] bg-blue-50/50 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <main className="flex-1 w-full relative z-0">
                {children}
            </main>
        </div>
    )
}
