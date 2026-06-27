/**
 * Original niceshops-style smiley: a friendly round face in the brand orange.
 * Drawn from scratch (no trademarked asset) so it can be tweaked freely.
 */
export function Smiley({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="niceshops smiley"
      className={className}
    >
      <defs>
        <linearGradient id="smileyFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB23E" />
          <stop offset="1" stopColor="#F39200" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#smileyFace)" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#E8620E" strokeWidth="3" />
      <circle cx="35" cy="40" r="6.5" fill="#3a2400" />
      <circle cx="65" cy="40" r="6.5" fill="#3a2400" />
      <path
        d="M30 60 Q50 82 70 60"
        fill="none"
        stroke="#3a2400"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}
