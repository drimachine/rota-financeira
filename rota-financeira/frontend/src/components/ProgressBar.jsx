export default function ProgressBar({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-base-surface2 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-300 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
