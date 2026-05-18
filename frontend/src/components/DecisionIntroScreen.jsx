import { useEffect } from "react";

const DECISION_INTRO_DURATION_MS = 2000;

export function DecisionIntroScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, DECISION_INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="screen screen--active showtime-screen" data-screen="decision-intro">
      <div className="showtime-stage showtime-stage--center">
        <span className="eyebrow eyebrow--gold">The arena waits</span>
        <h1 className="showtime-title showtime-title--accent">
          Decision <span className="title-accent">Time</span>
        </h1>
        <p className="showtime-sub">The judges are ready to deliver the final call.</p>
      </div>
    </section>
  );
}
