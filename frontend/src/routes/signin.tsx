import { createFileRoute } from '@tanstack/react-router'
import { SignInForm } from '@/components/SignInForm'

export const Route = createFileRoute('/signin')({
  component: SignIn,
})

function SignIn() {
  return (
    <div className="min-h-screen bg-[#FF6347] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <SignInForm />
      </div>
    </div>
  )
}
