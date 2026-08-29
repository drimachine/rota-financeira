import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import { api } from '../lib/api'

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export default function Revenues() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api
      .listRevenues()
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const total = items.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div>
      <Header
        title="Receitas"
        subtitle={`Total no período: ${currency(total)}`}
        right={
          <Button as={Link} to="/app/receitas/nova" className="px-4 py-2.5 text-sm">
            + Nova
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-ink-high">{item.platform}</p>
                <p className="text-xs text-ink-low">
                  {formatDate(item.date)} {item.notes ? `· ${item.notes}` : ''}
                </p>
              </div>
              <p className="font-display text-sm font-semibold text-good tabular">
                +{currency(item.amount)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="text-3xl">🧾</span>
      <p className="text-sm font-medium text-ink-high">Nenhuma receita registrada ainda</p>
      <p className="text-sm text-ink-mid">Toque em "+ Nova" para registrar sua primeira corrida.</p>
    </Card>
  )
}

function LoadingState() {
  return (
    <div className="flex justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  )
}

function ErrorState() {
  return (
    <Card className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="text-3xl">⚠️</span>
      <p className="text-sm font-medium text-ink-high">Não foi possível carregar suas receitas</p>
      <p className="text-sm text-ink-mid">Verifique sua conexão e tente novamente.</p>
    </Card>
  )
}
