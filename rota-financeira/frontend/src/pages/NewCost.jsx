import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import Input, { Field, Select } from '../components/Input'
import { api } from '../lib/api'

const categories = ['Combustível', 'Manutenção', 'Seguro', 'Alimentação', 'Outros']

export default function NewCost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    category: categories[0],
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.createCost({
        category: form.category,
        amount: Number(form.amount),
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
      <Header title="Novo custo" subtitle="Registre um gasto para calcular seu lucro real." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Categoria">
          <Select value={form.category} onChange={update('category')}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

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

        <Field label="Data">
          <Input type="date" required value={form.date} onChange={update('date')} />
        </Field>

        <Field label="Observações" hint="Opcional">
          <Input
            type="text"
            placeholder="Ex: troca de óleo"
            value={form.notes}
            onChange={update('notes')}
          />
        </Field>

        {error && <p className="text-sm text-bad">{error}</p>}

        <Button type="submit" disabled={saving} className="mt-2 w-full">
          {saving ? 'Salvando...' : 'Salvar custo'}
        </Button>
      </form>
    </div>
  )
}
