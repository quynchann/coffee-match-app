import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../stores/useAuthStore'
import type { AnyFieldApi } from '@tanstack/react-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
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

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'メールアドレスは必須です')
      .pipe(z.email('有効なメールアドレスを入力してください')),
    password: z
      .string()
      .min(1, 'パスワードは必須です')
      .min(6, 'パスワードは6文字以上である必要があります'),
    confirmPassword: z
      .string()
      .min(1, '確認用パスワードは必須です')
      .min(6, '確認用パスワードは6文字以上である必要があります'),
    username: z.string().min(1, 'ユーザー名は必須です'),
    address: z.string().optional(),
    age: z.preprocess(
      (a) => (a === '' ? undefined : a),
      z.coerce.number().min(1, '年齢は1歳以上である必要があります').optional(),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { signup } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      address: '' as string | undefined,
      age: undefined as string | number | undefined,
    },
    validators: {
      onSubmit: signUpSchema as any,
    },
    onSubmit: async ({ value }) => {
      const data = signUpSchema.parse(value)
      const { email, password, username, address, age } = data
      try {
        await signup(email, password, username, address, age)
        navigate({ to: '/signin' })
      } catch (error) {
        console.error('Signup failed:', error)
      }
    },
  })

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">登録</h1>
        </div>

        <div className="flex gap-4">
          <form.Field
            name="username"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  ユーザー名 <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="text"
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
                <FieldLabel htmlFor={field.name}>
                  パスワード<span className="text-destructive">*</span>
                </FieldLabel>
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
        </div>

        <div className="flex gap-4">
          <form.Field
            name="email"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  メールアドレス<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="email"
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
            name="confirmPassword"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  確認用パスワード<span className="text-destructive">*</span>
                </FieldLabel>
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
        </div>

        <div className="flex gap-4">
          <form.Field
            name="address"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>住所</FieldLabel>
                <Input
                  id={field.name}
                  type="text"
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
            name="age"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>年齢</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  min={1}
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </Field>
            )}
          />
        </div>

        <Field>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit}
                variant="primary">
                {isSubmitting ? '登録中...' : '登録'}
              </Button>
            )}
          />
        </Field>
        <FieldSeparator>または、以下の方法で登録できます</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            GitHub
          </Button>
          <FieldDescription className="text-center">
            すでにアカウントをお持ちの方はこちら
            <Link to="/signin" className="underline underline-offset-4">
              ログイン
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
