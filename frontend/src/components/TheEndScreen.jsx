import { ArrowIcon } from "./Icons";

export function TheEndScreen({ onRestart }) {
  return (
    <section className="screen screen--active showtime-screen" data-screen="end">
      <div className="showtime-stage showtime-stage--center">
        <span className="eyebrow eyebrow--gold">That's a wrap</span>
        <h1 className="showtime-title showtime-title--end">
          The <span className="title-accent">End</span>
        </h1>
        <p className="showtime-sub">The crowd is on their feet. Both wrestlers stare each other down as the lights fade.</p>
        <button className="btn btn--primary btn--chunky" type="button" onClick={onRestart}>
          <span>Cut Another Promo</span>
          <ArrowIcon className="icon-arrow" />
        </button>
      </div>
    </section>
  );
}
