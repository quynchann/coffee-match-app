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
      className={cn('relative flex flex-col gap-6', className)}
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
                className="mx-auto max-w-2/3"
                disabled={!canSubmit}
                variant="primary">
                {isSubmitting ? '登録中...' : '登録'}
              </Button>
            )}
          />
        </Field>
        <Field>
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
