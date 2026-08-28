import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import Input, { Field, Select } from '../components/Input'
import { api } from '../lib/api'

const fallback = [
  {
    id: 1,
    title: 'Trocar de moto',
    target_amount: 4000,
    current_amount: 2860,
    deadline: '2026-12-01',
  },
]

const goalOptions = [
  'Trocar de veículo',
  'Guardar reserva de emergência',
  'Quitar dívidas',
  'Comprar equipamento',
  'Outro objetivo',
]

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Goals() {
  const [goals, setGoals] = useState(fallback)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: goalOptions[0], target_amount: '', deadline: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.listGoals().then(setGoals).catch(() => {})
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const created = await api.createGoal({
        title: form.title,
        target_amount: Number(form.target_amount),
        deadline: form.deadline || null,
      })
      setGoals((g) => [...g, created])
      setShowForm(false)
      setForm({ title: goalOptions[0], target_amount: '', deadline: '' })
    } catch {
      setGoals((g) => [
        ...g,
        {
          id: Date.now(),
          title: form.title,
          target_amount: Number(form.target_amount),
          current_amount: 0,
          deadline: form.deadline || null,
        },
      ])
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Header
        title="Metas"
        subtitle="Defina objetivos e acompanhe o progresso a cada corrida."
        right={
          <Button className="px-4 py-2.5 text-sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Cancelar' : '+ Nova meta'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Objetivo">
              <Select value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}>
                {goalOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Valor desejado (R$)">
              <Input
                type="number"
                min="0"
                required
                placeholder="Ex: 5000"
                value={form.target_amount}
                onChange={(e) => setForm((f) => ({ ...f, target_amount: e.target.value }))}
              />
            </Field>
            <Field label="Prazo" hint="Opcional">
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              />
            </Field>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Salvando...' : 'Salvar meta'}
            </Button>
          </form>
        </Card>
      )}

      {goals.length === 0 && !showForm ? (
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="text-3xl">🎯</span>
          <p className="text-sm font-medium text-ink-high">Nenhuma meta definida ainda</p>
          <p className="text-sm text-ink-mid">Crie uma meta pra dar rumo às suas corridas.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100))
            return (
              <Card key={g.id}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-high">{g.title}</p>
                  <span className="text-sm font-semibold text-brand-200">{pct}%</span>
                </div>
                <ProgressBar value={pct} />
                <div className="mt-2 flex items-center justify-between text-xs text-ink-low">
                  <span>{currency(g.current_amount)} de {currency(g.target_amount)}</span>
                  {g.deadline && (
                    <span>
                      Prazo: {new Date(g.deadline + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
