import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import Input, { Field, Select } from '../components/Input'
import { api } from '../lib/api'
import { PLATFORMS } from '../lib/platforms'

const DEFAULT_PLATFORMS = [...PLATFORMS.map((p) => p.label), 'Outro']

export default function NewRevenue() {
  const navigate = useNavigate()
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS)
  const [form, setForm] = useState({
    amount: '',
    platform: DEFAULT_PLATFORMS[0],
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getProfile()
      .then((profile) => {
        const labels = PLATFORMS.filter((p) => profile.platforms?.includes(p.id)).map((p) => p.label)
        if (labels.length > 0) {
          const options = [...labels, 'Outro']
          setPlatforms(options)
          setForm((f) => ({ ...f, platform: options[0] }))
        }
      })
      .catch(() => {})
  }, [])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.createRevenue({
        amount: Number(form.amount),
        platform: form.platform,
        date: form.date,
        notes: form.notes || null,
      })
      navigate('/app')
    } catch (err) {
      setError('Não foi possível salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Header title="Nova receita" subtitle="Registre o que você recebeu por uma corrida ou entrega." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Valor (R$)">
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0,00"
            required
            autoFocus
            value={form.amount}
            onChange={update('amount')}
          />
        </Field>

        <Field label="Plataforma">
          <Select value={form.platform} onChange={update('platform')}>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Data">
          <Input type="date" required value={form.date} onChange={update('date')} />
        </Field>

        <Field label="Observações" hint="Opcional">
          <Input
            type="text"
            placeholder="Ex: corrida longa, gorjeta boa"
            value={form.notes}
            onChange={update('notes')}
          />
        </Field>

        {error && <p className="text-sm text-bad">{error}</p>}

        <Button type="submit" disabled={saving} className="mt-2 w-full">
          {saving ? 'Salvando...' : 'Salvar receita'}
        </Button>
      </form>
    </div>
  )
}
