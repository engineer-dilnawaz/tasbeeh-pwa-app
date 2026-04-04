const R = 80;
const C = 2 * Math.PI * R;

type ProgressRingProps = {
  count: number;
  target: number;
};

export function ProgressRing({ count, target }: ProgressRingProps) {
  const t = target > 0 ? target : 100;
  const offset = C - (Math.min(count, t) / t) * C;

  return (
    <div className="progress-container">
      <svg className="progress-ring" width="180" height="180" aria-hidden>
        <defs>
          <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle className="progress-bg" cx="90" cy="90" r={R} />
        <circle
          className="progress"
          cx="90"
          cy="90"
          r={R}
          filter="url(#ringGlow)"
          style={{ strokeDasharray: C, strokeDashoffset: offset }}
        />
      </svg>
      <div className="count-display">
        <div className="count">{count}</div>
        <div className="count-target">/ {t}</div>
      </div>
    </div>
  );
}
