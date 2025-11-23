import { createFileRoute } from '@tanstack/react-router'
import { SignUpForm } from '@/components/SignUpForm'

export const Route = createFileRoute('/signup')({
  component: SignUp,
})

function SignUp() {
  return (
    <div className="min-h-screen bg-[#FF6347] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl">
        <SignUpForm />
      </div>
    </div>
  )
}
