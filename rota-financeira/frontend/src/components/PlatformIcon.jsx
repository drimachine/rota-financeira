export default function PlatformIcon({ platform, size = 40 }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-2xl font-display font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: platform.color,
        color: platform.textDark ? '#1A1625' : '#FFFFFF',
      }}
    >
      {platform.label.charAt(0).toUpperCase()}
    </span>
  )
}
