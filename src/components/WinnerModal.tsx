import { useEffect } from "react";
import { Smiley } from "./Smiley";

const CONFETTI = Array.from({ length: 24 }, (_, i) => i);

export function WinnerModal({
  winner,
  onClose,
}: {
  winner: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="winner"
      role="dialog"
      aria-modal="true"
      aria-label="Winner"
      onClick={onClose}
    >
      <div className="winner__confetti" aria-hidden="true">
        {CONFETTI.map((i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="winner__card" onClick={(e) => e.stopPropagation()}>
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
