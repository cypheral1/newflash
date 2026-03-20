import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
            <div style={{ zoom: 1.05 }}>
                <SignUp />
            </div>
        </div>
    )
}
