import { useCallback, useEffect, useState } from "react";
import { addName, removeAt } from "../lib/names";

const STORAGE_KEY = "won.names";

/** Read the saved names from sessionStorage, tolerating absent/corrupt data. */
function load(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Names list backed by sessionStorage — persists for the browser session
 * (tab), cleared when the tab closes.
 */
export function useNames() {
  const [names, setNames] = useState<string[]>(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch {
      /* storage may be unavailable (private mode); keep state in memory */
    }
  }, [names]);

  const add = useCallback((raw: string) => {
    setNames((current) => addName(current, raw));
  }, []);

  const remove = useCallback((index: number) => {
    setNames((current) => removeAt(current, index));
  }, []);

  const clear = useCallback(() => setNames([]), []);

  return { names, add, remove, clear };
}
