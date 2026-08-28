import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Card from '../components/Card'

const platforms = ['iFood', 'Keeta', '99']

const steps = [
  {
    n: '01',
    title: 'Registre em segundos',
    text: 'Toque em "Nova receita" ou "Novo custo" depois de cada corrida. Poucos campos, sem enrolação.',
  },
  {
    n: '02',
    title: 'Veja seu lucro real',
    text: 'A Rota Financeira desconta combustível, manutenção e outros custos automaticamente do que você recebeu.',
  },
  {
    n: '03',
    title: 'Acompanhe sua meta',
    text: 'Defina um objetivo — trocar de moto, guardar reserva — e veja o progresso crescer a cada dia rodado.',
  },
]

const faq = [
  {
    q: 'Preciso pagar para usar?',
    a: 'Você pode começar de graça e registrar suas primeiras corridas hoje mesmo. Sem cartão de crédito.',
  },
  {
    q: 'Funciona com quais plataformas?',
    a: 'Por enquanto: iFood, Keeta e 99. Mais plataformas de entrega chegam em breve.',
  },
  {
    q: 'Preciso saber de planilha ou Excel?',
    a: 'Não. A Rota Financeira foi feita para ser mais simples que um caderninho — sem fórmulas, sem confusão.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-base-bg text-ink-high">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost" className="px-3 py-2 text-sm">
            Entrar
          </Button>
          <Button as={Link} to="/cadastro" className="px-4 py-2.5 text-sm">
            Criar conta grátis
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-16 pt-6 md:px-8 md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute -right-40 -top-20 h-96 w-96 rounded-full bg-brand-700/30 blur-[100px]" />
        <div className="pointer-events-none absolute -left-32 top-64 h-72 w-72 rounded-full bg-brand-500/20 blur-[100px]" />

        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200">
              Feito para quem roda todo dia
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              Quanto você <span className="text-brand-300">realmente</span> ganhou hoje?
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-mid md:text-lg">
              A Rota Financeira transforma suas corridas do iFood, Keeta e 99 em números
              claros: receita, custo e lucro líquido — sem planilha, sem complicação.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/cadastro" className="w-full sm:w-auto">
                Começar de graça
              </Button>
              <Button as={Link} to="/login" variant="secondary" className="w-full sm:w-auto">
                Já tenho conta
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-3 text-xs text-ink-low">
              <span>Funciona com</span>
              {platforms.map((p) => (
                <span key={p} className="rounded-full border border-base-border px-2.5 py-1 text-ink-mid">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Preview do dashboard — elemento assinatura: rota pontilhada ligando os indicadores */}
          <Card className="relative bg-base-surface/80 p-6 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-low">Lucro líquido · Agosto</p>
                <p className="mt-1 font-display text-3xl font-semibold text-good tabular">R$ 2.847,50</p>
              </div>
              <span className="rounded-full bg-good/10 px-2.5 py-1 text-xs font-medium text-good">+18%</span>
            </div>

            <div className="relative mb-5 flex items-center justify-between">
              <MiniStat label="Receitas" value="R$ 4.210" tone="ink" />
              <div className="route-line mx-3 flex-1" />
              <MiniStat label="Custos" value="R$ 1.362" tone="bad" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-ink-mid">Meta: trocar de moto</span>
                <span className="font-medium text-brand-200">71%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-base-surface2">
                <div className="h-full w-[71%] rounded-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-300" />
              </div>
            </div>

            <p className="mt-5 rounded-xl bg-base-surface2 px-4 py-3 text-sm text-ink-mid">
              🏍️ Faltam <span className="font-semibold text-ink-high">R$ 1.150</span> pra você
              fechar sua meta este mês. Continua na estrada!
            </p>
          </Card>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-2xl font-semibold md:text-3xl">Como funciona</h2>
        <p className="mt-2 max-w-xl text-ink-mid">Três passos, todo dia, direto do seu celular.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.n} className="relative">
              <span className="font-display text-sm font-semibold text-brand-400">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink-high">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-mid">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Prova social simples */}
      <section className="mx-auto max-w-6xl px-5 py-4 md:px-8">
        <Card className="grid gap-6 sm:grid-cols-3">
          <Stat value="R$ 0" label="Custo pra começar" />
          <Stat value="< 30s" label="Pra registrar uma corrida" />
          <Stat value="3" label="Plataformas conectadas" />
        </Card>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h2 className="text-2xl font-semibold md:text-3xl">Perguntas frequentes</h2>
        <div className="mt-6 divide-y divide-base-border">
          {faq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium text-ink-high">
                {f.q}
                <span className="text-ink-low transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink-mid">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <Card className="flex flex-col items-center gap-4 bg-gradient-to-br from-brand-700/40 via-base-surface to-base-surface p-8 text-center md:p-12">
          <h2 className="text-2xl font-semibold md:text-3xl">Comece a entender seu lucro hoje</h2>
          <p className="max-w-md text-ink-mid">
            Leva menos de 2 minutos pra criar sua conta e registrar sua primeira corrida.
          </p>
          <Button as={Link} to="/cadastro" className="mt-2">
            Criar minha conta
          </Button>
        </Card>
      </section>

      <footer className="border-t border-base-border px-5 py-8 text-center text-xs text-ink-low">
        © {new Date().getFullYear()} Rota Financeira. Feito para quem roda por São Paulo e o Brasil todo.
      </footer>
    </div>
  )
}

function MiniStat({ label, value, tone }) {
  const color = tone === 'bad' ? 'text-bad' : 'text-ink-high'
  return (
    <div>
      <p className="text-xs text-ink-low">{label}</p>
      <p className={`font-display text-lg font-semibold tabular ${color}`}>{value}</p>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-semibold text-brand-200">{value}</p>
      <p className="mt-1 text-sm text-ink-mid">{label}</p>
    </div>
  )
}
