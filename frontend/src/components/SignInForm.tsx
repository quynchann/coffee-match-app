import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import type { AnyFieldApi } from '@tanstack/react-form'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-destructive text-xs">
          {field.state.meta.errors[0]?.message}
        </p>
      ) : null}
      {field.state.meta.isValidating ? '検証中...' : null}
    </>
  )
}

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .pipe(z.email('有効なメールアドレスを入力してください')),
  password: z
    .string()
    .min(1, 'パスワードは必須です')
    .min(6, 'パスワードは6文字以上である必要があります'),
})

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { signin } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      const { email, password } = value
      try {
        await signin(email, password)
        // navigate({ to: '/home' })
        navigate({ to: '/' })
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
  })

  return (
    <form
      className={cn('relative flex flex-col gap-6', className)}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">ログイン</h1>
        </div>
        <form.Field
          name="email"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>メールアドレス</FieldLabel>
              <Input
                id={field.name}
                type="email"
                placeholder="m@example.com"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </Field>
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor={field.name}>パスワード</FieldLabel>
                {/* <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline">
                  パスワードを忘れた方はこちら
                </a> */}
              </div>
              <Input
                id={field.name}
                type="password"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </Field>
          )}
        />
        <Field>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit}
                variant="primary">
                {isSubmitting ? 'ログイン中...' : 'ログイン'}
              </Button>
            )}
          />
        </Field>
        <Field>
          <FieldDescription className="text-center">
            アカウントがない方はこちら
            <Link to="/signup" className="underline underline-offset-4">
              新規登録
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
