import { useRef, useState } from "react";
import { Smiley } from "./components/Smiley";
import { Wheel } from "./components/Wheel";
import { NameInput } from "./components/NameInput";
import { NameList } from "./components/NameList";
import { WinnerModal } from "./components/WinnerModal";
import { useNames } from "./hooks/useNames";
import { pickWinnerIndex, rotationForWinner } from "./lib/wheel";

const SPIN_MS = 5000;
const SPINS = 6;

export function App() {
  const { names, add, remove, clear } = useNames();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  // Holds the chosen winner across the async spin animation (survives re-renders).
  const pendingWinner = useRef<string | null>(null);

  function spin() {
    if (spinning || names.length < 2) return;
    setWinner(null);
    const index = pickWinnerIndex(names.length, Math.random);
    pendingWinner.current = names[index];
    setRotation((current) => rotationForWinner(index, names.length, current, SPINS));
    setSpinning(true);
  }

  function handleSpinEnd() {
    setSpinning(false);
    if (pendingWinner.current) setWinner(pendingWinner.current);
  }

  return (
    <div className="app">
      <header className="app__header">
        <Smiley size={44} />
        <div>
          <h1>Wheel of Names</h1>
          <p>niceshops edition</p>
        </div>
      </header>

      <main className="app__main">
        <section className="app__wheel">
          <Wheel
            names={names.length ? names : ["Add", "some", "names"]}
            rotation={rotation}
            spinning={spinning}
            spinMs={SPIN_MS}
            onSpinEnd={handleSpinEnd}
          />
          <button
            type="button"
            className="spin-btn"
            onClick={spin}
            disabled={spinning || names.length < 2}
          >
            {spinning ? "Spinning…" : "Spin"}
          </button>
          {names.length < 2 && (
            <p className="hint">Add at least two names to spin.</p>
          )}
        </section>

        <aside className="app__panel">
          <NameInput onAdd={add} />
          <NameList names={names} onRemove={remove} onClear={clear} />
        </aside>
      </main>

      {winner && <WinnerModal winner={winner} onClose={() => setWinner(null)} />}

      <footer className="app__footer">
        Names are kept in this browser session only.
      </footer>
    </div>
  );
}
