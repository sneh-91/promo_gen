import { useEffect, useMemo, useRef, useState } from "react";

import { WrestlerAvatar } from "./WrestlerAvatar";

const TYPE_SPEED_MS = 30;
const HOLD_AFTER_REVEAL_MS = 600;
const FIRST_TURN_AUDIO_START_DELAY_MS = 250;

export function PromoPlayerScreen({ transcript, wrestlers, onComplete }) {
  const [turnIndex, setTurnIndex] = useState(0);
  const [revealedChars, setRevealedChars] = useState(0);
  const [phase, setPhase] = useState("typing");
  const [audioDone, setAudioDone] = useState(true);
  const audioRef = useRef(null);

  const turn = transcript[turnIndex];
  const fullText = turn?.response ?? "";
  const audioSrc =
    turn?.audio_base64 && turn?.audio_format
      ? `data:audio/${turn.audio_format};base64,${turn.audio_base64}`
      : null;

  const { wrestler, side } = useMemo(() => {
    const w1 = wrestlers[1];
    const w2 = wrestlers[2];
    if (w1?.name === turn?.wrestler) return { wrestler: w1, side: 1 };
    if (w2?.name === turn?.wrestler) return { wrestler: w2, side: 2 };
    return { wrestler: null, side: 1 };
  }, [turn, wrestlers]);

  useEffect(() => {
    setRevealedChars(0);
    setPhase("typing");
    setAudioDone(!audioSrc);
  }, [turnIndex, audioSrc]);

  useEffect(() => {
    if (!audioSrc) return undefined;

    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    const playDelayMs = turnIndex === 0 ? FIRST_TURN_AUDIO_START_DELAY_MS : 0;

    const markDone = () => setAudioDone(true);
    audio.addEventListener("ended", markDone);
    audio.addEventListener("error", markDone);

    const playTimer = setTimeout(() => {
      audio.play().catch(() => {
        setAudioDone(true);
      });
    }, playDelayMs);

    return () => {
      clearTimeout(playTimer);
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", markDone);
      audio.removeEventListener("error", markDone);
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [audioSrc, turnIndex]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (revealedChars >= fullText.length) {
      setPhase("holding");
      return;
    }
    const id = setTimeout(() => setRevealedChars((c) => c + 1), TYPE_SPEED_MS);
    return () => clearTimeout(id);
  }, [phase, revealedChars, fullText.length]);

  useEffect(() => {
    if (phase !== "holding" || !audioDone) return;
    const id = setTimeout(() => {
      if (turnIndex + 1 >= transcript.length) {
        onComplete();
      } else {
        setTurnIndex((i) => i + 1);
      }
    }, HOLD_AFTER_REVEAL_MS);
    return () => clearTimeout(id);
  }, [audioDone, phase, turnIndex, transcript.length, onComplete]);

  const handleSkip = () => {
    if (phase === "typing") {
      setRevealedChars(fullText.length);
      setPhase("holding");
      return;
    }
    audioRef.current?.pause();
    audioRef.current = null;
    if (turnIndex + 1 >= transcript.length) {
      onComplete();
    } else {
      setTurnIndex((i) => i + 1);
    }
  };

  if (!turn) return null;

  const visibleText = fullText.slice(0, revealedChars);

  return (
    <section className="screen screen--active showtime-screen" data-screen="promo-player">
      <div className="container container--wide promo-stage">
        <header className="promo-stage__header">
          <span className="promo-turn-counter">
            Turn {turnIndex + 1} of {transcript.length}
          </span>
          <h2 className="promo-name">{turn.wrestler}</h2>
        </header>

        <div className="promo-stage__row" data-side={side}>
          <div className="promo-stage__avatar">
            <WrestlerAvatar
              wrestler={wrestler ?? { name: turn.wrestler }}
              className="promo-avatar"
            />
          </div>

          <p className="promo-line">
            <span className="promo-line__ghost" aria-hidden="true">{fullText}</span>
            <span className="promo-line__visible" aria-live="polite">
              {visibleText}
              {phase === "typing" && (
                <span className="promo-cursor" aria-hidden="true">|</span>
              )}
            </span>
          </p>
        </div>

        <button className="skip-btn" type="button" onClick={handleSkip}>
          {phase === "typing" ? "Reveal" : "Skip"}
          <span aria-hidden="true"> ›</span>
        </button>
      </div>
    </section>
  );
}
