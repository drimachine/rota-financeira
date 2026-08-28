export default function Header({ title, subtitle, right }) {
  return (
    <header className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-ink-high">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-mid">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
