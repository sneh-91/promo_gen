import { useEffect, useState } from "react";

import { submitPromo } from "./api/promo";
import { EMPTY_WRESTLER } from "./constants";
import { LandingScreen } from "./components/LandingScreen";
import { ReviewScreen } from "./components/ReviewScreen";
import { WrestlerFormScreen } from "./components/WrestlerFormScreen";

const createWrestler = () => ({ ...EMPTY_WRESTLER });

function validateWrestler(wrestler) {
  return {
    name: !wrestler.name.trim(),
    alignment: !wrestler.alignment,
    size: !wrestler.size,
    look: !wrestler.look.trim(),
    description: !wrestler.description.trim(),
  };
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export function App() {
  const [screen, setScreen] = useState("landing");
  const [activeWrestler, setActiveWrestler] = useState(1);
  const [firstOnMic, setFirstOnMic] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmLabel, setConfirmLabel] = useState("Cut the Promo");
  const [wrestlers, setWrestlers] = useState({
    1: createWrestler(),
    2: createWrestler(),
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" in window ? "instant" : "auto",
    });
  }, [screen, activeWrestler]);

  const goToWrestler = (idx) => {
    setActiveWrestler(idx);
    setErrors({});
    setScreen("wrestler");
  };

  const updateWrestler = (idx, field, value) => {
    setWrestlers((current) => ({
      ...current,
      [idx]: {
        ...current[idx],
        [field]: value,
      },
    }));
    setErrors((current) => ({ ...current, [field]: false }));
  };

  const handleBackFromForm = () => {
    if (activeWrestler === 1) {
      setScreen("landing");
    } else {
      goToWrestler(1);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateWrestler(wrestlers[activeWrestler]);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    if (activeWrestler === 1) {
      goToWrestler(2);
    } else {
      setScreen("review");
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setConfirmLabel("Sending...");

    try {
      const data = await submitPromo([wrestlers[1], wrestlers[2]], firstOnMic);
      console.log("Promo response:", data);
      setConfirmLabel("Bell's Rung!");
    } catch (err) {
      console.error("Promo submission failed:", err);
      setConfirmLabel("Try Again");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-spotlight" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      {screen === "landing" && <LandingScreen onStart={() => goToWrestler(1)} />}

      {screen === "wrestler" && (
        <WrestlerFormScreen
          activeWrestler={activeWrestler}
          errors={errors}
          wrestler={wrestlers[activeWrestler]}
          onBack={handleBackFromForm}
          onChange={updateWrestler}
          onSubmit={handleFormSubmit}
        />
      )}

      {screen === "review" && (
        <ReviewScreen
          confirmLabel={confirmLabel}
          firstOnMic={firstOnMic}
          isSubmitting={isSubmitting}
          wrestlers={wrestlers}
          onBack={() => goToWrestler(2)}
          onConfirm={handleConfirm}
          onEdit={goToWrestler}
          onFirstOnMicChange={setFirstOnMic}
        />
      )}
    </>
  );
}
