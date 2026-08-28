export default function Logo({ size = 36, withLabel = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#rf-grad)" />
        <path
          d="M9 27C9 27 13 27 16 22C19 17 21 13 25 13C29 13 31 17 31 17"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="0.5 5.2"
        />
        <circle cx="9" cy="27" r="2.4" fill="white" />
        <circle cx="31" cy="17" r="2.4" fill="white" />
        <defs>
          <linearGradient id="rf-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#4C1D95" />
          </linearGradient>
        </defs>
      </svg>
      {withLabel && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink-high">
          Rota <span className="text-brand-300">Financeira</span>
        </span>
      )}
    </div>
  )
}
