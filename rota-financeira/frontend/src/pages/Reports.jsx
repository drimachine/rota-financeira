import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Header from '../components/Header'
import Card from '../components/Card'
import { api } from '../lib/api'

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Reports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api
      .getMonthlyEvolution()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div>
        <Header title="Relatórios" subtitle="Sua evolução financeira ao longo dos meses." />
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm font-medium text-ink-high">Não foi possível carregar seus relatórios</p>
          <p className="text-sm text-ink-mid">Verifique sua conexão e tente novamente.</p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Header title="Relatórios" subtitle="Sua evolução financeira ao longo dos meses." />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-xs text-ink-low">Receitas</p>
          <p className="mt-1 font-display text-base font-semibold text-ink-high tabular">
            {currency(data.revenue_total)}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-ink-low">Custos</p>
          <p className="mt-1 font-display text-base font-semibold text-bad tabular">
            {currency(data.cost_total)}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-ink-low">Lucro</p>
          <p className="mt-1 font-display text-base font-semibold text-good tabular">
            {currency(data.net_profit)}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-ink-mid">Evolução mensal</h2>
        {data.monthly?.length ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthly} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2640" vertical={false} />
                <XAxis dataKey="month" stroke="#78708F" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#78708F" fontSize={12} tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  contentStyle={{
                    background: '#151220',
                    border: '1px solid #2A2640',
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                  labelStyle={{ color: '#F6F4FB' }}
                  formatter={(value) => currency(value)}
                />
                <Bar dataKey="receita" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Receita" />
                <Bar dataKey="custo" fill="#F87171" radius={[6, 6, 0, 0]} name="Custo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-ink-mid">
            Sem movimentação registrada ainda para montar o gráfico.
          </p>
        )}
      </Card>
    </div>
  )
}
