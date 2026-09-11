import { Fragment } from "react";

/** Turns "seam of _design_ and _code_" into text with <em> around underscored words. */
export function parseEmphasis(text: string) {
  const parts = text.split(/_([^_]+)_/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>,
  );
}
