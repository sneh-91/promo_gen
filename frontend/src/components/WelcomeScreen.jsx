import { useEffect } from "react";

const WELCOME_DURATION_MS = 3000;

export function WelcomeScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, WELCOME_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="screen screen--active showtime-screen" data-screen="welcome">
      <div className="showtime-stage showtime-stage--center">
        <span className="eyebrow eyebrow--gold">Live from the arena</span>
        <h1 className="showtime-title">
          Welcome to <span className="title-accent">Fight Night</span>
        </h1>
        <p className="showtime-sub">The crowd is on their feet. The lights are coming up.</p>
      </div>
    </section>
  );
}
