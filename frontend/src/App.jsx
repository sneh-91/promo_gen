import { useEffect, useRef, useState } from "react";

import { submitJudge, submitPromo } from "./api/promo";
import { EMPTY_WRESTLER } from "./constants";
import { LandingScreen } from "./components/LandingScreen";
import { PromoPlayerScreen } from "./components/PromoPlayerScreen";
import { PromoStartScreen } from "./components/PromoStartScreen";
import { ReviewScreen } from "./components/ReviewScreen";
import { TaleOfTheTapeScreen } from "./components/TaleOfTheTapeScreen";
import { VerdictScreen } from "./components/VerdictScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { WrestlerFormScreen } from "./components/WrestlerFormScreen";
import { WRESTLER_PROFILES } from "./data/wrestlerProfiles";

const createWrestler = () => ({ ...EMPTY_WRESTLER });

const initialWrestlers = () => ({
  1: createWrestler(),
  2: createWrestler(),
});

function validateWrestler(wrestler) {
  return {
    name: !wrestler.name.trim(),
    alignment: !wrestler.alignment,
    size: !wrestler.size,
    voice: !wrestler.voice,
    look: !wrestler.look.trim(),
    description: !wrestler.description.trim(),
  };
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export function App() {
  const promoRunRef = useRef(0);
  const [screen, setScreen] = useState("landing");
  const [activeWrestler, setActiveWrestler] = useState(1);
  const [firstOnMic, setFirstOnMic] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmLabel, setConfirmLabel] = useState("Cut the Promo");
  const [wrestlers, setWrestlers] = useState(initialWrestlers);
  const [transcript, setTranscript] = useState([]);
  const [isResponseReady, setIsResponseReady] = useState(false);
  const [judgeResult, setJudgeResult] = useState(null);
  const [isJudgePending, setIsJudgePending] = useState(false);

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

  const handleShuffleProfile = () => {
    const profile =
      WRESTLER_PROFILES[Math.floor(Math.random() * WRESTLER_PROFILES.length)];
    setWrestlers((current) => ({
      ...current,
      [activeWrestler]: {
        name: profile.name,
        alignment: profile.alignment,
        size: profile.size,
        voice: profile.voice,
        look: profile.look,
        description: profile.description,
      },
    }));
    setErrors({});
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

  const handleConfirm = () => {
    const runId = promoRunRef.current + 1;
    promoRunRef.current = runId;
    setIsSubmitting(true);
    setConfirmLabel("Sending...");
    setTranscript([]);
    setIsResponseReady(false);
    setJudgeResult(null);
    setIsJudgePending(false);
    setScreen("welcome");

    submitPromo([wrestlers[1], wrestlers[2]], firstOnMic)
      .then((data) => {
        if (promoRunRef.current !== runId) return;
        const nextTranscript = data.transcript ?? [];
        setTranscript(nextTranscript);
        if (data.portrait_1 || data.portrait_2) {
          setWrestlers((current) => ({
            ...current,
            1: { ...current[1], imageUrl: data.portrait_1 ?? null },
            2: { ...current[2], imageUrl: data.portrait_2 ?? null },
          }));
        }
        setIsResponseReady(true);
        setIsJudgePending(true);
        submitJudge([wrestlers[1], wrestlers[2]], nextTranscript, firstOnMic)
          .then((judgeData) => {
            if (promoRunRef.current !== runId) return;
            setJudgeResult(judgeData);
            setIsJudgePending(false);
          })
          .catch((judgeErr) => {
            if (promoRunRef.current !== runId) return;
            console.error("Judge submission failed:", judgeErr);
            setIsJudgePending(false);
          });
      })
      .catch((err) => {
        if (promoRunRef.current !== runId) return;
        console.error("Promo submission failed:", err);
        setConfirmLabel("Try Again");
        setIsSubmitting(false);
        setScreen("review");
        window.alert("Could not reach the booking desk. Please try again.");
      });
  };

  const handleRestart = () => {
    promoRunRef.current += 1;
    setScreen("landing");
    setActiveWrestler(1);
    setFirstOnMic(1);
    setErrors({});
    setIsSubmitting(false);
    setConfirmLabel("Cut the Promo");
    setWrestlers(initialWrestlers());
    setTranscript([]);
    setIsResponseReady(false);
    setJudgeResult(null);
    setIsJudgePending(false);
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
          onShuffle={handleShuffleProfile}
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

      {screen === "welcome" && (
        <WelcomeScreen
          isResponseReady={isResponseReady}
          onComplete={() => setScreen("taleOfTape")}
        />
      )}

      {screen === "taleOfTape" && (
        <TaleOfTheTapeScreen
          wrestlers={wrestlers}
          firstOnMic={firstOnMic}
          onComplete={() => setScreen("promoStart")}
        />
      )}

      {screen === "promoStart" && (
        <PromoStartScreen onComplete={() => setScreen("promo")} />
      )}

      {screen === "promo" && (
        <PromoPlayerScreen
          transcript={transcript}
          wrestlers={wrestlers}
          onComplete={() => setScreen("verdict")}
        />
      )}

      {screen === "verdict" && (
        <VerdictScreen
          isJudgePending={isJudgePending}
          judgeResult={judgeResult}
          wrestlers={wrestlers}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
