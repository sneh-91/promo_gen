export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export const EMPTY_WRESTLER = {
  name: "",
  alignment: "",
  size: "",
  voice: "alloy",
  look: "",
  description: "",
};

export const VOICE_OPTIONS = [
  { value: "alloy", label: "Main Event Power", subLabel: "Deep, punchy, dominant" },
  { value: "ash", label: "Street Fighter Edge", subLabel: "Raspy, gritty, aggressive" },
  { value: "coral", label: "Showboat Charisma", subLabel: "Bright, flashy, high energy" },
  { value: "sage", label: "Cold Technician", subLabel: "Calm, controlled, surgical" },
  { value: "verse", label: "Arena Narrator", subLabel: "Smooth, dramatic, cinematic" },
];

export const ALIGNMENT_OPTIONS = [
  { value: "babyface", label: "Babyface", subLabel: "Hero", className: "seg-pill--baby" },
  { value: "tweener", label: "Tweener", subLabel: "Neutral", className: "seg-pill--tween" },
  { value: "heel", label: "Heel", subLabel: "Villain", className: "seg-pill--heel" },
];

export const SIZE_OPTIONS = [
  { value: "small", label: "Small", subLabel: "Compact" },
  { value: "average", label: "Average", subLabel: "Athletic" },
  { value: "big", label: "Big", subLabel: "Powerhouse" },
  { value: "giant", label: "Giant", subLabel: "Monster" },
];

export const ALIGNMENT_LABELS = {
  babyface: "Babyface",
  tweener: "Tweener",
  heel: "Heel",
};

export const SIZE_LABELS = {
  small: "Small",
  average: "Average",
  big: "Big",
  giant: "Giant",
};

export const ALIGNMENT_BADGE_VARIANT = {
  babyface: "baby",
  tweener: "tween",
  heel: "heel",
};

export const FIELD_LIMITS = {
  name: 60,
  look: 800,
  description: 2500,
};
