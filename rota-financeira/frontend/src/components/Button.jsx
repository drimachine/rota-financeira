export default function Button({
  children,
  variant = 'primary',
  className = '',
  as: Comp = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-brand-500 text-white shadow-glow hover:bg-brand-400',
    secondary: 'bg-base-surface2 text-ink-high border border-base-border hover:border-brand-500/60',
    ghost: 'bg-transparent text-ink-mid hover:text-ink-high',
    outline: 'bg-transparent border border-brand-500/60 text-brand-200 hover:bg-brand-500/10',
    danger: 'bg-bad/10 text-bad border border-bad/30 hover:bg-bad/20',
  }

  return (
    <Comp className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Comp>
  )
}
