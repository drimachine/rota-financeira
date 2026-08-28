export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-ink-mid">{label}</span>
      )}
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-ink-low">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-bad">{error}</span>}
    </label>
  )
}

export default function Input({ className = '', icon, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-low">
          {icon}
        </span>
      )}
      <input
        className={`w-full rounded-2xl border border-base-border bg-base-surface2 px-4 py-3.5 text-[15px] text-ink-high placeholder:text-ink-low focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
          icon ? 'pl-11' : ''
        } ${className}`}
        {...props}
      />
    </div>
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full appearance-none rounded-2xl border border-base-border bg-base-surface2 px-4 py-3.5 text-[15px] text-ink-high focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}
