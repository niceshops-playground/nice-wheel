import { useCallback, useEffect, useState } from "react";
import { addName, removeAt } from "../lib/names";
import { decodeState, encodeState } from "../lib/share";

/** Seed state from the current URL (empty on the server / non-browser envs). */
function loadFromUrl() {
  if (typeof window === "undefined") return { team: "", names: [] as string[] };
  return decodeState(window.location.search);
}

/**
 * Team name + names list backed by the URL query string. The current wheel is
 * therefore always shareable: copy the address bar (or use ShareBar) and the
 * recipient opens the same team with the same names.
 */
export function useNames() {
  const initial = loadFromUrl();
  const [names, setNames] = useState<string[]>(initial.names);
  const [team, setTeam] = useState<string>(initial.team);

  // Mirror state into the URL without adding history entries.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = encodeState({ team, names });
    const url = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [team, names]);

  const add = useCallback((raw: string) => {
    setNames((current) => addName(current, raw));
  }, []);

  const remove = useCallback((index: number) => {
    setNames((current) => removeAt(current, index));
  }, []);

  const clear = useCallback(() => setNames([]), []);

  return { names, team, setTeam, add, remove, clear };
}
