/**
 * Pure helpers for the list of names. Kept free of React / storage so they are
 * trivially unit-testable; the `useNames` hook layers session persistence on top.
 */

export function addName(list: string[], raw: string): string[] {
  const name = raw.trim();
  if (!name) return list.slice();
  const exists = list.some((n) => n.toLowerCase() === name.toLowerCase());
  if (exists) return list.slice();
  return [...list, name];
}

export function removeAt(list: string[], index: number): string[] {
  if (index < 0 || index >= list.length) return list.slice();
  return list.filter((_, i) => i !== index);
}
