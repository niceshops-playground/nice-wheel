import { Smiley } from "./Smiley";

export function WinnerModal({
  winner,
  onClose,
}: {
  winner: string;
  onClose: () => void;
}) {
  return (
    <div className="winner" role="dialog" aria-modal="true" aria-label="Winner">
      <div className="winner__confetti" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="winner__card">
        <Smiley size={72} className="winner__smiley" />
        <p className="winner__label">Winner</p>
        <h2 className="winner__name">{winner}</h2>
        <button type="button" onClick={onClose}>
          Spin again
        </button>
      </div>
    </div>
  );
}
