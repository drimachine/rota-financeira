import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import { api } from '../lib/api'

const fallback = [
  { id: 1, platform: 'iFood', amount: 87.5, date: '2026-08-28', notes: null },
  { id: 2, platform: '99', amount: 63.2, date: '2026-08-27', notes: 'corrida longa' },
  { id: 3, platform: 'Keeta', amount: 45.0, date: '2026-08-26', notes: null },
]

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export default function Revenues() {
  const [items, setItems] = useState(fallback)

  useEffect(() => {
    api.listRevenues().then(setItems).catch(() => {})
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

      {items.length === 0 ? (
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
