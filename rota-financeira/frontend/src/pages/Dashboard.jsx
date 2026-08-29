import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function motivationalMessage(pct) {
  if (pct >= 100) return '🎉 Meta batida! Hora de definir o próximo objetivo.'
  if (pct >= 70) return '🔥 Reta final! Faltam poucos km pra bater sua meta.'
  if (pct >= 30) return '💪 Bom ritmo! Continue registrando suas corridas todo dia.'
  return '🏍️ Toda rota começa com o primeiro km. Bora registrar sua receita de hoje?'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true
    api
      .getDashboardSummary()
      .then((data) => mounted && setSummary(data))
      .catch(() => mounted && setError(true))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'motorista'

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div>
        <Header title={`Olá, ${firstName} 👋`} />
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm font-medium text-ink-high">Não foi possível carregar seu resumo</p>
          <p className="text-sm text-ink-mid">Verifique sua conexão e tente novamente.</p>
        </Card>
      </div>
    )
  }

  const goalPct = summary.goal
    ? Math.min(100, Math.round((summary.goal.current_amount / summary.goal.target_amount) * 100))
    : 0

  return (
    <div>
      <Header
        title={`Olá, ${firstName} 👋`}
        subtitle="Aqui está o resumo do seu mês."
        right={
          <Link
            to="/app/relatorios"
            className="rounded-xl border border-base-border px-3 py-2 text-xs font-medium text-ink-mid hover:border-brand-500/50 hover:text-ink-high"
          >
            Relatórios
          </Link>
        }
      />

      {/* Lucro líquido — card principal */}
      <Card className="mb-4 bg-gradient-to-br from-brand-700/30 via-base-surface to-base-surface">
        <p className="text-sm text-ink-mid">Lucro líquido do mês</p>
        <div className="mt-1 flex items-end gap-3">
          <p className="font-display text-4xl font-semibold text-good tabular">
            {currency(summary.net_profit)}
          </p>
          {summary.variation_pct != null && (
            <span className="mb-1.5 rounded-full bg-good/10 px-2.5 py-1 text-xs font-medium text-good">
              {summary.variation_pct >= 0 ? '+' : ''}
              {summary.variation_pct}%
            </span>
          )}
        </div>
      </Card>

      {/* Receitas / Custos */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <Card>
          <p className="text-xs text-ink-low">Receitas do mês</p>
          <p className="mt-1 font-display text-xl font-semibold text-ink-high tabular">
            {currency(summary.revenue_total)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-ink-low">Custos do mês</p>
          <p className="mt-1 font-display text-xl font-semibold text-bad tabular">
            {currency(summary.cost_total)}
          </p>
        </Card>
      </div>

      {/* Meta */}
      {summary.goal && (
        <Card className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-ink-high">{summary.goal.title}</p>
            <span className="text-sm font-semibold text-brand-200">{goalPct}%</span>
          </div>
          <ProgressBar value={goalPct} />
          <div className="mt-2 flex items-center justify-between text-xs text-ink-low">
            <span>{currency(summary.goal.current_amount)} guardado</span>
            <span>Meta: {currency(summary.goal.target_amount)}</span>
          </div>
        </Card>
      )}

      {/* Mensagem motivacional */}
      <Card className="mb-6 flex items-center gap-3 border-brand-500/30 bg-brand-500/5">
        <p className="text-sm text-ink-mid">{motivationalMessage(goalPct)}</p>
      </Card>

      {/* Ações rápidas */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Button as={Link} to="/app/receitas/nova" className="w-full">
          + Nova receita
        </Button>
        <Button as={Link} to="/app/custos/novo" variant="secondary" className="w-full">
          + Novo custo
        </Button>
      </div>

      {/* Atividade recente */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink-mid">Atividade recente</h2>
        {summary.recent?.length ? (
          <div className="flex flex-col gap-2">
            {summary.recent.map((item) => (
              <Card key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink-high">{item.label}</p>
                  <p className="text-xs text-ink-low">{item.date}</p>
                </div>
                <p
                  className={`font-display text-sm font-semibold tabular ${
                    item.type === 'revenue' ? 'text-good' : 'text-bad'
                  }`}
                >
                  {item.type === 'revenue' ? '+' : '-'}
                  {currency(item.amount)}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-6 text-center text-sm text-ink-mid">Nenhuma atividade este mês ainda.</Card>
        )}
      </div>
    </div>
  )
}
