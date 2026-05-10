import { useEffect, useState } from "react";

/**
 * Generic wrestler silhouette. Swappable to a real image later by adding
 * an imageUrl field on the wrestler object - this component reads it
 * and chooses what to render. No callers need to change.
 */
export function WrestlerAvatar({ wrestler, className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [wrestler?.imageUrl]);

  if (wrestler?.imageUrl && !imageFailed) {
    return (
      <img
        className={`avatar avatar--image ${className}`.trim()}
        src={wrestler.imageUrl}
        alt={wrestler.name}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <svg
      className={`avatar avatar--silhouette ${className}`.trim()}
      viewBox="0 0 200 400"
      fill="currentColor"
      preserveAspectRatio="xMidYMax meet"
      role="img"
      aria-label={wrestler?.name ? `${wrestler.name} silhouette` : "Wrestler silhouette"}
    >
      <circle cx="100" cy="52" r="30" />
      <path d="M 50 100 C 50 85 60 80 72 80 L 128 80 C 140 80 150 85 150 100 L 150 220 C 150 232 140 238 128 238 L 72 238 C 60 238 50 232 50 220 Z" />
      <path d="M 70 238 L 96 238 L 96 392 L 70 392 Z" />
      <path d="M 104 238 L 130 238 L 130 392 L 104 392 Z" />
      <path d="M 50 100 L 32 112 L 28 210 L 50 222 Z" />
      <path d="M 150 100 L 168 112 L 172 210 L 150 222 Z" />
    </svg>
  );
}
