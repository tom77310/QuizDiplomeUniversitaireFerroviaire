/*
 * Améliorations V15
 * -----------------
 * Ce fichier ajoute des fonctionnalités complémentaires sans modifier
 * les questions ni la logique principale du quiz.
 *
 * Fonctionnalités :
 * - reprise d'une session interrompue ;
 * - série quotidienne de 5 questions ;
 * - questions automatiquement à revoir ;
 * - explications enrichies et lien vers le cours associé ;
 * - recherche dans les cours ;
 * - confort mobile ;
 * - export / import des données locales ;
 * - impression propre des cours et des fiches ;
 * - suppression individuelle des sessions ;
 * - mélange intelligent selon la récence des questions ;
 * - retour rapide en haut sur les pages longues ;
 * - bilan détaillé en fin de session.
 */

const COURSE_LINKS = {
  "EC21-1 — Sécurité générale": "securite",
  "EC21-2 — Cheminement": "cheminement",
  "EC21-2 — Risques électriques": "electrique",
  "CA2P — Sécurité": "bases-ca2p",
  "CA2P — Électricité": "bases-ca2p",
  "CA2P — Signalisation": "bases-ca2p",
  "CA2P — Cantonnement": "bases-ca2p",
  "CA2P — Frein": "bases-ca2p",
  KVB: "bases-ca2p",
  VACMA: "bases-ca2p",
  Arrêts: "bases-ca2p",
  "EC11 — Histoire": "histoire",
};

const RESUME_KEY = "quizCurrentSession";
const DAILY_KEY = "quizDailyChallenge";

const enhancement$ = (selector) => document.querySelector(selector);

function courseIdForQuestion(question) {
  const exact = COURSE_LINKS[question.theme];
  if (exact) return exact;
  if (question.theme.includes("Sécurité générale")) return "securite";
  if (question.theme.includes("Cheminement")) return "cheminement";
  if (question.theme.includes("électriques")) return "electrique";
  if (question.theme.includes("CA2P")) return "bases-ca2p";
  if (question.theme.includes("Histoire")) return "histoire";
  if (
    question.theme.includes("KVB") ||
    question.theme.includes("VACMA") ||
    question.theme.includes("Arrêts")
  )
    return "bases-ca2p";
  return null;
}

function courseUrlForQuestion(question) {
  const id = courseIdForQuestion(question);
  return id ? `cours.html?theme=${encodeURIComponent(id)}` : "cours.html";
}

/* -----------------------------
 * 1. Reprise de session
 * ----------------------------- */
function getResumeData() {
  try {
    return JSON.parse(localStorage.getItem(RESUME_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function saveResumeData() {
  if (
    !window.quizQuestions ||
    !quizQuestions.length ||
    enhancement$("#quiz")?.classList.contains("d-none")
  )
    return;

  const currentQuestion = quizQuestions[currentIndex];
  if (!currentQuestion) return;

  const selectedAnswers = [
    ...document.querySelectorAll(".answer-btn.selected"),
  ].map((button) => Number(button.dataset.index));

  const data = {
    questionIds: quizQuestions.map((question) => question.id),
    currentIndex,
    score,
    mode,
    targetedMode,
    shuffleAnswersEnabled,
    answered,
    selectedAnswers,
    errors: errors.map((error) => ({
      id: error.q.id,
      selected: error.selected,
    })),
    sessionStart,
    examSeconds,
    savedAt: Date.now(),
  };

  localStorage.setItem(RESUME_KEY, JSON.stringify(data));
  renderResumeCard();
}

function clearResumeData() {
  localStorage.removeItem(RESUME_KEY);
  renderResumeCard();
}

function resumeSession() {
  const data = getResumeData();
  if (!data || !Array.isArray(data.questionIds) || !data.questionIds.length)
    return;

  clearInterval(timer);

  quizQuestions = data.questionIds
    .map((id) =>
      QUESTIONS.find((question) => String(question.id) === String(id)),
    )
    .filter(Boolean);

  if (!quizQuestions.length) {
    clearResumeData();
    return;
  }

  currentIndex = Math.min(
    Number(data.currentIndex) || 0,
    quizQuestions.length - 1,
  );
  score = Number(data.score) || 0;
  mode = data.mode || "revision";
  targetedMode = Boolean(data.targetedMode);
  shuffleAnswersEnabled = data.shuffleAnswersEnabled !== false;
  answered = Boolean(data.answered);
  sessionStart = data.sessionStart || Date.now();
  examSeconds = Number(data.examSeconds) || 0;
  errors = (data.errors || [])
    .map((item) => {
      const question = QUESTIONS.find((q) => String(q.id) === String(item.id));
      return question ? { q: question, selected: item.selected || [] } : null;
    })
    .filter(Boolean);

  enhancement$("#setup")?.classList.add("d-none");
  enhancement$("#history")?.classList.add("d-none");
  enhancement$("#targeted")?.classList.add("d-none");
  enhancement$("#result")?.classList.add("d-none");
  enhancement$("#marked")?.classList.add("d-none");
  enhancement$("#quiz")?.classList.remove("d-none");

  showQuestion();

  // Restaure les réponses déjà cochées si la question n'était pas encore validée.
  if (!answered && Array.isArray(data.selectedAnswers)) {
    document.querySelectorAll(".answer-btn").forEach((button) => {
      if (data.selectedAnswers.includes(Number(button.dataset.index)))
        button.classList.add("selected");
    });
  }

  // Une session chronométrée reprend également son chronomètre.
  if ((mode === "exam" || mode === "simulation") && examSeconds > 0) {
    timer = setInterval(() => {
      examSeconds--;
      updateTimer();
      saveResumeData();
      if (examSeconds <= 0) {
        clearInterval(timer);
        clearResumeData();
        finish(true);
      }
    }, 1000);
  }

  saveResumeData();
}

function renderResumeCard() {
  const container = enhancement$("#resumeCard");
  if (!container) return;

  const data = getResumeData();
  if (!data) {
    container.classList.add("d-none");
    return;
  }

  const total = data.questionIds?.length || 0;
  const position = Math.min((Number(data.currentIndex) || 0) + 1, total);
  const modeLabel =
    data.mode === "exam"
      ? "Examen"
      : data.mode === "simulation"
        ? "Simulation examen"
        : "Révision";

  container.classList.remove("d-none");
  container.innerHTML = `
    <div class="card border-primary-subtle resume-card-inner">
      <div class="card-body">
        <div>
          <h2 class="h5 mb-1">▶️ Reprendre ma session</h2>
          <p class="text-secondary small mb-0">${modeLabel} — question ${position} / ${total}</p>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-3">
          <button id="resumeBtn" class="btn btn-primary">Reprendre</button>
          <button id="discardResumeBtn" class="btn btn-outline-secondary">Abandonner</button>
        </div>
      </div>
    </div>`;

  enhancement$("#resumeBtn").onclick = resumeSession;
  enhancement$("#discardResumeBtn").onclick = () => {
    if (confirm("Supprimer la session en cours ?")) clearResumeData();
  };
}

/* -----------------------------
 * 2. Série quotidienne
 * ----------------------------- */
function dailySeed() {
  const date = new Date();
  return Number(
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`,
  );
}

function dailyQuestionIds() {
  const questions = [...QUESTIONS];
  let seed = dailySeed();
  const selected = [];

  while (selected.length < Math.min(5, questions.length)) {
    seed = (seed * 9301 + 49297) % 233280;
    const index = seed % questions.length;
    const question = questions[index];
    if (!selected.includes(question.id)) selected.push(question.id);
  }

  return selected;
}

function startDailyChallenge() {
  const ids = dailyQuestionIds();
  quizQuestions = ids
    .map((id) => QUESTIONS.find((q) => q.id === id))
    .filter(Boolean);
  currentIndex = 0;
  score = 0;
  answered = false;
  errors = [];
  mode = "revision";
  targetedMode = false;
  shuffleAnswersEnabled = true;
  sessionStart = Date.now();
  sessionElapsed = 0;
  clearInterval(timer);

  enhancement$("#setup")?.classList.add("d-none");
  enhancement$("#history")?.classList.add("d-none");
  enhancement$("#targeted")?.classList.add("d-none");
  enhancement$("#result")?.classList.add("d-none");
  enhancement$("#marked")?.classList.add("d-none");
  enhancement$("#quiz")?.classList.remove("d-none");
  enhancement$("#timer").textContent = "";

  showQuestion();
  saveResumeData();
}

function renderDailyCard() {
  const container = enhancement$("#dailyChallengeCard");
  if (!container) return;

  const today = new Date().toLocaleDateString("fr-FR");
  const saved = JSON.parse(localStorage.getItem(DAILY_KEY) || "{}");
  const done = saved.date === today;

  container.innerHTML = `
    <div class="card border-warning-subtle daily-card-inner">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
          <div>
            <h2 class="h5 mb-1">🔥 Série du jour</h2>
            <p class="text-secondary small mb-0">5 questions différentes chaque jour pour une révision rapide.</p>
          </div>
          ${done ? '<span class="badge text-bg-success">Terminée aujourd’hui</span>' : ""}
        </div>
        <button id="dailyChallengeBtn" class="btn btn-outline-warning mt-3">${done ? "Refaire la série" : "Commencer la série"}</button>
      </div>
    </div>`;

  enhancement$("#dailyChallengeBtn").onclick = startDailyChallenge;
}

/* -----------------------------
 * 3. Questions automatiquement à revoir
 * ----------------------------- */
function getAutomaticReviewQuestions() {
  const stats = getQuestionStats();
  return QUESTIONS.filter((question) =>
    isNeedsReview(stats[String(question.id)]),
  );
}

function startAutomaticReview() {
  const pool = shuffle(getAutomaticReviewQuestions());
  if (!pool.length) {
    alert(
      "Aucune question ne nécessite actuellement une révision automatique.",
    );
    return;
  }

  quizQuestions = pool;
  currentIndex = 0;
  score = 0;
  answered = false;
  errors = [];
  mode = "revision";
  targetedMode = true;
  shuffleAnswersEnabled = true;
  sessionStart = Date.now();
  sessionElapsed = 0;
  clearInterval(timer);

  enhancement$("#setup")?.classList.add("d-none");
  enhancement$("#targeted")?.classList.add("d-none");
  enhancement$("#history")?.classList.add("d-none");
  enhancement$("#result")?.classList.add("d-none");
  enhancement$("#marked")?.classList.add("d-none");
  enhancement$("#quiz")?.classList.remove("d-none");
  showQuestion();
  saveResumeData();
}

function renderAutomaticReviewCard() {
  const container = enhancement$("#automaticReviewCard");
  if (!container) return;
  const count = getAutomaticReviewQuestions().length;
  container.innerHTML = `
    <div class="card border-danger-subtle automatic-review-inner">
      <div class="card-body">
        <h2 class="h5 mb-1">🔁 Questions à revoir automatiquement</h2>
        <p class="text-secondary small mb-0">${count ? `${count} question${count > 1 ? "s" : ""} nécessitent actuellement une révision.` : "Aucune question à revoir pour le moment."}</p>
        <button id="automaticReviewBtn" class="btn btn-outline-danger mt-3" ${count ? "" : "disabled"}>Réviser mes points faibles</button>
      </div>
    </div>`;
  enhancement$("#automaticReviewBtn").onclick = startAutomaticReview;
}

/* -----------------------------
 * 4. Explications enrichies
 * ----------------------------- */
function enrichErrorList() {
  const list = enhancement$("#errorList");
  if (!list) return;

  [...list.children].forEach((item, index) => {
    const error = errors[index];
    if (!error) return;
    const question = error.q;
    const correct = question.correct
      .map((answerIndex) => question.answers[answerIndex])
      .join(" / ");
    const detail = question.detail || getExplanationDetail(question);
    const link = courseUrlForQuestion(question);

    item.innerHTML = `
      <strong>${index + 1}. ${escapeHtml(question.question)}</strong>
      <div class="mt-2"><strong>Réponse attendue :</strong> ${escapeHtml(correct)}</div>
      <div class="text-secondary mt-1"><strong>À retenir :</strong> ${escapeHtml(question.explanation)}</div>
      <div class="text-secondary mt-1"><strong>Pourquoi cette réponse ?</strong> ${escapeHtml(detail)}</div>
      ${question.trap ? `<div class="text-warning-emphasis mt-1"><strong>⚠️ Piège :</strong> ${escapeHtml(question.trapNote || "Attention à la formulation.")}</div>` : ""}
      <a class="btn btn-sm btn-outline-primary mt-2" href="${link}">📚 Revoir le cours associé</a>`;
  });
}

function enrichCurrentFeedback() {
  const feedback = enhancement$("#feedback");
  const question = quizQuestions[currentIndex];
  if (!feedback || !question || feedback.classList.contains("d-none")) return;

  const existing = feedback.querySelector(".enhanced-feedback");
  if (existing) return;

  const detail = question.detail || getExplanationDetail(question);
  const block = document.createElement("div");
  block.className = "enhanced-feedback mt-3 pt-3 border-top";
  block.innerHTML = `
    <strong>📌 À retenir</strong>
    <p class="mb-2 mt-1">${escapeHtml(detail)}</p>
    <a class="btn btn-sm btn-outline-primary" href="${courseUrlForQuestion(question)}">📚 Revoir cette notion dans le cours</a>`;
  feedback.appendChild(block);
}

/* -----------------------------
 * 5. Recherche dans les cours
 * ----------------------------- */
function initCourseSearch() {
  const input = enhancement$("#courseSearch");
  const cards = enhancement$("#courseHome");
  if (!input || !cards || typeof COURSE === "undefined") return;

  // Recherche dans le titre, le sous-titre ET le contenu complet du cours.
  // Cela permet par exemple de trouver "KVB" même si le terme n'apparaît
  // pas dans le titre de la carte du cours.
  function filterCourseCards(value) {
    const query = String(value || "")
      .trim()
      .toLocaleLowerCase("fr-FR");
    const courseCards = cards.querySelectorAll("[data-course-card]");
    let visibleCount = 0;

    courseCards.forEach((card) => {
      const courseId = card
        .querySelector('button[onclick*="openCourse"]')
        ?.getAttribute("onclick")
        ?.match(/openCourse\('([^']+)'\)/)?.[1];
      const course = COURSE.find((item) => item.id === courseId);
      const searchableText = course
        ? JSON.stringify(course).toLocaleLowerCase("fr-FR")
        : card.textContent.toLocaleLowerCase("fr-FR");
      const visible = !query || searchableText.includes(query);

      const column = card.closest(".col-12, .col-md-6") || card;
      column.classList.toggle("d-none", !visible);
      if (visible) visibleCount++;
    });

    let emptyState = cards.querySelector("[data-course-search-empty]");
    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.dataset.courseSearchEmpty = "true";
      emptyState.className = "alert alert-secondary mt-3";
      cards.appendChild(emptyState);
    }

    emptyState.textContent = `Aucun cours ne correspond à « ${value} ».`;
    emptyState.classList.toggle("d-none", !query || visibleCount > 0);
  }

  // Exposé pour que le bouton « Tous les cours » puisse réinitialiser
  // proprement la recherche lorsqu'on revient de la lecture d'un cours.
  window.filterCourseCards = filterCourseCards;

  input.addEventListener("input", () => filterCourseCards(input.value));
  filterCourseCards(input.value);
}

/* -----------------------------
 * 6. Export / import
 * ----------------------------- */
function exportQuizData() {
  const data = {};
  [
    "quizSessions",
    "quizMarkedQuestions",
    "quizStatsResetAt",
    "quizLastErrors",
    RESUME_KEY,
    DAILY_KEY,
    "quizDarkMode",
  ].forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  });

  const blob = new Blob(
    [
      JSON.stringify(
        { version: 15, exportedAt: new Date().toISOString(), data },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quiz-ferroviaire-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importQuizData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.data || typeof parsed.data !== "object")
        throw new Error("Format invalide");
      Object.entries(parsed.data).forEach(([key, value]) => {
        if (typeof value === "string") localStorage.setItem(key, value);
      });
      alert("Sauvegarde restaurée. La page va être actualisée.");
      window.location.reload();
    } catch (error) {
      alert("Impossible de restaurer cette sauvegarde.");
    }
  };
  reader.readAsText(file);
}

function initDataTools() {
  const exportButton = enhancement$("#exportDataBtn");
  const importButton = enhancement$("#importDataBtn");
  const input = enhancement$("#importDataInput");
  if (exportButton) exportButton.onclick = exportQuizData;
  if (importButton && input) importButton.onclick = () => input.click();
  if (input)
    input.onchange = () => input.files[0] && importQuizData(input.files[0]);
}

/* -----------------------------
 * 7. Bilan de fin de session
 * ----------------------------- */
function renderDetailedResult() {
  const result = enhancement$("#result");
  if (!result || !quizQuestions.length) return;

  let card = enhancement$("#detailedResultCard");
  if (!card) {
    card = document.createElement("div");
    card.id = "detailedResultCard";
    card.className = "card shadow-sm mt-3";
    const errorsCard = enhancement$("#errorsCard");
    result.insertBefore(card, errorsCard || null);
  }

  const themeStats = {};
  quizQuestions.forEach((question) => {
    if (!themeStats[question.theme])
      themeStats[question.theme] = { total: 0, correct: 0 };
    themeStats[question.theme].total++;
    const wasWrong = errors.some(
      (error) => String(error.q.id) === String(question.id),
    );
    if (!wasWrong) themeStats[question.theme].correct++;
  });

  const themes = Object.entries(themeStats).sort(
    (a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total,
  );
  const strengths = themes
    .filter(([, value]) => value.correct / value.total >= 0.8)
    .slice(0, 2);
  const weaknesses = themes
    .filter(([, value]) => value.correct / value.total < 0.8)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .slice(0, 2);

  const themeList = (list) =>
    list.length
      ? list
          .map(
            ([theme, value]) =>
              `<li>${escapeHtml(theme)} — <strong>${Math.round((value.correct / value.total) * 100)} %</strong></li>`,
          )
          .join("")
      : "<li>Aucun thème suffisamment représenté.</li>";

  card.innerHTML = `
    <div class="card-body">
      <h3 class="h5">📊 Bilan de la session</h3>
      <div class="row g-3 mt-1">
        <div class="col-md-6"><div class="result-analysis-block"><strong>🟢 Points forts</strong><ul class="mb-0 mt-2">${themeList(strengths)}</ul></div></div>
        <div class="col-md-6"><div class="result-analysis-block"><strong>🟠 À retravailler</strong><ul class="mb-0 mt-2">${themeList(weaknesses)}</ul></div></div>
      </div>
    </div>`;

  enrichErrorList();
}

function markDailyChallengeComplete() {
  const today = new Date().toLocaleDateString("fr-FR");
  const ids = dailyQuestionIds();
  if (quizQuestions.map((q) => q.id).join(",") === ids.join(",")) {
    localStorage.setItem(
      DAILY_KEY,
      JSON.stringify({ date: today, score, total: quizQuestions.length }),
    );
  }
}

/* -----------------------------
 * 8. Impression des fiches
 * ----------------------------- */
function initPrintButton() {
  const sheetButton = enhancement$("#printSheetsBtn");
  if (sheetButton) sheetButton.onclick = () => window.print();

  // Le bouton du cours est créé dynamiquement par openCourse().
  // La gestion directe ici pouvait donc être initialisée avant sa création.
  // Le bouton utilise maintenant onclick="window.print()" dans cours.html.
}

/* -----------------------------
 * 9. Retour en haut
 * ----------------------------- */
function initBackToTop() {
  const button = enhancement$("#backToTopBtn");
  if (!button) return;
  const update = () =>
    button.classList.toggle("is-visible", window.scrollY > 500);
  window.addEventListener("scroll", update, { passive: true });
  button.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  update();
}

/* -----------------------------
 * Initialisation et petits ponts
 * ----------------------------- */
function installEnhancements() {
  // Les outils généraux sont disponibles sur les pages concernées.
  initCourseSearch();
  initPrintButton();
  initBackToTop();

  // Les fonctions de révision nécessitent la base QUESTIONS et le script principal.
  if (
    typeof QUESTIONS === "undefined" ||
    typeof getQuestionStats !== "function"
  )
    return;

  renderResumeCard();
  renderDailyCard();
  renderAutomaticReviewCard();
  initDataTools();

  // Sauvegarde légère et régulière de la session en cours.
  setInterval(() => {
    if (
      enhancement$("#quiz") &&
      !enhancement$("#quiz").classList.contains("d-none")
    )
      saveResumeData();
  }, 1500);

  // Enrichit les corrections après validation sans toucher aux questions.
  const originalValidate = window.validate;
  if (typeof originalValidate === "function") {
    window.validate = function enhancedValidate() {
      originalValidate();
      setTimeout(() => {
        enrichCurrentFeedback();
        saveResumeData();
      }, 0);
    };
    enhancement$("#validateBtn")?.replaceWith(
      enhancement$("#validateBtn").cloneNode(true),
    );
    enhancement$("#validateBtn").onclick = window.validate;
  }

  const originalQuitQuiz = window.quitQuiz;
  if (typeof originalQuitQuiz === "function") {
    window.quitQuiz = function enhancedQuitQuiz() {
      originalQuitQuiz();
      if (enhancement$("#quiz")?.classList.contains("d-none"))
        clearResumeData();
    };
  }

  const originalFinish = window.finish;
  if (typeof originalFinish === "function") {
    window.finish = function enhancedFinish(timeUp) {
      clearResumeData();
      originalFinish(timeUp);
      markDailyChallengeComplete();
      renderDetailedResult();
      renderDailyCard();
      renderAutomaticReviewCard();
    };
  }

  // Mise à jour des cartes quand l'utilisateur termine un quiz via le bouton final.
  enhancement$("#finishBtn")?.addEventListener("click", () => {
    setTimeout(() => {
      markDailyChallengeComplete();
      renderDetailedResult();
      renderAutomaticReviewCard();
    }, 20);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installEnhancements);
} else {
  installEnhancements();
}
