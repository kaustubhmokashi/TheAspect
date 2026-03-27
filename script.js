const STORAGE_KEY = "the-aspect-editorial-state-v3";
const WORLD_CITIES_URL = "https://cdn.jsdelivr.net/npm/world-cities-json@1.0.1/data/cities.json";
const ORACLE_COOLDOWN_MS = 25000;
const GENERATION_STAGE_INTERVAL_MS = 2400;
const GENERATION_STALL_MS = 18000;
const GENERATION_ROUTE_SWAP_MS = 45000;
const GENERATION_PERSIST_MS = 90000;

const generationSequence = [
  {
    label: "Reading your birth details",
    detail: "We're taking in your date, time, and birthplace before the reading begins.",
    progress: 14,
  },
  {
    label: "Preparing your chart",
    detail: "Your Sun, Moon, and Rising are being shaped into a clearer personal reading.",
    progress: 32,
  },
  {
    label: "Looking ahead",
    detail: "We're sketching out the daily, weekly, and yearly themes around your chart.",
    progress: 54,
  },
  {
    label: "Writing your life themes",
    detail: "Career, family, and romance are being brought into one cohesive story.",
    progress: 73,
  },
  {
    label: "Finishing the first impression",
    detail: "We're refining the opening so the reading feels complete from the very first glance.",
    progress: 88,
  },
  {
    label: "Putting it all together",
    detail: "Your reading is being gathered into one final, polished experience.",
    progress: 94,
  },
];

const zodiacOrder = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const signMetadata = {
  Aries: {
    element: "Fire",
    modality: "Cardinal",
    sun: "Your will enters the room before your words do, insisting on motion, risk, and authorship.",
    moon: "Emotion arrives hot and immediate, preferring honest combustion over polite repression.",
    rising: "You appear urgent, catalytic, and impossible to ignore.",
  },
  Taurus: {
    element: "Earth",
    modality: "Fixed",
    sun: "Your identity is built through steadiness, sensual intelligence, and a refusal to be rushed.",
    moon: "You regulate emotion through ritual, beauty, and the reassurance of the tangible.",
    rising: "You arrive with poise, gravity, and a grounded sense of value.",
  },
  Gemini: {
    element: "Air",
    modality: "Mutable",
    sun: "Your core thrives on velocity, curiosity, and the art of intelligent contradiction.",
    moon: "You metabolize feeling through language, pattern recognition, and nimble reinterpretation.",
    rising: "You appear quick, articulate, and electrically alert to nuance.",
  },
  Cancer: {
    element: "Water",
    modality: "Cardinal",
    sun: "Your identity takes shape through care, memory, and the instinct to shelter what matters.",
    moon: "Emotion is tidal and powerful, drawing meaning from attachment and history.",
    rising: "You appear intuitive, protective, and quietly commanding.",
  },
  Leo: {
    element: "Fire",
    modality: "Fixed",
    sun: "Your essence wants radiance, creative sovereignty, and work that bears your unmistakable signature.",
    moon: "Feeling intensifies when dignity, loyalty, and recognition are at stake.",
    rising: "You present as luminous, dramatic, and impossible to flatten into the background.",
  },
  Virgo: {
    element: "Earth",
    modality: "Mutable",
    sun: "Your core is exacting, observant, and devoted to refinement over spectacle.",
    moon: "Emotion seeks order, usefulness, and the relief of precise arrangement.",
    rising: "You appear discerning, composed, and structurally aware.",
  },
  Libra: {
    element: "Air",
    modality: "Cardinal",
    sun: "Your identity forms through curation, proportion, and the ethics of beautiful balance.",
    moon: "You process feeling by seeking fairness, resonance, and relational clarity.",
    rising: "You arrive elegant, measured, and instinctively aware of social geometry.",
  },
  Scorpio: {
    element: "Water",
    modality: "Fixed",
    sun: "Your core demands truth beneath appearances and transformation beneath comfort.",
    moon: "Emotion is private, potent, and unwilling to settle for surface explanations.",
    rising: "You appear magnetic, strategic, and psychically concentrated.",
  },
  Sagittarius: {
    element: "Fire",
    modality: "Mutable",
    sun: "Your identity is expanded through meaning, movement, and philosophical appetite.",
    moon: "Feeling seeks room, possibility, and the relief of a wider horizon.",
    rising: "You appear searching, candid, and impossible to confine.",
  },
  Capricorn: {
    element: "Earth",
    modality: "Cardinal",
    sun: "Your core expression is disciplined, legacy-minded, and built for long-haul consequence.",
    moon: "Emotion is filtered through responsibility, restraint, and strategic endurance.",
    rising: "You arrive austere, composed, and quietly authoritative.",
  },
  Aquarius: {
    element: "Air",
    modality: "Fixed",
    sun: "Your identity seeks originality, systems thinking, and futures not yet socially available.",
    moon: "Emotion runs through intellect, principles, and distance that protects perspective.",
    rising: "You appear singular, cerebral, and resistant to stale scripts.",
  },
  Pisces: {
    element: "Water",
    modality: "Mutable",
    sun: "Your core is porous, imaginative, and tuned to what escapes ordinary language.",
    moon: "Feeling arrives like atmosphere, intuition, and emotional weather.",
    rising: "You appear dreamy, receptive, and attuned to invisible currents.",
  },
};

const lifeThemes = {
  Fire: {
    career:
      "Your professional path demands authorship over obedience. Momentum compounds when you choose brave, visible work rather than discreet competence.",
    family:
      "At home you are the ignition point. Relatives often read you as the one who names what everyone else is avoiding.",
    love:
      "Romance needs admiration, candor, and enough oxygen for desire to keep evolving.",
  },
  Earth: {
    career:
      "Your vocation grows through rigor, patience, and material excellence. You are built for structures that outlast trends.",
    family:
      "Domestic life stabilizes when expectations are explicit, roles are clean, and care is made practical.",
    love:
      "You trust slowly, but once anchored you offer devotion with remarkable staying power.",
  },
  Air: {
    career:
      "Work thrives where ideas circulate fast and your pattern recognition gets room to lead the architecture.",
    family:
      "Family dynamics improve when conversation is treated as maintenance rather than aftercare.",
    love:
      "Partnership deepens through wit, shared language, and a sense that both minds remain alive inside the bond.",
  },
  Water: {
    career:
      "Your strongest calling emerges where intuition, empathy, and psychological reading are considered strategic assets.",
    family:
      "Home is a sacred pressure system for you. When it is tender, every other domain grows more coherent.",
    love:
      "Intimacy is transformative, not decorative. You need emotional depth and a partner capable of staying present in it.",
  },
};

const modalityNotes = {
  Cardinal: "You are designed to initiate chapters, set tone, and move first when life stalls.",
  Fixed: "You consolidate energy into staying power, concentration, and memorable force.",
  Mutable: "You excel in transitions, edits, and elegant responses to changing conditions.",
};

const forecastSets = {
  daily: {
    label: "Daily transit",
    window: "24 hours",
    bars: [28, 42, 58, 74, 88, 61, 39, 26],
    start: "06:00",
    peak: "15:00",
    end: "23:00",
  },
  weekly: {
    label: "Weekly spread",
    window: "7 days",
    bars: [34, 52, 78, 63, 47, 70, 92, 55],
    start: "Mon",
    peak: "Sun",
    end: "Late week",
  },
  yearly: {
    label: "Yearly cycle",
    window: "12 months",
    bars: [20, 32, 48, 73, 86, 64, 51, 78],
    start: "Q1",
    peak: "Q3",
    end: "Q4",
  },
};

const tonalLexicon = {
  Fire: {
    nouns: ["combustion", "authorship", "appetite", "velocity", "declaration"],
    virtues: ["courage", "visibility", "creative risk", "directness"],
    shadows: ["impatience", "overextension", "dramatic waste", "ego heat"],
    settings: ["the stage", "the launch point", "the threshold", "the public square"],
  },
  Earth: {
    nouns: ["structure", "material", "legacy", "method", "weight"],
    virtues: ["discipline", "craft", "steadiness", "endurance"],
    shadows: ["rigidity", "overcontrol", "scarcity thinking", "emotional delay"],
    settings: ["the archive", "the foundation", "the workshop", "the long corridor"],
  },
  Air: {
    nouns: ["pattern", "language", "design", "clarity", "signal"],
    virtues: ["wit", "perspective", "connection", "originality"],
    shadows: ["detachment", "overthinking", "diffusion", "ambivalence"],
    settings: ["the salon", "the margin", "the drafting table", "the observatory"],
  },
  Water: {
    nouns: ["depth", "atmosphere", "memory", "devotion", "tide"],
    virtues: ["intuition", "sensitivity", "bonding", "inner truth"],
    shadows: ["avoidance", "fusion", "mood saturation", "private fear"],
    settings: ["the inner chamber", "the tide room", "the hidden archive", "the quiet room"],
  },
};

const defaultState = {
  name: "",
  birthdate: "",
  birthtime: "",
  city: "",
  generatedIssue: null,
  oracleHistory: [],
};

const state = loadState();
const worldCities = {
  ready: false,
  items: [],
  visibleItems: [],
  activeIndex: -1,
};

const elements = {
  profileForm: document.getElementById("profile-form"),
  printButton: document.getElementById("print-button"),
  inputName: document.getElementById("input-name"),
  inputBirthdate: document.getElementById("input-birthdate"),
  inputBirthtime: document.getElementById("input-birthtime"),
  inputCity: document.getElementById("input-city"),
  citySuggestions: document.getElementById("city-suggestions"),
  cityStatus: document.getElementById("city-status"),
  generateButton: document.getElementById("generate-button"),
  generationConsole: document.getElementById("generation-console"),
  generationPulse: document.getElementById("generation-pulse"),
  generationStage: document.getElementById("generation-stage"),
  generationDetail: document.getElementById("generation-detail"),
  generationTrace: document.getElementById("generation-trace"),
  generationMeterFill: document.getElementById("generation-meter-fill"),
  generationStatus: document.getElementById("generation-status"),
  sidebarName: document.getElementById("sidebar-name"),
  sidebarMeta: document.getElementById("sidebar-meta"),
  profileMonogram: document.getElementById("profile-monogram"),
  summaryName: document.getElementById("summary-name"),
  summaryBirth: document.getElementById("summary-birth"),
  summaryCity: document.getElementById("summary-city"),
  chartCoordinates: document.getElementById("chart-coordinates"),
  dominantElement: document.getElementById("dominant-element"),
  dominantModality: document.getElementById("dominant-modality"),
  kundliHouses: document.getElementById("kundli-houses"),
  kundliPath: document.getElementById("kundli-path"),
  kundliPoints: document.getElementById("kundli-points"),
  kundliAnnotations: document.getElementById("kundli-annotations"),
  sunSign: document.getElementById("sun-sign"),
  moonSign: document.getElementById("moon-sign"),
  risingSign: document.getElementById("rising-sign"),
  sunCopy: document.getElementById("sun-copy"),
  moonCopy: document.getElementById("moon-copy"),
  risingCopy: document.getElementById("rising-copy"),
  chartLede: document.getElementById("chart-lede"),
  chartAnalysis: document.getElementById("chart-analysis"),
  forecastLede: document.getElementById("forecast-lede"),
  forecastRangeLabel: document.getElementById("forecast-range-label"),
  forecastHeadline: document.getElementById("forecast-headline"),
  forecastBody: document.getElementById("forecast-body"),
  forecastDirectives: document.getElementById("forecast-directives"),
  forecastBars: document.getElementById("forecast-bars"),
  intensityMeta: document.getElementById("intensity-meta"),
  barsStart: document.getElementById("bars-start"),
  barsPeak: document.getElementById("bars-peak"),
  barsEnd: document.getElementById("bars-end"),
  lifeLede: document.getElementById("life-lede"),
  lifeGrid: document.getElementById("life-grid"),
  oracleFeed: document.getElementById("oracle-feed"),
  oracleForm: document.getElementById("oracle-form"),
  oracleInput: document.getElementById("oracle-input"),
  oracleSubmitButton: document.getElementById("oracle-submit-button"),
  oracleCooldownStatus: document.getElementById("oracle-cooldown-status"),
};

let currentForecastRange = "daily";
let generationUnlocked = false;
let oracleCooldownUntil = 0;
let oracleCooldownTimer = null;
let oracleInFlight = false;
let generationStageTimer = null;
let generationStageIndex = 0;
let generationStallTimer = null;
let generationRouteSwapTimer = null;
let generationPersistTimer = null;

hydrateForm();
renderApp();
setupEvents();
setupObservers();
loadWorldCities();

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaultState);
    }
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      generatedIssue: parsed.generatedIssue || null,
      oracleHistory: Array.isArray(parsed.oracleHistory) && parsed.oracleHistory.length
        ? parsed.oracleHistory
        : structuredClone(defaultState.oracleHistory),
    };
  } catch (_error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrateForm() {
  elements.inputName.value = state.name;
  elements.inputBirthdate.value = state.birthdate;
  elements.inputBirthtime.value = state.birthtime;
  elements.inputCity.value = state.city;
  syncGenerationGate();
  setGenerationFeedback({
    stateName: "idle",
    pulse: "Ready when you are",
    stage: "Waiting for your details",
    status: "Nothing appears until you choose to reveal your horoscope.",
    detail: "Once you're ready, we'll turn your birth details into a full reading.",
    progress: 0,
    trace: "",
  });
  syncOracleCooldown();
}

function setGenerating(isGenerating) {
  elements.generateButton.disabled = isGenerating;
  elements.generateButton.textContent = isGenerating ? "Preparing your reading..." : "Show my horoscope";
}

function setGenerationStatus(message, stateName) {
  elements.generationStatus.textContent = message;
  elements.generationStatus.dataset.state = stateName;
}

function toFriendlyReadingError(message) {
  if (!message) {
    return "Something slowed us down. Please try again in a little while.";
  }

  if (/tried a few different routes/i.test(message)) {
    return "We tried a few different paths, but none of them came through just yet.";
  }

  if (/temporarily busy|rate limit|timed out|longer than/i.test(message)) {
    return "Things are a little busy right now. Please try again in a little while.";
  }

  if (/came back empty|came back incomplete/i.test(message)) {
    return "We started your reading, but it came back incomplete. Please try again in a little while.";
  }

  return "We couldn't prepare your reading just yet. Please try again in a little while.";
}

function setGenerationFeedback({ stateName, pulse, stage, status, detail, progress, trace = "" }) {
  elements.generationConsole.dataset.state = stateName;
  elements.generationPulse.textContent = pulse;
  elements.generationStage.textContent = stage;
  elements.generationDetail.textContent = detail;
  elements.generationMeterFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  if (elements.generationTrace) {
    const normalizedTrace = trace.trim();
    elements.generationTrace.textContent = normalizedTrace ? `Details: ${normalizedTrace}` : "";
    elements.generationTrace.hidden = !normalizedTrace;
  }
  setGenerationStatus(status, stateName);
}

function startGenerationExperience() {
  stopGenerationExperience();
  generationStageIndex = 0;
  renderGenerationStage();
  generationStageTimer = window.setInterval(() => {
    generationStageIndex = Math.min(generationStageIndex + 1, generationSequence.length - 1);
    renderGenerationStage();
  }, GENERATION_STAGE_INTERVAL_MS);
  generationStallTimer = window.setTimeout(() => {
    setGenerationFeedback({
      stateName: "loading",
      pulse: "Still with you",
      stage: "Putting the final pieces together",
      status: "Your reading is taking a little longer than usual.",
      detail: "Stay on this page and we'll keep working in the background.",
      progress: 96,
      trace: "",
    });
  }, GENERATION_STALL_MS);
  generationRouteSwapTimer = window.setTimeout(() => {
    setGenerationFeedback({
      stateName: "loading",
      pulse: "Still trying",
      stage: "Trying another path",
      status: "We're taking a different route to finish your reading.",
      detail: "Sometimes one path gets crowded. We're still working to bring your horoscope through.",
      progress: 97,
      trace: "",
    });
  }, GENERATION_ROUTE_SWAP_MS);
  generationPersistTimer = window.setTimeout(() => {
    setGenerationFeedback({
      stateName: "loading",
      pulse: "Still with you",
      stage: "Finding the clearest path",
      status: "We're still working on your reading.",
      detail: "Thank you for staying with us. We're continuing to try different ways to complete it.",
      progress: 98,
      trace: "",
    });
  }, GENERATION_PERSIST_MS);
}

function stopGenerationExperience() {
  if (generationStageTimer) {
    window.clearInterval(generationStageTimer);
    generationStageTimer = null;
  }

  if (generationStallTimer) {
    window.clearTimeout(generationStallTimer);
    generationStallTimer = null;
  }

  if (generationRouteSwapTimer) {
    window.clearTimeout(generationRouteSwapTimer);
    generationRouteSwapTimer = null;
  }

  if (generationPersistTimer) {
    window.clearTimeout(generationPersistTimer);
    generationPersistTimer = null;
  }
}

function renderGenerationStage() {
  const activeStage = generationSequence[generationStageIndex] || generationSequence[0];
  setGenerationFeedback({
    stateName: "loading",
    pulse: "Creating now",
    stage: activeStage.label,
    status: "Your horoscope is on its way.",
    detail: activeStage.detail,
    progress: activeStage.progress,
    trace: "",
  });
}

function syncGenerationGate() {
  document.body.classList.toggle("is-locked", !generationUnlocked);
}

function startOracleCooldown(durationMs) {
  oracleCooldownUntil = Date.now() + durationMs;
  syncOracleCooldown();

  if (oracleCooldownTimer) {
    window.clearInterval(oracleCooldownTimer);
  }

  oracleCooldownTimer = window.setInterval(() => {
    syncOracleCooldown();
    if (Date.now() >= oracleCooldownUntil) {
      window.clearInterval(oracleCooldownTimer);
      oracleCooldownTimer = null;
    }
  }, 1000);
}

function getOracleCooldownRemainingMs() {
  return Math.max(0, oracleCooldownUntil - Date.now());
}

function syncOracleCooldown() {
  if (!elements.oracleInput || !elements.oracleSubmitButton || !elements.oracleCooldownStatus) {
    return;
  }

  if (oracleInFlight) {
    elements.oracleInput.disabled = true;
    elements.oracleSubmitButton.disabled = true;
    elements.oracleSubmitButton.textContent = "Consulting...";
    elements.oracleCooldownStatus.dataset.state = "loading";
    elements.oracleCooldownStatus.textContent = "The Oracle is reading your question and composing a response...";
    return;
  }

  if (!generationUnlocked || !state.generatedIssue) {
    elements.oracleInput.disabled = true;
    elements.oracleSubmitButton.disabled = true;
    elements.oracleSubmitButton.textContent = "Ask the Oracle";
    elements.oracleCooldownStatus.dataset.state = "cooldown";
    elements.oracleCooldownStatus.textContent = "Reveal your horoscope first to open The Oracle.";
    return;
  }

  const remainingMs = getOracleCooldownRemainingMs();
  if (remainingMs > 0) {
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    elements.oracleInput.disabled = true;
    elements.oracleSubmitButton.disabled = true;
    elements.oracleSubmitButton.textContent = "Cooling down";
    elements.oracleCooldownStatus.dataset.state = "cooldown";
    elements.oracleCooldownStatus.textContent = `Give it a moment, then try again in about ${remainingSeconds}s.`;
    return;
  }

  elements.oracleInput.disabled = false;
  elements.oracleSubmitButton.disabled = false;
  elements.oracleSubmitButton.textContent = "Ask the Oracle";
  elements.oracleCooldownStatus.dataset.state = "ready";
  elements.oracleCooldownStatus.textContent = "The Oracle is ready for one question.";
}

function setupEvents() {
  elements.profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submittedProfile = {
      name: elements.inputName.value.trim(),
      birthdate: elements.inputBirthdate.value.trim(),
      birthtime: elements.inputBirthtime.value.trim(),
      city: elements.inputCity.value.trim(),
    };
    const placeholderMode = isPlaceholderSeed(submittedProfile);

    if (!placeholderMode && !isBirthdateValid(submittedProfile.birthdate)) {
      setGenerationStatus("Enter birthday in dd/mm/yyyy format.", "error");
      return;
    }

    if (!placeholderMode && !isBirthtimeValid(submittedProfile.birthtime)) {
      setGenerationStatus("Enter time in 00:00 am format.", "error");
      return;
    }

    if (!placeholderMode && !submittedProfile.city) {
      setGenerationStatus("Choose a birthplace from the city list.", "error");
      return;
    }

    const normalizedProfile = placeholderMode
      ? {
        name: "Sample Reading",
        birthdate: isBirthdateValid(submittedProfile.birthdate) ? submittedProfile.birthdate : "dd/mm/yyyy",
        birthtime: isBirthtimeValid(submittedProfile.birthtime) ? submittedProfile.birthtime : "00:00 am",
        city: submittedProfile.city || "Sample City",
      }
      : submittedProfile;

    const previousSignature = `${state.name}|${state.birthdate}|${state.birthtime}|${state.city}`;

    state.name = normalizedProfile.name;
    state.birthdate = normalizedProfile.birthdate;
    state.birthtime = normalizedProfile.birthtime;
    state.city = normalizedProfile.city;

    const nextSignature = `${state.name}|${state.birthdate}|${state.birthtime}|${state.city}`;
    if (previousSignature !== nextSignature) {
      state.generatedIssue = null;
      state.oracleHistory = [];
    }

    const profile = buildProfile(state);

    generationUnlocked = false;
    setGenerating(true);
    startGenerationExperience();

    try {
      state.generatedIssue = placeholderMode
        ? buildPlaceholderIssue(profile)
        : await generateIssueWithAI(profile);
      state.oracleHistory = [];
      generationUnlocked = true;
      startOracleCooldown(ORACLE_COOLDOWN_MS);
      syncGenerationGate();
      saveState();
      renderApp();
      stopGenerationExperience();
      setGenerationFeedback({
        stateName: "success",
        pulse: "Ready to explore",
        stage: placeholderMode ? "Your sample reading is here" : "Your reading is here",
        status: placeholderMode ? "Sample horoscope is ready." : "Your horoscope is ready.",
        detail: placeholderMode
          ? "This version uses placeholder writing so you can preview the layout and export the PDF."
          : "You can now explore your chart, forecast, life themes, and the Oracle below.",
        progress: 100,
        trace: "",
      });
    } catch (error) {
      stopGenerationExperience();
      setGenerationFeedback({
        stateName: "error",
        pulse: "Not quite yet",
        stage: "We hit a delay",
        status: toFriendlyReadingError(error.message),
        detail: "Nothing below has been revealed yet. Please try again in a little while.",
        progress: 100,
        trace: error.message || "",
      });
    } finally {
      syncGenerationGate();
      setGenerating(false);
    }
  });

  document.querySelectorAll("[data-forecast-range]").forEach((button) => {
    button.addEventListener("click", () => {
      currentForecastRange = button.dataset.forecastRange;
      document.querySelectorAll("[data-forecast-range]").forEach((item) => {
        item.classList.toggle("is-selected", item === button);
      });
      renderForecast(buildProfile(state));
    });
  });

  document.querySelectorAll(".quick-prompts__button").forEach((button) => {
    button.addEventListener("click", () => {
      elements.oracleInput.value = button.dataset.prompt;
      elements.oracleInput.focus();
    });
  });

  elements.inputCity.addEventListener("input", () => {
    updateCitySuggestions(elements.inputCity.value);
  });

  elements.inputCity.addEventListener("focus", () => {
    updateCitySuggestions(elements.inputCity.value);
  });

  elements.inputCity.addEventListener("keydown", (event) => {
    if (elements.citySuggestions.hidden) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveCitySelection(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveCitySelection(-1);
    } else if (event.key === "Enter" && worldCities.activeIndex >= 0) {
      event.preventDefault();
      applyCitySuggestion(worldCities.visibleItems[worldCities.activeIndex]);
    } else if (event.key === "Escape") {
      hideCitySuggestions();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".city-field")) {
      hideCitySuggestions();
    }
  });

  elements.printButton.addEventListener("click", async () => {
    await downloadIssuePdf();
  });

  elements.oracleForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = elements.oracleInput.value.trim();
    if (!question) {
      return;
    }

    if (!generationUnlocked || !state.generatedIssue) {
      setGenerationStatus("Generate the main issue first, then use The Oracle.", "error");
      return;
    }

    if (getOracleCooldownRemainingMs() > 0) {
      syncOracleCooldown();
      setGenerationStatus(`Please wait ${Math.ceil(getOracleCooldownRemainingMs() / 1000)}s before asking The Oracle again.`, "error");
      return;
    }

    oracleInFlight = true;
    syncOracleCooldown();
    setGenerationStatus("Consulting the oracle...", "idle");

    try {
      const profile = buildProfile(state);
      const answer = await generateOracleAnswerWithAI(profile, question, state.generatedIssue);
      state.oracleHistory.unshift({ question, answer });
      state.oracleHistory = state.oracleHistory.slice(0, 6);
      elements.oracleInput.value = "";
      startOracleCooldown(ORACLE_COOLDOWN_MS);
      saveState();
      renderOracle();
      setGenerationStatus("Oracle response generated.", "success");
    } catch (error) {
      const retryDelayMs = getRetryDelayMs(error.message);
      if (retryDelayMs > 0) {
        startOracleCooldown(retryDelayMs);
      }
      setGenerationStatus(`Oracle generation failed: ${error.message}`, "error");
    } finally {
      oracleInFlight = false;
      syncOracleCooldown();
    }
  });

}

function setupObservers() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) {
        return;
      }

      const section = visibleEntry.target.dataset.section;
      document.querySelectorAll("[data-section-link]").forEach((link) => {
        link.classList.toggle("is-active", link.dataset.sectionLink === section);
      });
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.15, 0.3, 0.6],
    }
  );

  document.querySelectorAll("[data-section]").forEach((section) => navObserver.observe(section));
}

function renderApp() {
  const profile = buildProfile(state);

  renderSidebar(profile);
  renderSummary(profile);
  renderChart(profile);
  renderForecast(profile);
  renderLifePath(profile);
  renderOracle();
  syncOracleCooldown();
}

function renderSidebar(profile) {
  elements.sidebarName.textContent = profile.name || "Profile Pending";
  elements.sidebarMeta.textContent = `Sun in ${profile.sun} · Rising in ${profile.rising}`;
  elements.profileMonogram.textContent = getMonogram(profile.name);
}

function renderSummary(profile) {
  elements.summaryName.textContent = profile.name || "Full Name";
  elements.summaryBirth.textContent = state.birthdate && state.birthtime
    ? `${state.birthdate} · ${state.birthtime}`
    : "dd/mm/yyyy · 00:00 am";
  elements.summaryCity.textContent = profile.city || "Birthplace.";
}

function renderChart(profile) {
  const sunMeta = signMetadata[profile.sun];
  const moonMeta = signMetadata[profile.moon];
  const risingMeta = signMetadata[profile.rising];
  const chart = getVisibleIssue()?.chart;

  elements.chartCoordinates.textContent = `${profile.city} · ${profile.birthtime} local`;
  elements.dominantElement.textContent = profile.element;
  elements.dominantModality.textContent = profile.modality;
  elements.sunSign.textContent = profile.sun;
  elements.moonSign.textContent = profile.moon;
  elements.risingSign.textContent = profile.rising;
  elements.sunCopy.textContent = sunMeta.sun;
  elements.moonCopy.textContent = moonMeta.moon;
  elements.risingCopy.textContent = risingMeta.rising;
  renderKundliVisual(profile);
  elements.chartLede.textContent = chart?.lede || "Reveal your horoscope to fill this section with your personal chart reading.";
  elements.chartAnalysis.innerHTML = (chart?.paragraphs || [
    "Your Sun, Moon, and Rising are ready in outline, but the full reading is still waiting to be revealed.",
    "Use The Genesis and tap Show my horoscope to bring this section to life.",
  ]).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function renderKundliVisual(profile) {
  if (!elements.kundliHouses || !elements.kundliPath || !elements.kundliPoints || !elements.kundliAnnotations) {
    return;
  }

  const centerX = 300;
  const centerY = 300;
  const houseRadius = 166;
  const pointRadius = 132;
  const annotationRadius = 206;
  const signs = [
    { key: "sun", label: "Sun", sign: profile.sun, tone: "primary" },
    { key: "moon", label: "Moon", sign: profile.moon, tone: "muted" },
    { key: "rising", label: "Rising", sign: profile.rising, tone: "primary" },
    { key: "work", label: "Work", sign: zodiacOrder[(profile.hash + 2) % zodiacOrder.length], tone: "muted" },
    { key: "heart", label: "Heart", sign: zodiacOrder[(profile.hash + 9) % zodiacOrder.length], tone: "primary" },
  ];

  elements.kundliHouses.innerHTML = zodiacOrder
    .map((sign, index) => {
      const tick = polarPoint(centerX, centerY, houseRadius, signToAngle(index));
      return `
        <g class="kundli-house-mark">
          <circle cx="${tick.x.toFixed(1)}" cy="${tick.y.toFixed(1)}" r="2.5" class="kundli-house-dot"></circle>
          <text x="${tick.x.toFixed(1)}" y="${(tick.y + 18).toFixed(1)}" class="kundli-house-label" text-anchor="middle">${escapeHtml(sign.slice(0, 3).toUpperCase())}</text>
        </g>
      `;
    })
    .join("");

  const plotted = signs.map((item, index) => {
    const baseIndex = zodiacOrder.indexOf(item.sign);
    const angle = signToAngle(baseIndex) + ((profile.hash + index * 17) % 10 - 5);
    const point = polarPoint(centerX, centerY, pointRadius - index * 6, angle);
    const note = polarPoint(centerX, centerY, annotationRadius - index * 6, angle);
    return { ...item, angle, point, note };
  });

  elements.kundliPath.setAttribute(
    "d",
    plotted.map((item, index) => `${index === 0 ? "M" : "L"} ${item.point.x.toFixed(1)} ${item.point.y.toFixed(1)}`).join(" ") + " Z"
  );

  elements.kundliPoints.innerHTML = plotted
    .map(
      (item) => `
        <circle
          cx="${item.point.x.toFixed(1)}"
          cy="${item.point.y.toFixed(1)}"
          r="${item.key === "rising" ? 8 : 7}"
          class="kundli-point${item.tone === "muted" ? " kundli-point--muted" : ""}"
        ></circle>
      `
    )
    .join("");

  elements.kundliAnnotations.innerHTML = plotted
    .slice(0, 3)
    .map(
      (item) => `
        <g class="kundli-annotation">
          <line
            x1="${item.point.x.toFixed(1)}"
            y1="${item.point.y.toFixed(1)}"
            x2="${item.note.x.toFixed(1)}"
            y2="${item.note.y.toFixed(1)}"
            class="kundli-annotation-line"
          ></line>
          <text
            x="${item.note.x.toFixed(1)}"
            y="${(item.note.y - 8).toFixed(1)}"
            class="kundli-annotation-label"
            text-anchor="middle"
          >${escapeHtml(item.label)}</text>
          <text
            x="${item.note.x.toFixed(1)}"
            y="${(item.note.y + 10).toFixed(1)}"
            class="kundli-annotation-sign"
            text-anchor="middle"
          >${escapeHtml(item.sign)}</text>
        </g>
      `
    )
    .join("");
}

function signToAngle(signIndex) {
  return -90 + signIndex * 30;
}

function polarPoint(centerX, centerY, radius, angleDeg) {
  const radians = angleDeg * (Math.PI / 180);
  return {
    x: centerX + Math.cos(radians) * radius,
    y: centerY + Math.sin(radians) * radius,
  };
}

function renderForecast(profile) {
  const range = forecastSets[currentForecastRange];
  const visibleIssue = getVisibleIssue();
  const active = visibleIssue?.forecast?.[currentForecastRange];

  elements.forecastLede.textContent = visibleIssue
    ? `Current transit material is generated from ${profile.name}'s ${profile.sun}-${profile.moon}-${profile.rising} axis and ${profile.city}'s submitted coordinates.`
    : "Daily, weekly, and yearly guidance will appear here once your horoscope is ready.";
  elements.forecastRangeLabel.textContent = range.label;
  elements.forecastHeadline.textContent = active?.headline || "Your forecast will appear here";
  elements.forecastBody.textContent = active?.body || "Share your birth details and choose Show my horoscope to reveal this forecast.";
  elements.forecastDirectives.innerHTML = (active?.directives || [
    "Reveal your horoscope to receive tailored guidance.",
  ]).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  elements.intensityMeta.textContent = `Window · ${range.window}`;
  elements.barsStart.textContent = range.start;
  elements.barsPeak.textContent = range.peak;
  elements.barsEnd.textContent = range.end;

  elements.forecastBars.innerHTML = range.bars
    .map((value, index) => {
      const adjusted = Math.max(18, Math.min(100, value + profile.energyShift + index * 1.5));
      return `<span style="height:${adjusted}%"></span>`;
    })
    .join("");
}

function renderLifePath(profile) {
  const life = getVisibleIssue()?.life;
  const cards = life?.cards || [];

  elements.lifeLede.textContent = life?.lede || "Your profession, family, and romance themes will appear here once your reading is ready.";
  elements.lifeGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="life-card">
          <p class="life-card__eyebrow">${escapeHtml(card.eyebrow)}</p>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
          <ul>${card.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("") || `
      <article class="life-card">
        <p class="life-card__eyebrow">Module 01</p>
        <h3>Life Path Pending</h3>
        <p>Show your horoscope to replace this placeholder with editorial assessments.</p>
      </article>
    `;
}

function renderOracle() {
  const profile = buildProfile(state);
  const visibleIssue = getVisibleIssue();
  const history = state.oracleHistory.length
    ? state.oracleHistory
    : visibleIssue?.oracleWelcome
      ? [visibleIssue.oracleWelcome]
      : [
        {
          question: `What does ${profile.name}'s issue begin with?`,
          answer: "Reveal your horoscope first, then ask a question here for a personal answer.",
        },
      ];

  elements.oracleFeed.innerHTML = history
    .map(
      (item, index) => `
        <article class="oracle-card ${index === 0 ? "oracle-card--featured" : ""}">
          <p class="oracle-card__meta">${index === 0 ? "Latest answer" : `Earlier reading ${String(index + 1).padStart(2, "0")}`}</p>
          <h3 class="oracle-card__question">"${escapeHtml(item.question)}"</h3>
          <p class="oracle-card__answer">${escapeHtml(item.answer)}</p>
        </article>
      `
    )
    .join("");
}

function buildProfile(source) {
  const parsedDate = parseBirthdateInput(source.birthdate);
  const parsedTime = parseBirthtimeInput(source.birthtime);
  const hash = hashString(`${source.name}|${source.birthdate}|${source.birthtime}|${source.city}`);
  const sun = getSunSign(source.birthdate);
  const moon = zodiacOrder[(hash + 3) % zodiacOrder.length];
  const rising = zodiacOrder[(hash + 7) % zodiacOrder.length];
  const meta = signMetadata[sun];
  const day = parsedDate
    ? new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day)
    : new Date();
  const year = parsedDate?.year;
  const month = parsedDate?.month;
  const dayOfMonth = parsedDate?.day;
  const hour = parsedTime?.hour24;
  const minute = parsedTime?.minute;
  const cityToken = (source.city || "the city").split(",")[0].trim();

  return {
    name: source.name || "Untitled Seeker",
    city: source.city || "Undisclosed city",
    cityToken,
    birthtime: source.birthtime || "00:00 am",
    formattedDate: parsedDate ? formatDate(day) : "dd/mm/yyyy",
    sun,
    moon,
    rising,
    element: meta.element,
    modality: meta.modality,
    voice: buildVoice(meta.element, meta.modality),
    energyShift: (hash % 12) - 6,
    peakYear: 2026 + (hash % 4),
    compatibility: buildCompatibility(meta.element),
    birthHour: Number.isFinite(hour) ? hour : 0,
    birthMinute: Number.isFinite(minute) ? minute : 0,
    birthMonth: Number.isFinite(month) ? month : 1,
    birthDay: Number.isFinite(dayOfMonth) ? dayOfMonth : 1,
    birthYear: Number.isFinite(year) ? year : 1992,
    hash,
  };
}

function getVisibleIssue() {
  return generationUnlocked ? state.generatedIssue : null;
}

async function generateIssueWithAI(profile) {
  const issue = await postJson("/api/generate-issue", { profile });
  if (!isRenderableIssue(issue)) {
    throw new Error("The reading came back empty, so we're trying again.");
  }
  return issue;
}

function buildPlaceholderIssue(profile) {
  return {
    chart: {
      lede: `This is a sample chart reading for ${profile.city}, designed to preview the editorial layout before a live horoscope is generated.`,
      paragraphs: [
        `${profile.name} is shown here with a ${profile.sun} Sun, ${profile.moon} Moon, and ${profile.rising} Rising so the overall structure feels complete in the exported document.`,
        `The emotional tone, timing language, and life themes in this version are intentionally illustrative. They are here to help you test the reading flow, typography, and downloadable PDF.`,
        `Once real birth details are entered, this section is replaced with a full personalized reading generated for the exact profile submitted.`,
      ],
    },
    forecast: {
      daily: {
        headline: "A calm placeholder for the day ahead",
        body: `Today is represented as a composed editorial sample: steady focus, one thoughtful conversation, and a gentle sense of forward motion through ${profile.city}.`,
        directives: [
          "Use this placeholder to confirm the daily block appears correctly in the PDF.",
          "Check that the headline, body copy, and bullet guidance are all readable.",
          "Replace the sample with a real reading whenever you are ready.",
        ],
      },
      weekly: {
        headline: "A sample week with room to revise",
        body: "This weekly spread is intentionally broad and balanced, showing how longer-form forecast writing will sit on the page without relying on live model output.",
        directives: [
          "Review the spacing and pacing of the weekly section.",
          "Confirm the exported PDF preserves the hierarchy cleanly.",
          "Use the sample version for layout approval before live generation.",
        ],
      },
      yearly: {
        headline: "A placeholder long-range horizon",
        body: `The longer arc here is simple on purpose: a year of refinement, stronger boundaries, and a quieter but more confident sense of direction.`,
        directives: [
          "Make sure this yearly section prints without clipping.",
          "Check that the tone still feels polished in a text-only export.",
          "Treat this as sample copy rather than a literal prediction.",
        ],
      },
    },
    life: {
      lede: "These life path cards are sample editorial modules meant to demonstrate hierarchy, readability, and export quality.",
      cards: [
        {
          eyebrow: "Career",
          title: "Work and vocation",
          body: "A placeholder career reading should still feel measured and useful, giving the exported report enough substance to look complete.",
          list: [
            "Review whether headings and body copy feel balanced.",
            "Confirm lists remain readable across page breaks.",
            "Use this card to test the professional guidance format.",
          ],
        },
        {
          eyebrow: "Family",
          title: "Private bonds",
          body: "This section stands in for family and home themes, showing the tone and density of a finished reading without waiting on a live response.",
          list: [
            "Check spacing between cards in the PDF.",
            "Make sure paragraph lengths feel comfortable to read.",
            "Use the placeholder to validate the overall section rhythm.",
          ],
        },
        {
          eyebrow: "Romance",
          title: "Love and attachment",
          body: "This sample romance card exists so the emotional register of the report still feels present, even in a test export.",
          list: [
            "Review how the card title and list appear in the download.",
            "Confirm this section reads clearly in a simple text layout.",
            "Swap it for a real reading once the live route is available.",
          ],
        },
      ],
    },
    oracleWelcome: {
      question: "What is this sample reading for?",
      answer: "It is a placeholder version of The Aspect, useful for testing the layout, the section flow, and the exported PDF before generating a live horoscope.",
    },
  };
}

async function downloadIssuePdf() {
  if (!generationUnlocked || !state.generatedIssue) {
    setGenerationFeedback({
      stateName: "idle",
      pulse: "Almost there",
      stage: "Your PDF will be ready soon",
      status: "Reveal your horoscope first.",
      detail: "Once your reading is on the page, you can download it as a PDF in one step.",
      progress: 0,
      trace: "",
    });
    return;
  }

  const hasExporter = await ensurePdfExporter();
  if (!hasExporter) {
    setGenerationFeedback({
      stateName: "error",
      pulse: "Not ready yet",
      stage: "Download unavailable",
      status: "We couldn't prepare the PDF export just now.",
      detail: "Please refresh the page and try again.",
      progress: 100,
      trace: "PDF library unavailable",
    });
    return;
  }

  const originalLabel = elements.printButton.textContent;
  elements.printButton.disabled = true;
  elements.printButton.textContent = "Preparing PDF...";
  cleanupPdfArtifacts();

  try {
    const shell = document.querySelector(".shell");
    const html2canvas = window.html2canvas;
    const jsPDF = window.jspdf?.jsPDF;

    if (!shell || !html2canvas || !jsPDF) {
      throw new Error("PDF tools unavailable");
    }

    const canvas = await html2canvas(shell, {
      scale: 1.6,
      useCORS: true,
      backgroundColor: "#fffef9",
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: shell.scrollHeight,
    });

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageWidth = pageWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    const imageData = canvas.toDataURL("image/png");

    let remainingHeight = imageHeight;
    let offsetY = 0;

    pdf.addImage(imageData, "PNG", 0, offsetY, imageWidth, imageHeight, undefined, "FAST");
    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
      offsetY = remainingHeight - imageHeight;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, offsetY, imageWidth, imageHeight, undefined, "FAST");
      remainingHeight -= pageHeight;
    }

    const pdfBlob = pdf.output("blob");
    triggerPdfDownload(pdfBlob, buildPdfFilename());

    setGenerationFeedback({
      stateName: "success",
      pulse: "Saved",
      stage: "Your PDF is ready",
      status: "Your page has been downloaded as a PDF.",
      detail: "It captures the reading exactly as it appears on the page.",
      progress: 100,
      trace: "",
    });
  } catch (error) {
    console.error("[pdf] Export failed:", error);
    setGenerationFeedback({
      stateName: "error",
      pulse: "Not quite yet",
      stage: "Download interrupted",
      status: "We couldn't create the PDF just now.",
      detail: "Please try again in a moment.",
      progress: 100,
      trace: error?.message || "Unknown PDF export error",
    });
  } finally {
    cleanupPdfArtifacts();
    elements.printButton.disabled = false;
    elements.printButton.textContent = originalLabel;
    syncOracleCooldown();
  }
}

async function ensurePdfExporter() {
  if (window.html2pdf && window.html2canvas && window.jspdf?.jsPDF) {
    return true;
  }

  const sources = [
    "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js",
  ];

  for (const source of sources) {
    const loaded = await loadExternalScript(source);
    if (loaded && window.html2pdf && window.html2canvas && window.jspdf?.jsPDF) {
      return true;
    }
  }

  return false;
}

function loadExternalScript(src) {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[data-external-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve(true);
        return;
      }

      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.dataset.externalSrc = src;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve(true);
    }, { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.appendChild(script);
  });
}

function triggerPdfDownload(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function cleanupPdfArtifacts() {
  document.querySelectorAll(".html2pdf__container, .html2pdf__overlay, .html2canvas-container").forEach((node) => {
    node.remove();
  });

  document.querySelectorAll("iframe").forEach((frame) => {
    if (frame.classList.contains("html2pdf__overlay") || frame.classList.contains("html2canvas-container")) {
      frame.remove();
    }
  });

  document.body.style.removeProperty("overflow");
}

function buildPdfCover() {
  const profile = buildProfile(state);
  const cover = document.createElement("section");
  cover.className = "pdf-cover";
  cover.innerHTML = `
    <p class="pdf-cover__eyebrow">The Aspect</p>
    <h1 class="pdf-cover__title">${escapeHtml(profile.name)}</h1>
    <p class="pdf-cover__meta">${escapeHtml(state.birthdate)} · ${escapeHtml(state.birthtime)} · ${escapeHtml(profile.city)}</p>
    <p class="pdf-cover__summary">A personal horoscope with chart, forecast, life themes, and oracle guidance.</p>
  `;
  return cover;
}

function buildPdfFilename() {
  const nameToken = (state.name || "the-aspect-horoscope")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${nameToken || "the-aspect-horoscope"}-horoscope.pdf`;
}

async function generateOracleAnswerWithAI(profile, question, generatedIssue) {
  const response = await postJson("/api/oracle", { profile, question, generatedIssue });
  if (!hasMeaningfulText(response?.answer)) {
    throw new Error("The oracle answer came back empty, so we're trying another route.");
  }
  return response.answer;
}

async function postJson(url, body) {
  const retryableStatuses = new Set([502, 503, 504]);
  const retryDelays = [0, 2000, 4500];
  let lastError = null;

  for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
    if (retryDelays[attempt] > 0) {
      await sleep(retryDelays[attempt]);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const rawText = await response.text();
    const payload = safeParseJson(rawText);

    if (response.ok) {
      return payload?.data;
    }

    const message = payload?.error || rawText.trim() || `Request failed with status ${response.status}`;
    lastError = new Error(message);

    if (!retryableStatuses.has(response.status)) {
      throw lastError;
    }
  }

  throw lastError || new Error("Request failed after multiple attempts.");
}

function safeParseJson(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (_error) {
    return null;
  }
}

function getSunSign(dateString) {
  const parsed = parseBirthdateInput(dateString);
  if (!parsed) {
    return "Libra";
  }

  const { month, day } = parsed;
  const value = month * 100 + day;

  if (value >= 321 && value <= 419) return "Aries";
  if (value >= 420 && value <= 520) return "Taurus";
  if (value >= 521 && value <= 620) return "Gemini";
  if (value >= 621 && value <= 722) return "Cancer";
  if (value >= 723 && value <= 822) return "Leo";
  if (value >= 823 && value <= 922) return "Virgo";
  if (value >= 923 && value <= 1022) return "Libra";
  if (value >= 1023 && value <= 1121) return "Scorpio";
  if (value >= 1122 && value <= 1221) return "Sagittarius";
  if (value >= 1222 || value <= 119) return "Capricorn";
  if (value >= 120 && value <= 218) return "Aquarius";
  return "Pisces";
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildVoice(element, modality) {
  const elementVoice = {
    Fire: "urgent, visible, and impossible to misread for passivity",
    Earth: "deliberate, exacting, and built to last longer than appetite",
    Air: "articulate, bright, and constantly revising the frame",
    Water: "psychologically precise, atmospheric, and emotionally high-resolution",
  }[element];

  const modalityVoice = {
    Cardinal: "with a first-move instinct that keeps asking for authorship",
    Fixed: "with a staying power that turns instinct into impact",
    Mutable: "with an adaptive intelligence that edits reality in real time",
  }[modality];

  return `${elementVoice}, ${modalityVoice}`;
}

function buildCompatibility(element) {
  return {
    Fire: "bold air or grounded fire",
    Earth: "steady water or articulate earth",
    Air: "brave fire or nuanced air",
    Water: "patient earth or emotionally fluent water",
  }[element];
}

function pick(list, seed) {
  return list[Math.abs(seed) % list.length];
}

function getDayPhase(hour) {
  if (hour < 5) return "the pre-dawn margin";
  if (hour < 12) return "morning light";
  if (hour < 17) return "the active afternoon";
  if (hour < 21) return "the evening threshold";
  return "night architecture";
}

function getYearPulse(month) {
  if (month <= 3) return "The first quarter";
  if (month <= 6) return "Midyear";
  if (month <= 9) return "The late-year ascent";
  return "The closing quarter";
}

function getMonogram(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
    .padEnd(2, "A");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function parseBirthdateInput(value) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return { day, month, year };
}

function parseBirthtimeInput(value) {
  const match = value.trim().match(/^(\d{2}):(\d{2})\s?(am|pm)$/i);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toLowerCase();

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    return null;
  }

  if (meridiem === "am") {
    hour = hour === 12 ? 0 : hour;
  } else {
    hour = hour === 12 ? 12 : hour + 12;
  }

  return { hour24: hour, minute };
}

function isBirthdateValid(value) {
  return Boolean(parseBirthdateInput(value));
}

function isBirthtimeValid(value) {
  return Boolean(parseBirthtimeInput(value));
}

function isPlaceholderSeed(value) {
  return value?.name === "0";
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function isRenderableIssue(issue) {
  return Boolean(
    issue &&
    hasMeaningfulText(issue.chart?.lede) &&
    hasMeaningfulList(issue.chart?.paragraphs, 3) &&
    hasMeaningfulText(issue.forecast?.daily?.headline) &&
    hasMeaningfulText(issue.forecast?.daily?.body) &&
    hasMeaningfulList(issue.forecast?.daily?.directives, 3) &&
    hasMeaningfulText(issue.forecast?.weekly?.headline) &&
    hasMeaningfulText(issue.forecast?.weekly?.body) &&
    hasMeaningfulList(issue.forecast?.weekly?.directives, 3) &&
    hasMeaningfulText(issue.forecast?.yearly?.headline) &&
    hasMeaningfulText(issue.forecast?.yearly?.body) &&
    hasMeaningfulList(issue.forecast?.yearly?.directives, 3) &&
    hasMeaningfulText(issue.life?.lede) &&
    Array.isArray(issue.life?.cards) &&
    issue.life.cards.length === 3 &&
    issue.life.cards.every((card) =>
      hasMeaningfulText(card?.title) &&
      hasMeaningfulText(card?.eyebrow) &&
      hasMeaningfulText(card?.body) &&
      hasMeaningfulList(card?.list, 3)
    ) &&
    hasMeaningfulText(issue.oracleWelcome?.question) &&
    hasMeaningfulText(issue.oracleWelcome?.answer)
  );
}

function hasMeaningfulText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasMeaningfulList(value, minimumLength) {
  return Array.isArray(value) && value.length >= minimumLength && value.every(hasMeaningfulText);
}

function getRetryDelayMs(message) {
  const match = message.match(/(\d+)\s*seconds?/i);
  if (!match) {
    return 0;
  }

  return Number(match[1]) * 1000;
}

async function loadWorldCities() {
  try {
    setCityStatus("Loading searchable world city list...");
    const response = await fetch(WORLD_CITIES_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    worldCities.items = data.map((item) => ({
      value: `${item.city}, ${item.country}`,
      admin: item.admin_name || "",
      search: `${item.city} ${item.city_ascii || ""} ${item.country} ${item.admin_name || ""}`.toLowerCase(),
    }));
    worldCities.ready = true;
    setCityStatus("Search by city name and choose a birthplace from the world list.");
  } catch (_error) {
    worldCities.ready = false;
    setCityStatus("Could not load the world city list. Refresh to try again.");
  }
}

function setCityStatus(message) {
  if (elements.cityStatus) {
    elements.cityStatus.textContent = message;
  }
}

function updateCitySuggestions(query) {
  if (!worldCities.ready) {
    return;
  }

  const term = query.trim().toLowerCase();
  worldCities.visibleItems = (term
    ? worldCities.items.filter((item) => item.search.includes(term))
    : worldCities.items).slice(0, 12);

  worldCities.activeIndex = worldCities.visibleItems.length ? 0 : -1;
  renderCitySuggestions();
}

function renderCitySuggestions() {
  if (!elements.citySuggestions) {
    return;
  }

  if (!worldCities.visibleItems.length) {
    elements.citySuggestions.hidden = true;
    elements.citySuggestions.innerHTML = "";
    return;
  }

  elements.citySuggestions.hidden = false;
  elements.citySuggestions.innerHTML = worldCities.visibleItems
    .map((item, index) => `
      <button
        type="button"
        class="city-suggestion${index === worldCities.activeIndex ? " is-active" : ""}"
        data-city-index="${index}"
      >
        ${escapeHtml(item.value)}
        <span class="city-suggestion__meta">${escapeHtml(item.admin || "World city result")}</span>
      </button>
    `)
    .join("");

  elements.citySuggestions.querySelectorAll("[data-city-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = worldCities.visibleItems[Number(button.dataset.cityIndex)];
      applyCitySuggestion(selected);
    });
  });
}

function applyCitySuggestion(item) {
  if (!item) {
    return;
  }

  elements.inputCity.value = item.value;
  hideCitySuggestions();
}

function moveCitySelection(direction) {
  if (!worldCities.visibleItems.length) {
    return;
  }

  worldCities.activeIndex =
    (worldCities.activeIndex + direction + worldCities.visibleItems.length) % worldCities.visibleItems.length;
  renderCitySuggestions();
}

function hideCitySuggestions() {
  if (elements.citySuggestions) {
    elements.citySuggestions.hidden = true;
  }
}
