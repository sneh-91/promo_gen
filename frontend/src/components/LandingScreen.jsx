import { ArrowIcon } from "./Icons";

export function LandingScreen({ onStart }) {
  return (
    <section className="screen screen--active" data-screen="landing">
      <div className="hero">
        <span className="eyebrow eyebrow--gold">AI Promo Booking Desk</span>
        <h1 className="title title--display">
          WWE <span className="title-accent">Promo</span> Gen
        </h1>
        <p className="description">
          Build two larger-than-life superstars, lock in their attitude, and set
          the stage for a main-event promo battle.
        </p>
        <div className="hero-card" aria-label="Promo setup summary">
          <span>2 Superstars</span>
          <span>Mic Check</span>
          <span>Main Event Energy</span>
        </div>
        <button className="btn btn--primary btn--chunky" type="button" onClick={onStart}>
          <span>Ring the Bell</span>
          <ArrowIcon className="icon-arrow" />
        </button>
      </div>
    </section>
  );
}
