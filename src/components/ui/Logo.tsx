interface LogoProps {
  size?: number
  showWordmark?: boolean
  wordmarkSuffix?: string
  className?: string
}

export default function Logo({ size = 28, showWordmark = true, wordmarkSuffix = '', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z" fill="none" stroke="#00ff88" strokeWidth="1.5" />
        <text x="24" y="29" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700" fill="#00ff88">
          BT
        </text>
      </svg>
      {showWordmark && (
        <span className="font-mono font-medium" style={{ fontSize: size * 0.46 }}>
          <span className="text-white">biltechie</span>
          {wordmarkSuffix && <span className="text-neon">{wordmarkSuffix}</span>}
        </span>
      )}
    </div>
  )
}