export default function Card({ children, className = '', as: Comp = 'div', ...props }) {
  return (
    <Comp
      className={`rounded-xl2 border border-base-border bg-base-surface p-5 shadow-card ${className}`}
      {...props}
    >
      {children}
    </Comp>
  )
}
