import { useMemo } from "react";
import { buildSegments } from "../lib/wheel";

const SIZE = 360;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 4;
const LABEL_RADIUS = RADIUS * 0.62;
const MAX_LABEL_CHARS = 14;

// Font size shrinks as more names crowd the wheel, clamped to a readable range.
function labelFontSize(count: number): number {
  return Math.max(11, Math.min(20, 220 / count));
}

function truncate(name: string): string {
  return name.length > MAX_LABEL_CHARS ? `${name.slice(0, MAX_LABEL_CHARS - 1)}…` : name;
}

/** Polar → cartesian with 0° at the top, increasing clockwise. */
function point(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
}

function slicePath(start: number, end: number): string {
  const a = point(start, RADIUS);
  const b = point(end, RADIUS);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${a.x} ${a.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${b.x} ${b.y} Z`;
}

interface WheelProps {
  names: string[];
  rotation: number;
  spinning: boolean;
  spinMs: number;
  onSpinEnd: () => void;
}

export function Wheel({ names, rotation, spinning, spinMs, onSpinEnd }: WheelProps) {
  const segments = useMemo(() => buildSegments(names), [names]);
  const single = segments.length === 1;
  const fontSize = labelFontSize(names.length);

  return (
    <div className="wheel">
      <div className="wheel__pointer" aria-hidden="true" />
      <svg
        className="wheel__svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Wheel with ${names.length} names`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? `transform ${spinMs}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
            : "none",
        }}
        onTransitionEnd={() => spinning && onSpinEnd()}
      >
        {segments.map((seg) => {
          const label = point(seg.midAngle, LABEL_RADIUS);
          return (
            <g key={seg.name}>
              {single ? (
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={seg.color} />
              ) : (
                <path d={slicePath(seg.startAngle, seg.endAngle)} fill={seg.color} />
              )}
              <text
                x={label.x}
                y={label.y}
                fill="#fff"
                fontSize={fontSize}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${seg.midAngle} ${label.x} ${label.y})`}
              >
                {truncate(seg.name)}
              </text>
            </g>
          );
        })}
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#E8620E" strokeWidth={4} />
      </svg>
      <div className="wheel__hub" aria-hidden="true" />
    </div>
  );
}
