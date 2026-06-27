export function NameList({
  names,
  onRemove,
  onClear,
  disabled = false,
}: {
  names: string[];
  onRemove: (index: number) => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="name-list">
      <div className="name-list__head">
        <h2>Names ({names.length})</h2>
        {names.length > 0 && (
          <button type="button" className="link" onClick={onClear} disabled={disabled}>
            Clear all
          </button>
        )}
      </div>
      {names.length === 0 ? (
        <p className="name-list__empty">No names yet — add some to fill the wheel.</p>
      ) : (
        <ul>
          {names.map((name, i) => (
            // Names are deduped case-insensitively, so the name itself is a stable key.
            <li key={name}>
              <span>{name}</span>
              <button
                type="button"
                aria-label={`Remove ${name}`}
                disabled={disabled}
                onClick={() => onRemove(i)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
