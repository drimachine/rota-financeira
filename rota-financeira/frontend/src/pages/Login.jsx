import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Input, { Field } from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(form)
      navigate('/app')
    } catch (err) {
      setError(err.message === 'Email not confirmed'
        ? 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
        : 'E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-bg px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <h1 className="text-center text-2xl font-semibold text-ink-high">Bem-vindo de volta</h1>
        <p className="mt-1.5 text-center text-sm text-ink-mid">
          Entre para ver quanto você ganhou hoje.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Field label="E-mail">
            <Input
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              required
              value={form.email}
              onChange={update('email')}
            />
          </Field>
          <Field label="Senha">
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={update('password')}
            />
          </Field>

          {error && <p className="text-sm text-bad">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-mid">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-brand-300 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
