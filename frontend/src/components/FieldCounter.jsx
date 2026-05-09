import { FIELD_LIMITS } from "../constants";

export function FieldCounter({ field, value }) {
  const max = FIELD_LIMITS[field];
  const length = value.length;
  const className = [
    "char-count",
    max > 0 && length >= max * 0.9 && length < max ? "char-count--near" : "",
    max > 0 && length >= max ? "char-count--max" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} aria-live="polite">
      {length} / {max}
    </span>
  );
}
