import { addName } from "./names";

/**
 * Encode/decode the shareable wheel state (team name + names) to and from a URL
 * query string. Kept pure and React-free so it is trivially unit-testable; the
 * `useNames` hook wires it into browser history, `ShareBar` builds copy links.
 */

export type WheelState = { team: string; names: string[] };

/** Build the query string (without leading "?") for a given state. */
export function encodeState(state: WheelState): string {
  const params = new URLSearchParams();
  const team = state.team.trim();
  if (team) params.set("team", team);
  if (state.names.length) params.set("names", state.names.join(","));
  return params.toString();
}

/** Parse a query string (with or without leading "?") back into state. */
export function decodeState(search: string): WheelState {
  const params = new URLSearchParams(search);
  const team = params.get("team")?.trim() ?? "";
  // addName trims, drops empties, and dedupes case-insensitively — the same
  // rule the live wheel uses, so a shared link never seeds duplicates.
  const names = (params.get("names") ?? "").split(",").reduce(addName, [] as string[]);

  return { team, names };
}

/** Absolute URL that reproduces the given state when opened. */
export function shareUrl(state: WheelState, origin: string, pathname: string): string {
  const query = encodeState(state);
  const base = `${origin}${pathname}`;
  return query ? `${base}?${query}` : base;
}
