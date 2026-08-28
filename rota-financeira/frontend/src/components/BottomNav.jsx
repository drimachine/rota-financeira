import { NavLink } from 'react-router-dom'

const items = [
  { to: '/app', label: 'Painel', end: true, icon: HomeIcon },
  { to: '/app/receitas', label: 'Receitas', icon: RevenueIcon },
  { to: '/app/custos', label: 'Custos', icon: CostIcon },
  { to: '/app/metas', label: 'Metas', icon: GoalIcon },
  { to: '/app/perfil', label: 'Perfil', icon: ProfileIcon },
]

export default function BottomNav() {
  return (
    <>
      {/* Mobile: barra inferior fixa */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-base-border bg-base-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
          {items.map(({ to, label, end, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                    isActive ? 'text-brand-300' : 'text-ink-low hover:text-ink-mid'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon active={isActive} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop: barra lateral fixa */}
      <nav className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-base-border bg-base-surface/95 p-5 md:flex">
        <div className="mb-8 px-1 text-lg font-display font-semibold text-ink-high">
          Rota <span className="text-brand-300">Financeira</span>
        </div>
        <ul className="flex flex-col gap-1">
          {items.map(({ to, label, end, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-200'
                      : 'text-ink-mid hover:bg-base-surface2 hover:text-ink-high'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon active={isActive} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

function iconProps(active) {
  return {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: active ? '#C4B5FD' : 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
}

function HomeIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
    </svg>
  )
}
function RevenueIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M12 3v18" />
      <path d="M17 7.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 2.7 5 3 5 1.1 5 3-2.2 3-5 3-5-1.1-5-3" />
    </svg>
  )
}
function CostIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  )
}
function GoalIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill={active ? '#C4B5FD' : 'currentColor'} />
    </svg>
  )
}
function ProfileIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" />
    </svg>
  )
}
