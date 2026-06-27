import { useState, type FormEvent } from "react";

export function NameInput({ onAdd }: { onAdd: (name: string) => void }) {
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;
    onAdd(name);
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
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" disabled={!value.trim()}>
        Add
      </button>
    </form>
  );
}
