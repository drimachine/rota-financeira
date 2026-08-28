import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Input, { Field } from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      const data = await signUp(form)
      if (!data.session) {
        setError('Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.')
        return
      }
      navigate('/onboarding')
    } catch (err) {
      setError(err.message === 'User already registered'
        ? 'Este e-mail já está cadastrado.'
        : 'Não foi possível criar sua conta. Tente novamente.')
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

        <h1 className="text-center text-2xl font-semibold text-ink-high">Criar sua conta</h1>
        <p className="mt-1.5 text-center text-sm text-ink-mid">
          Leva menos de 2 minutos. Sem cartão de crédito.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Field label="Nome">
            <Input
              type="text"
              autoComplete="name"
              placeholder="Como podemos te chamar?"
              required
              value={form.name}
              onChange={update('name')}
            />
          </Field>
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
          <Field label="Senha" hint="Mínimo de 6 caracteres">
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={update('password')}
            />
          </Field>

          {error && <p className="text-sm text-bad">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Criando conta...' : 'Criar conta grátis'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-mid">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-brand-300 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
