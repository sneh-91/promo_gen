(() => {
  "use strict";

  const SIZE_LABELS = {
    small: "Small",
    average: "Average",
    big: "Big",
    giant: "Giant",
  };

  const ALIGNMENT_LABELS = {
    babyface: "Babyface",
    tweener: "Tweener",
    heel: "Heel",
  };

  const emptyWrestler = () => ({
    name: "",
    alignment: "",
    size: "",
    look: "",
    description: "",
  });

  const state = {
    screen: "landing",
    activeWrestler: 1,
    firstOnMic: 1,
    wrestlers: {
      1: emptyWrestler(),
      2: emptyWrestler(),
    },
  };

  const screens = document.querySelectorAll(".screen");
  const form = document.querySelector('[data-form="wrestler"]');
  const wrestlerEyebrow = document.querySelector('[data-bind="wrestlerEyebrow"]');
  const wrestlerHeading = document.querySelector('[data-bind="wrestlerHeading"]');
  const continueLabel = document.querySelector('[data-bind="continueLabel"]');

  function showScreen(name) {
    state.screen = name;
    screens.forEach((s) => {
      s.classList.toggle("screen--active", s.dataset.screen === name);
    });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function updateStepper() {
    const steppers = document.querySelectorAll(".stepper");
    steppers.forEach((stepper) => {
      const steps = stepper.querySelectorAll(".step");
      steps.forEach((step) => {
        step.classList.remove("is-active", "is-done");
        const id = step.dataset.step;
        if (state.screen === "wrestler") {
          if (id === String(state.activeWrestler)) step.classList.add("is-active");
          else if (Number(id) < state.activeWrestler) step.classList.add("is-done");
        } else if (state.screen === "review") {
          if (id === "review") step.classList.add("is-active");
          else step.classList.add("is-done");
        }
      });
    });
  }

  function loadWrestlerIntoForm(idx) {
    const data = state.wrestlers[idx];
    form.elements.name.value = data.name;
    form.elements.look.value = data.look;
    form.elements.description.value = data.description;

    const alignmentInputs = form.querySelectorAll('input[name="alignment"]');
    alignmentInputs.forEach((i) => (i.checked = i.value === data.alignment));

    const sizeInputs = form.querySelectorAll('input[name="size"]');
    sizeInputs.forEach((i) => (i.checked = i.value === data.size));

    form.querySelectorAll(".field.has-error").forEach((f) =>
      f.classList.remove("has-error")
    );
  }

  function goToWrestler(idx) {
    state.activeWrestler = idx;
    wrestlerEyebrow.textContent = `Contender ${idx} of 2`;
    wrestlerHeading.textContent = `Contender ${idx}`;
    continueLabel.textContent = idx === 1 ? "Next Up" : "Lock It In";
    loadWrestlerIntoForm(idx);
    showScreen("wrestler");
    updateStepper();
    setTimeout(() => form.elements.name.focus(), 50);
  }

  function readForm() {
    return {
      name: form.elements.name.value.trim(),
      alignment: (form.querySelector('input[name="alignment"]:checked') || {}).value || "",
      size: (form.querySelector('input[name="size"]:checked') || {}).value || "",
      look: form.elements.look.value.trim(),
      description: form.elements.description.value.trim(),
    };
  }

  function validate(data) {
    const errors = {};
    if (!data.name) errors.name = true;
    if (!data.alignment) errors.alignment = true;
    if (!data.size) errors.size = true;
    if (!data.look) errors.look = true;
    if (!data.description) errors.description = true;
    return errors;
  }

  function applyErrors(errors) {
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("has-error"));
    Object.keys(errors).forEach((key) => {
      let el;
      if (key === "alignment" || key === "size") {
        el = form.querySelector(`[data-group="${key}"]`);
      } else {
        el = form.elements[key];
      }
      const field = el && el.closest(".field");
      if (field) field.classList.add("has-error");
    });
  }

  function renderReview() {
    [1, 2].forEach((idx) => {
      const card = document.querySelector(`[data-review="${idx}"]`);
      const data = state.wrestlers[idx];

      card.querySelector('[data-review-field="name"]').textContent = data.name || "—";

      const alignmentBadge = card.querySelector('[data-review-field="alignment"]');
      alignmentBadge.textContent = ALIGNMENT_LABELS[data.alignment] || "—";
      alignmentBadge.className = "badge";
      if (data.alignment) alignmentBadge.classList.add(`badge--${data.alignment === "babyface" ? "baby" : data.alignment === "tweener" ? "tween" : "heel"}`);

      card.querySelector('[data-review-field="size"]').textContent =
        SIZE_LABELS[data.size] || "—";

      card.querySelector('[data-review-field="look"]').textContent =
        data.look || "—";

      card.querySelector('[data-review-field="description"]').textContent =
        data.description || "—";
    });

    renderMicPick();
  }

  function renderMicPick() {
    const checked = document.querySelector(
      `input[name="first-on-mic"][value="${state.firstOnMic}"]`
    );
    if (checked) checked.checked = true;
  }

  function goToReview() {
    showScreen("review");
    renderReview();
    updateStepper();
  }

  document.addEventListener("change", (e) => {
    if (e.target.name === "first-on-mic") {
      state.firstOnMic = Number(e.target.value);
    }
  });

  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "start") {
      goToWrestler(1);
    } else if (action === "back") {
      const data = readForm();
      state.wrestlers[state.activeWrestler] = data;
      if (state.activeWrestler === 1) {
        showScreen("landing");
      } else {
        goToWrestler(1);
      }
    } else if (action === "edit") {
      const idx = Number(target.dataset.edit);
      goToWrestler(idx);
    } else if (action === "back-to-wrestler-2") {
      goToWrestler(2);
    } else if (action === "confirm") {
      handleConfirm();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = readForm();
    const errors = validate(data);
    if (Object.keys(errors).length) {
      applyErrors(errors);
      return;
    }
    state.wrestlers[state.activeWrestler] = data;

    if (state.activeWrestler === 1) {
      goToWrestler(2);
    } else {
      goToReview();
    }
  });

  form.addEventListener("input", (e) => {
    const field = e.target.closest(".field");
    if (field) field.classList.remove("has-error");
  });

  form.addEventListener("change", (e) => {
    const field = e.target.closest(".field");
    if (field) field.classList.remove("has-error");
  });

  function handleConfirm() {
    const payload = {
      wrestler1: state.wrestlers[1],
      wrestler2: state.wrestlers[2],
      firstOnMic: state.firstOnMic,
    };
    console.log("Confirmed roster:", payload);
    // Hook for next step (e.g. promo generation API call) goes here.
    const btn = document.querySelector('[data-action="confirm"]');
    if (btn) {
      btn.disabled = true;
      btn.querySelector("span").textContent = "Bell's Rung!";
    }
  }
})();
