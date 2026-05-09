import { API_BASE } from "../constants";

export async function submitPromo(players, firstOnMic) {
  const res = await fetch(`${API_BASE}/api/promo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ players, firstOnMic }),
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}
