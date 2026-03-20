import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
    title: 'FlashCode — AI Coding Mentor',
    description: 'Master coding with AI-powered personalized mentoring',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="relative">
                    {/* Full-screen looping background video */}
                    <div className="fixed inset-0 w-[100vw] h-[100vh] -z-50 overflow-hidden pointer-events-none opacity-[0.03] filter grayscale mix-blend-multiply flex items-center justify-center">
                        <iframe
                            className="absolute w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] pointer-events-none"
                            src="https://www.youtube.com/embed/zYw-jqd74n8?autoplay=1&mute=1&loop=1&playlist=zYw-jqd74n8&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
                            title="Background Video"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                        />
                    </div>

                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
