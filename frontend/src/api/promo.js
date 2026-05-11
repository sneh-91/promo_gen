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

export async function submitJudge(players, transcript, firstOnMic) {
  const judgePlayers = players.map((player) => ({
    name: player.name,
    alignment: player.alignment,
    size: player.size,
    voice: player.voice,
    look: player.look,
    description: player.description,
  }));
  const judgeTranscript = transcript.map((turn) => ({
    wrestler: turn.wrestler,
    response: turn.response,
    voice: turn.voice,
  }));

  const res = await fetch(`${API_BASE}/api/judge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      players: judgePlayers,
      transcript: judgeTranscript,
      firstOnMic,
    }),
  });

  if (!res.ok) {
    throw new Error(`Judge endpoint responded with ${res.status}`);
  }

  return res.json();
}
