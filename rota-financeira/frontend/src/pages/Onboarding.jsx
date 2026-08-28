import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Input, { Field, Select } from '../components/Input'
import { api } from '../lib/api'

const vehicles = [
  { id: 'moto', label: 'Moto', icon: '🏍️' },
  { id: 'bike', label: 'Bicicleta', icon: '🚲' },
  { id: 'carro', label: 'Carro', icon: '🚗' },
]

const goalOptions = [
  'Trocar de veículo',
  'Guardar reserva de emergência',
  'Quitar dívidas',
  'Comprar equipamento',
  'Outro objetivo',
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    vehicle: '',
    city: '',
    goalLabel: goalOptions[0],
    goalAmount: '',
    goalDeadline: '',
  })

  const totalSteps = 3

  async function finish() {
    setSaving(true)
    try {
      await api.updateProfile({
        vehicle_type: data.vehicle,
        city: data.city,
      })
      if (data.goalAmount) {
        await api.createGoal({
          title: data.goalLabel,
          target_amount: Number(data.goalAmount),
          deadline: data.goalDeadline || null,
        })
      }
    } catch {
      // Backend pode ainda não estar disponível no ambiente local — segue para o dashboard mesmo assim.
    } finally {
      setSaving(false)
      navigate('/app')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-bg px-5 py-8">
      <div className="mx-auto w-full max-w-sm flex-1">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        {/* Progresso */}
        <div className="mb-8 flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-brand-500' : 'bg-base-surface2'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <StepVehicle
            value={data.vehicle}
            onChange={(vehicle) => setData((d) => ({ ...d, vehicle }))}
            onNext={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <StepCity
            value={data.city}
            onChange={(city) => setData((d) => ({ ...d, city }))}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepGoal
            data={data}
            setData={setData}
            onBack={() => setStep(1)}
            onFinish={finish}
            saving={saving}
          />
        )}
      </div>
    </div>
  )
}

function StepVehicle({ value, onChange, onNext }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-high">Qual seu veículo?</h1>
      <p className="mt-1.5 text-sm text-ink-mid">
        Isso ajuda a personalizar suas categorias de custo.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {vehicles.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onChange(v.id)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-colors ${
              value === v.id
                ? 'border-brand-500 bg-brand-500/10 text-brand-100'
                : 'border-base-border bg-base-surface2 text-ink-mid hover:border-brand-500/40'
            }`}
          >
            <span className="text-2xl">{v.icon}</span>
            <span className="text-sm font-medium">{v.label}</span>
          </button>
        ))}
      </div>

      <Button className="mt-8 w-full" disabled={!value} onClick={onNext}>
        Continuar
      </Button>
    </div>
  )
}

function StepCity({ value, onChange, onBack, onNext }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-high">Em qual cidade você roda?</h1>
      <p className="mt-1.5 text-sm text-ink-mid">
        Usamos isso pra comparar seus custos com a média da sua região no futuro.
      </p>

      <Field label="Cidade" className="mt-6">
        <Input
          placeholder="Ex: São Paulo, SP"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>

      <div className="mt-8 flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button disabled={!value} onClick={onNext} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  )
}

function StepGoal({ data, setData, onBack, onFinish, saving }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-high">Qual sua meta financeira?</h1>
      <p className="mt-1.5 text-sm text-ink-mid">
        Vamos acompanhar seu progresso a cada corrida registrada.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <Field label="Objetivo">
          <Select
            value={data.goalLabel}
            onChange={(e) => setData((d) => ({ ...d, goalLabel: e.target.value }))}
          >
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
            placeholder="Ex: 5000"
            value={data.goalAmount}
            onChange={(e) => setData((d) => ({ ...d, goalAmount: e.target.value }))}
          />
        </Field>

        <Field label="Prazo" hint="Opcional">
          <Input
            type="date"
            value={data.goalDeadline}
            onChange={(e) => setData((d) => ({ ...d, goalDeadline: e.target.value }))}
          />
        </Field>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button disabled={saving} onClick={onFinish} className="flex-1">
          {saving ? 'Salvando...' : 'Concluir'}
        </Button>
      </div>
    </div>
  )
}
