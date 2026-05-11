import { useState } from "react";

export function AccessGateScreen({ errorMessage = "", onUnlock }) {
  const [accessKey, setAccessKey] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!accessKey.trim()) return;
    onUnlock(accessKey.trim());
  };

  return (
    <section className="screen screen--active" data-screen="access-gate">
      <div className="hero">
        <span className="eyebrow eyebrow--gold">Private Access</span>
        <h1 className="title title--display">
          Enter <span className="title-accent">Passkey</span>
        </h1>
        <p className="description">
          This build is access-restricted while usage and cost controls are in place.
        </p>
        <form className="access-gate" onSubmit={handleSubmit}>
          <input
            className="input access-gate__input"
            type="password"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
            placeholder="Shared access key"
            autoComplete="current-password"
          />
          {errorMessage && <p className="access-gate__error">{errorMessage}</p>}
          <button className="btn btn--primary btn--chunky" type="submit">
            Enter
          </button>
        </form>
      </div>
    </section>
  );
}
