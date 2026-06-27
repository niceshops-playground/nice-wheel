import { useState, type FormEvent } from "react";

export function NameInput({
  onAdd,
  disabled = false,
}: {
  onAdd: (name: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  }

  return (
    <form className="name-input" onSubmit={submit}>
      <input
        type="text"
        aria-label="Add a name"
        placeholder="Add a name…"
        value={value}
        maxLength={40}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Add
      </button>
    </form>
  );
}
