const STORAGE_KEY = "the-aspect-editorial-state-v3";
const WORLD_CITIES_URL = "https://cdn.jsdelivr.net/npm/world-cities-json@1.0.1/data/cities.json";
const ORACLE_COOLDOWN_MS = 25000;

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

const sanctuaryThemes = [
  "disciplined tenderness",
  "measured reinvention",
  "devotion under revision",
  "precision after release",
  "audacity with structure",
  "quiet emotional clarity",
];

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
    settings: ["the inner chamber", "the tide room", "the hidden archive", "the sanctuary"],
  },
};

const defaultState = {
  name: "",
  birthdate: "",
  birthtime: "",
  city: "",
  generatedIssue: null,
  oracleHistory: [],
  journalEntries: [],
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
  journalForm: document.getElementById("journal-form"),
  journalEntry: document.getElementById("journal-entry"),
  journalEntries: document.getElementById("journal-entries"),
  sanctuaryTheme: document.getElementById("sanctuary-theme"),
  timelineRibbon: document.getElementById("timeline-ribbon"),
};

let currentForecastRange = "daily";
let generationUnlocked = false;
let oracleCooldownUntil = 0;
let oracleCooldownTimer = null;
let oracleInFlight = false;

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
      journalEntries: Array.isArray(parsed.journalEntries) && parsed.journalEntries.length
        ? parsed.journalEntries
        : structuredClone(defaultState.journalEntries),
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
  setGenerationStatus("Nothing is generated until you click Generate my issue.", "idle");
  syncOracleCooldown();
}

function setGenerating(isGenerating) {
  elements.generateButton.disabled = isGenerating;
  elements.generateButton.textContent = isGenerating ? "Generating issue..." : "Generate my issue";
}

function setGenerationStatus(message, stateName) {
  elements.generationStatus.textContent = message;
  elements.generationStatus.dataset.state = stateName;
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
    elements.oracleSubmitButton.textContent = "Interrogate";
    elements.oracleCooldownStatus.dataset.state = "cooldown";
    elements.oracleCooldownStatus.textContent = "Generate the issue first to unlock The Oracle.";
    return;
  }

  const remainingMs = getOracleCooldownRemainingMs();
  if (remainingMs > 0) {
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    elements.oracleInput.disabled = true;
    elements.oracleSubmitButton.disabled = true;
    elements.oracleSubmitButton.textContent = "Cooling down";
    elements.oracleCooldownStatus.dataset.state = "cooldown";
    elements.oracleCooldownStatus.textContent = `Oracle cooling down to stay within free-tier limits. Try again in ${remainingSeconds}s.`;
    return;
  }

  elements.oracleInput.disabled = false;
  elements.oracleSubmitButton.disabled = false;
  elements.oracleSubmitButton.textContent = "Interrogate";
  elements.oracleCooldownStatus.dataset.state = "ready";
  elements.oracleCooldownStatus.textContent = "The Oracle is ready for one question.";
}

function setupEvents() {
  elements.profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isBirthdateValid(elements.inputBirthdate.value.trim())) {
      setGenerationStatus("Enter birthday in dd/mm/yyyy format.", "error");
      return;
    }

    if (!isBirthtimeValid(elements.inputBirthtime.value.trim())) {
      setGenerationStatus("Enter time in 00:00 am format.", "error");
      return;
    }

    if (!elements.inputCity.value.trim()) {
      setGenerationStatus("Choose a birthplace from the city list.", "error");
      return;
    }

    const previousSignature = `${state.name}|${state.birthdate}|${state.birthtime}|${state.city}`;

    state.name = elements.inputName.value.trim();
    state.birthdate = elements.inputBirthdate.value;
    state.birthtime = elements.inputBirthtime.value;
    state.city = elements.inputCity.value.trim();

    const nextSignature = `${state.name}|${state.birthdate}|${state.birthtime}|${state.city}`;
    if (previousSignature !== nextSignature) {
      state.generatedIssue = null;
      state.oracleHistory = [];
      state.journalEntries = [];
    }

    const profile = buildProfile(state);

    generationUnlocked = false;
    setGenerating(true);
    setGenerationStatus("Generating chart, forecast, life path, oracle opening, and sanctuary...", "idle");

    try {
      state.generatedIssue = await generateIssueWithAI(profile);
      state.oracleHistory = [];
      state.journalEntries = [];
      generationUnlocked = true;
      startOracleCooldown(ORACLE_COOLDOWN_MS);
      syncGenerationGate();
      saveState();
      renderApp();
      setGenerationStatus("Issue generated successfully.", "success");
    } catch (error) {
      setGenerationStatus(`Generation failed: ${error.message}`, "error");
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

  elements.printButton.addEventListener("click", () => {
    window.print();
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

  elements.journalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const body = elements.journalEntry.value.trim();
    if (!body) {
      return;
    }

    state.journalEntries.unshift({
      date: formatJournalDate(new Date()),
      body,
    });
    state.journalEntries = state.journalEntries.slice(0, 6);
    elements.journalEntry.value = "";
    saveState();
    renderSanctuary(buildProfile(state));
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
  renderSanctuary(profile);
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
  elements.chartLede.textContent = chart?.lede || "Generate the issue to fill this section with AI-authored natal analysis.";
  elements.chartAnalysis.innerHTML = (chart?.paragraphs || [
    "Your Sun, Moon, and Rising are calculated locally, but the long-form editorial reading is waiting for generation.",
    "Use The Genesis and hit Generate my issue to populate this spread with chart-specific narrative instead of placeholder copy.",
  ]).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function renderForecast(profile) {
  const range = forecastSets[currentForecastRange];
  const visibleIssue = getVisibleIssue();
  const active = visibleIssue?.forecast?.[currentForecastRange];

  elements.forecastLede.textContent = visibleIssue
    ? `Current transit material is generated from ${profile.name}'s ${profile.sun}-${profile.moon}-${profile.rising} axis and ${profile.city}'s submitted coordinates.`
    : "Daily, weekly, and yearly spreads will appear here after the issue is generated.";
  elements.forecastRangeLabel.textContent = range.label;
  elements.forecastHeadline.textContent = active?.headline || "Awaiting generated forecast";
  elements.forecastBody.textContent = active?.body || "Provide profile data and click Generate my issue to create this editorial forecast.";
  elements.forecastDirectives.innerHTML = (active?.directives || [
    "Generate the issue to receive tailored directives.",
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

  elements.lifeLede.textContent = life?.lede || "AI will populate profession, family, and romance assessments from your submitted profile.";
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
        <p>Run generation from The Genesis to replace this placeholder with editorial assessments.</p>
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
          answer: "Generate the issue first, then ask a question here for a custom oracle response.",
        },
      ];

  elements.oracleFeed.innerHTML = history
    .map(
      (item, index) => `
        <article class="oracle-card">
          <p class="oracle-card__meta">Query ${String(index + 1).padStart(2, "0")} · Editorial answer</p>
          <h3 class="oracle-card__question">"${escapeHtml(item.question)}"</h3>
          <p class="oracle-card__answer">${escapeHtml(item.answer)}</p>
        </article>
      `
    )
    .join("");
}

function renderSanctuary(profile) {
  const sanctuary = getVisibleIssue()?.sanctuary;
  const theme = sanctuary?.theme || "awaiting generated transit theme";
  elements.sanctuaryTheme.textContent = `Theme · ${theme}`;

  elements.timelineRibbon.innerHTML = ["Wake", "Observe", "Edit", "Speak", "Withdraw", "Archive"]
    .map((label, index) => `<span>${label} / ${index + 1}</span>`)
    .join("");

  const entries = state.journalEntries.length ? state.journalEntries : sanctuary?.starters || [];

  elements.journalEntries.innerHTML = entries
    .map(
      (entry) => `
        <article class="journal-card">
          <p class="journal-card__meta">${escapeHtml(entry.date || entry.dateLabel)} · ${profile.sun} / ${profile.moon}</p>
          <p class="journal-card__body">${escapeHtml(entry.body)}</p>
        </article>
      `
    )
    .join("") || `
      <article class="journal-card">
        <p class="journal-card__meta">Sanctuary pending</p>
        <p class="journal-card__body">Generate the issue to receive a transit theme and two opening journal reflections.</p>
      </article>
    `;
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
  return postJson("/api/generate-issue", { profile });
}

async function generateOracleAnswerWithAI(profile, question, generatedIssue) {
  const response = await postJson("/api/oracle", { profile, question, generatedIssue });
  return response.answer;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}`);
  }

  return payload.data;
}

function buildOracleAnswer(question, profile) {
  const prompt = question.toLowerCase();
  const answers = [];
  const lexicon = tonalLexicon[profile.element];
  const activeVirtue = pick(lexicon.virtues, profile.hash);
  const activeShadow = pick(lexicon.shadows, profile.hash + 1);
  const activeSetting = pick(lexicon.settings, profile.hash + 2);

  if (prompt.includes("career") || prompt.includes("work") || prompt.includes("job")) {
    answers.push(
      `Professionally, the chart wants architecture before expansion. Your ${profile.sun} Sun can attract the room, but your ${profile.modality.toLowerCase()} pattern only becomes profitable once your systems can hold the attention you earn. This season rewards ${activeVirtue} more than raw activity.`
    );
  }

  if (prompt.includes("love") || prompt.includes("relationship") || prompt.includes("partner")) {
    answers.push(
      `In love, your ${profile.moon} Moon is asking for emotional specificity, not vague chemistry. The next opening appears when affection becomes legible through behavior, schedule, and tone. Romance improves when you stop hiding tenderness behind ${activeShadow}.`
    );
  }

  if (prompt.includes("release") || prompt.includes("let go") || prompt.includes("leave")) {
    answers.push(
      `What needs release is whatever makes your life look more agreeable than true. The ${profile.rising} Rising prefers a cleaner front elevation, and that now means removing ornamental obligations. Leave behind anything built only for optics inside ${activeSetting}.`
    );
  }

  if (answers.length === 0) {
    answers.push(
      `The Oracle reads this as a question about timing. Your ${profile.element.toLowerCase()} chart is strongest when you stop splitting instinct from structure. Move toward what feels exact, not merely impressive, and let ${activeVirtue} set the tempo.`
    );
  }

  answers.push(
    `For this phase, trust ${profile.compatibility.toLowerCase()} energies: they help your ${profile.element.toLowerCase()} nature stay coherent while the forecast remains active.`
  );

  return answers.join(" ");
}

function buildWelcomeOracleAnswer(profile) {
  const report = buildReport(profile);
  return `The issue opens with ${report.sanctuary.theme}. ${report.chart.paragraphs[0]} ${report.forecast.daily.directives[0]}`;
}

function buildReport(profile) {
  const lexicon = tonalLexicon[profile.element];
  const nounA = pick(lexicon.nouns, profile.hash);
  const nounB = pick(lexicon.nouns, profile.hash + 4);
  const virtue = pick(lexicon.virtues, profile.hash + 1);
  const shadow = pick(lexicon.shadows, profile.hash + 2);
  const setting = pick(lexicon.settings, profile.hash + 3);
  const phase = getDayPhase(profile.birthHour);
  const yearlyPulse = getYearPulse(profile.birthMonth);
  const dateCode = `${String(profile.birthDay).padStart(2, "0")}.${String(profile.birthMonth).padStart(2, "0")}.${profile.birthYear}`;

  return {
    chart: {
      lede: `${profile.name}'s chart reads like ${virtue} drafted inside ${setting}: ${profile.element.toLowerCase()} intelligence, ${profile.modality.toLowerCase()} pacing, and a life that becomes clearer when it stops performing neutrality.`,
      paragraphs: [
        `${profile.name} enters the chart through ${profile.sun}, which means the self is organized around ${nounA}, taste, and a need for an authored point of view. The Moon in ${profile.moon} complicates that elegance with an inner climate that wants privacy, atmosphere, and emotional truth before consensus. Born at ${profile.birthtime} in ${profile.cityToken}, the issue begins in ${phase}, which gives the psyche a first instinct toward ${virtue} rather than spectacle.`,
        `The Rising sign in ${profile.rising} becomes the façade: the angle from which the world first reads the work. Others meet ${profile.voice}, but beneath that presentation sits a stricter private requirement. Your chart keeps asking whether your outer architecture truly reflects the interior material, or whether some part of life is still over-edited for approval.`,
        `${modalityNotes[profile.modality]} That gift becomes especially powerful when it is not hijacked by ${shadow}. In practice, the chart wants fewer ornamental obligations and more devotion to the structures that feel inevitable when you are alone with your own standards.`,
      ],
    },
    forecast: {
      daily: {
        headline: `${profile.sun} authorship under ${profile.moon.toLowerCase()} weather.`,
        body: `The daily spread is keyed to ${phase}. For the next cycle, your ${profile.rising} Rising is best used as an editor rather than a broadcaster: cut noise, preserve nerve, and let ${virtue} decide what enters the frame. The real risk today is ${shadow}, especially when the schedule grows louder than the signal.`,
        directives: [
          `Spend one protected hour working inside ${setting} without interruption or explanation.`,
          `Replace one performative commitment with a cleaner act of ${virtue}.`,
          `Notice where ${nounB} can be simplified before nightfall.`,
        ],
      },
      weekly: {
        headline: `A seven-day architecture for ${profile.element.toLowerCase()} consequence.`,
        body: `This week favors sequencing over force. Early movement belongs to ${nounA}; the midpoint belongs to conversation and correction; the latter half belongs to consolidation. Because your chart is ${profile.modality.toLowerCase()}, the quality of this week improves the moment you stop trying to do everything at one emotional volume.`,
        directives: [
          `Front-load the week with one visible act of authorship.`,
          `Midweek, repair a relationship through precision rather than reassurance.`,
          `End the week by auditing where ${shadow} has been disguised as responsibility.`,
        ],
      },
      yearly: {
        headline: `${yearlyPulse} belongs to your ${profile.modality.toLowerCase()} design.`,
        body: `The yearly spread treats ${dateCode} as a structural marker, not a nostalgic one. The long arc ahead trains ${profile.name} toward larger consequence through ${virtue}, cleaner boundaries, and a more selective relationship to attention. If there is a defining lesson, it is this: stop building for ambient approval and start building for longevity.`,
        directives: [
          `Choose one discipline that can outlast mood and trend.`,
          `Make room for a visible chapter shift near ${profile.peakYear}.`,
          `Treat every major decision as an editorial placement, not a random event.`,
        ],
      },
    },
    life: {
      lede: `${profile.name}'s life path is generated from ${profile.element.toLowerCase()} fluency, ${profile.modality.toLowerCase()} behavior, and a natal preference for ${virtue} over improvisational chaos.`,
      cards: [
        {
          title: "Profession",
          eyebrow: "Module 01",
          body: `${lifeThemes[profile.element].career} In your case, career becomes most magnetic when ${nounA} is treated as a discipline rather than a mood.`,
          list: [
            `Your strongest work appears when ${profile.sun} confidence is paired with ${profile.modality.toLowerCase()} discipline.`,
            `Use your ${profile.rising} presentation style as a professional differentiator, not just a personality trait.`,
            `Peak expansion window: ${profile.peakYear}.`,
          ],
        },
        {
          title: "Family",
          eyebrow: "Module 02",
          body: `${lifeThemes[profile.element].family} The private system stabilizes when ${profile.moon} needs are named before they become weather.`,
          list: [
            `Restore connection by speaking to emotional reality before practical repair.`,
            `Guard against ${shadow} showing up as silence or over-functioning.`,
            `Home becomes more beautiful when it mirrors ${setting} rather than social expectation.`,
          ],
        },
        {
          title: "Romance",
          eyebrow: "Module 03",
          body: `${lifeThemes[profile.element].love} For you, intimacy works best when admiration and emotional evidence arrive together.`,
          list: [
            `Your chart does not reward lukewarm attachment; it rewards coherence.`,
            `Attraction intensifies when tenderness survives schedule, stress, and scrutiny.`,
            `Current compatibility atmosphere: ${profile.compatibility}.`,
          ],
        },
      ],
    },
    sanctuary: {
      theme: sanctuaryThemes[profile.hash % sanctuaryThemes.length],
      starters: [
        {
          date: "Issue opening",
          body: `${profile.name} begins with a question about ${nounA}: what happens when ${virtue} is treated as the actual center of life rather than a private ideal?`,
        },
        {
          date: "Transit note",
          body: `The chart keeps returning to ${shadow}. I can feel how much cleaner the week becomes when I refuse to decorate what should simply be true.`,
        },
      ],
    },
  };
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

function formatJournalDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
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
