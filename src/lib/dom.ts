/**
 * Lightweight DOM helpers. Prefer these over raw `querySelector` / `querySelectorAll`
 * so call sites stay short and consistent. See AGENTS.md.
 */

/** `document.querySelector` (or within `root`). */
export function $<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector<T>(selector)
}

/** `document.querySelectorAll` as a real array (or within `root`). */
export function $$<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector))
}
