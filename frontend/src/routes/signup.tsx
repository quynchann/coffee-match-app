import { Link, createFileRoute } from '@tanstack/react-router'
import { SignUpForm } from '@/components/SignUpForm'

export const Route = createFileRoute('/signup')({
  component: SignUp,
})

function SignUp() {
  return (
    <div className="animate-in fade-in h-screen w-full overflow-hidden duration-500 md:grid md:grid-cols-2">
      <div className="bg-muted relative hidden h-full w-full text-white md:block">
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <img
          src="/signup-bg.png"
          alt="Cafe Street"
          className="absolute inset-0 h-full w-full object-cover grayscale-20"
        />
        <div className="relative z-20 flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-2 text-lg">
            <img
              src="/android-chrome-192x192.png"
              alt="Cafe Match Logo"
              className="size-8 rounded-md"
            />
            <span className="font-[Noto_Serif_JP] text-2xl font-bold">
              カフェマッチ
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-bold tracking-widest text-emerald-400">
              街を探索しよう
            </p>
            <blockquote className="text-3xl leading-snug font-medium">
              これまで知らなかった街の隠れた1,000軒以上のカフェを発見しよう。
            </blockquote>
            <div className="pt-4">
              <Link
                to="/"
                className="font-semibold decoration-emerald-400 underline-offset-4 hover:underline">
                今すぐ発見 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background flex h-screen items-center justify-center overflow-hidden">
        <div className="w-full px-6">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
