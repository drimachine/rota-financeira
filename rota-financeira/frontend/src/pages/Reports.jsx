import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Header from '../components/Header'
import Card from '../components/Card'
import { api } from '../lib/api'

const fallback = {
  revenue_total: 4210,
  cost_total: 1362.5,
  net_profit: 2847.5,
  monthly: [
    { month: 'Abr', receita: 3400, custo: 1100 },
    { month: 'Mai', receita: 3800, custo: 1250 },
    { month: 'Jun', receita: 3600, custo: 1180 },
    { month: 'Jul', receita: 3950, custo: 1300 },
    { month: 'Ago', receita: 4210, custo: 1362 },
  ],
}

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Reports() {
  const [data, setData] = useState(fallback)

  useEffect(() => {
    api.getMonthlyEvolution().then(setData).catch(() => {})
  }, [])

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
      </Card>
    </div>
  )
}
