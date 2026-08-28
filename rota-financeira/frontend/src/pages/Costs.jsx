import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import { api } from '../lib/api'

const fallback = [
  { id: 1, category: 'Combustível', amount: 40, date: '2026-08-28', notes: null },
  { id: 2, category: 'Manutenção', amount: 65, date: '2026-08-25', notes: 'troca de óleo' },
  { id: 3, category: 'Alimentação', amount: 22.5, date: '2026-08-24', notes: null },
]

const categoryIcon = {
  'Combustível': '⛽',
  'Manutenção': '🔧',
  'Seguro': '🛡️',
  'Alimentação': '🍔',
  'Outros': '📦',
}

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export default function Costs() {
  const [items, setItems] = useState(fallback)

  useEffect(() => {
    api.listCosts().then(setItems).catch(() => {})
  }, [])

  const total = items.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div>
      <Header
        title="Custos"
        subtitle={`Total no período: ${currency(total)}`}
        right={
          <Button as={Link} to="/app/custos/novo" variant="secondary" className="px-4 py-2.5 text-sm">
            + Novo
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{categoryIcon[item.category] || '📦'}</span>
                <div>
                  <p className="text-sm font-medium text-ink-high">{item.category}</p>
                  <p className="text-xs text-ink-low">
                    {formatDate(item.date)} {item.notes ? `· ${item.notes}` : ''}
                  </p>
                </div>
              </div>
              <p className="font-display text-sm font-semibold text-bad tabular">
                -{currency(item.amount)}
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
      <p className="text-sm font-medium text-ink-high">Nenhum custo registrado ainda</p>
      <p className="text-sm text-ink-mid">Toque em "+ Novo" para registrar seu primeiro gasto.</p>
    </Card>
  )
}
