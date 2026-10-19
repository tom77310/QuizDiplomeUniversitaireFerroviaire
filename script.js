// ============================================================
// ÉTAT GLOBAL DU QUIZ
// ============================================================

let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let shuffleAnswersEnabled = true;
let mode = "revision";
let errors = [];
let examSeconds = 0;
let timer = null;
let sessionStart = null;
let sessionElapsed = 0;
let targetedMode = false;

// ============================================================
// CLÉS DE STOCKAGE LOCAL
// ============================================================

const MARKED_KEY = "quizMarkedQuestions";
const STATS_RESET_KEY = "quizStatsResetAt";

// ============================================================
// LIBELLÉS
// ============================================================

const difficultyLabels = {
  easy: "Facile",
  medium: "Intermédiaire",
  hard: "Difficile",
};

// Raccourci pour sélectionner un élément dans la page.
const $ = (selector) => document.querySelector(selector);

// ============================================================
// OUTILS GÉNÉRAUX
// ============================================================

/**
 * Mélange les éléments d'un tableau.
 *
 * Une copie du tableau est créée afin de ne pas modifier
 * le tableau original.
 */
function shuffle(array) {
  array = [...array];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// ============================================================
// GESTION DES THÈMES ET DU NOMBRE DE QUESTIONS
// ============================================================

/**
 * Remplit la liste des thèmes disponibles.
 */
function populateThemes() {
  const select = $("#theme");

  select.innerHTML = '<option value="all">Tous les thèmes</option>';

  [...new Set(QUESTIONS.map((question) => question.theme))].forEach(
    (theme) => {
      const option = document.createElement("option");

      option.value = theme;
      option.textContent = theme;

      select.appendChild(option);
    },
  );

  updateCountOptions();
  populateTargetThemes();
}

/**
 * Met à jour les choix du nombre de questions
 * en fonction du thème sélectionné.
 */
function updateCountOptions() {
  const selectTheme = $("#theme");
  const selectCount = $("#count");

  const theme = selectTheme.value;

  const available =
    theme === "all"
      ? QUESTIONS.length
      : QUESTIONS.filter((question) => question.theme === theme).length;

  const previous = selectCount.value;

  [...selectCount.options].forEach((option) => {
    if (option.value === "all") {
      option.textContent = `Toutes les questions (${available})`;
      option.disabled = false;
      return;
    }

    const number = Number(option.value);

    option.disabled = number > available;
    option.textContent =
      `${number} question${number > 1 ? "s" : ""}` +
      `${number > available ? " — indisponible pour ce thème" : ""}`;
  });

  if (previous !== "all" && Number(previous) > available) {
    selectCount.value = "all";
  }
}

// ============================================================
// GESTION DE L'AFFICHAGE DU MODE
// ============================================================

/**
 * Met à jour l'interface en fonction du mode choisi :
 * - Révision
 * - Examen
 * - Simulation
 */
function updateModeUI() {
  const modeSelect = $("#mode");

  mode = modeSelect.value;

  const simulation = mode === "simulation";

  $("#modeDescription").textContent =
    mode === "revision"
      ? "Correction immédiate avec explication après chaque question."
      : simulation
        ? "Simulation proche d’un examen : questions mélangées, aucune correction ni indication de matière pendant le test, chronomètre et bilan uniquement à la fin."
        : "Pas de correction pendant le test : bilan complet uniquement à la fin.";

  // Le chronomètre n'est visible qu'en examen et en simulation.
  $("#timerWrap").classList.toggle("d-none", mode === "revision");

  // Le choix du thème est masqué en simulation.
  $("#themeWrap").classList.toggle("d-none", simulation);

  if (simulation) {
    $("#theme").value = "all";
    updateCountOptions();
  }
}

// ============================================================
// DÉMARRAGE D'UN QUIZ
// ============================================================

/**
 * Démarre un nouveau quiz classique.
 */
function startQuiz() {
  clearInterval(timer);

  targetedMode = false;

  mode = $("#mode").value;
  shuffleAnswersEnabled = $("#shuffleAnswers").checked;

  let theme = $("#theme").value;
  const count = $("#count").value;

  // Construction de la liste des questions disponibles.
  let pool =
    mode === "simulation"
      ? [...QUESTIONS]
      : theme === "all"
        ? [...QUESTIONS]
        : QUESTIONS.filter((question) => question.theme === theme);

  // Mélange des questions.
  pool = shuffle(pool);

  // Sélection du nombre de questions demandé.
  quizQuestions =
    count === "all" ? pool : pool.slice(0, Number(count));

  if (!quizQuestions.length) {
    alert("Aucune question disponible pour cette sélection.");
    return;
  }

  // Réinitialisation de la session.
  currentIndex = 0;
  score = 0;
  answered = false;
  errors = [];

  sessionStart = Date.now();
  sessionElapsed = 0;

  // Affichage du quiz et masquage des autres écrans.
  $("#setup").classList.add("d-none");
  $("#history").classList.add("d-none");
  $("#targeted").classList.add("d-none");
  $("#result").classList.add("d-none");
  $("#marked")?.classList.add("d-none");
  $("#quiz").classList.remove("d-none");

  // Durée du chronomètre pour les modes concernés.
  examSeconds =
    mode === "exam" || mode === "simulation"
      ? Number($("#duration").value) * 60
      : 0;

  updateTimer();

  // Lancement du chronomètre.
  if (mode === "exam" || mode === "simulation") {
    timer = setInterval(() => {
      examSeconds--;

      updateTimer();

      if (examSeconds <= 0) {
        clearInterval(timer);
        finish(true);
      }
    }, 1000);
  }

  showQuestion();
}

// ============================================================
// ENTRAÎNEMENT CIBLÉ
// ============================================================

/**
 * Démarre un entraînement ciblé à partir :
 * - des questions déjà ratées ;
 * - ou des questions qui nécessitent une révision.
 */
function startTargetedQuiz() {
  const theme = $("#targetTheme").value;
  const scope = $("#targetScope").value;
  const count = $("#targetCount").value;

  const stats = getQuestionStats();

  let pool = QUESTIONS
    .filter(
      (question) =>
        theme === "all" || question.theme === theme,
    )
    .filter((question) => {
      const stat = stats[String(question.id)];

      return scope === "errors"
        ? !!(stat && stat.wrong > 0)
        : isNeedsReview(stat);
    });

  if (!pool.length) {
    alert(
      scope === "errors"
        ? "Aucune question déjà ratée ne correspond à cette sélection."
        : "Aucune question à revoir ne correspond à cette sélection.",
    );

    return;
  }

  pool = shuffle(pool);

  quizQuestions =
    count === "all" ? pool : pool.slice(0, Number(count));

  currentIndex = 0;
  score = 0;
  answered = false;
  errors = [];

  mode = "revision";
  targetedMode = true;

  sessionStart = Date.now();
  sessionElapsed = 0;

  clearInterval(timer);

  $("#targeted").classList.add("d-none");
  $("#history").classList.add("d-none");
  $("#result").classList.add("d-none");
  $("#setup").classList.add("d-none");
  $("#quiz").classList.remove("d-none");

  $("#timer").textContent = "";

  showQuestion();
}

// ============================================================
// CHRONOMÈTRE
// ============================================================

/**
 * Met à jour l'affichage du chronomètre.
 */
function updateTimer() {
  const element = $("#timer");

  if (mode !== "exam" && mode !== "simulation") {
    element.textContent = "";
    return;
  }

  const minutes = Math.floor(
    Math.max(0, examSeconds) / 60,
  );

  const seconds = Math.max(0, examSeconds) % 60;

  element.textContent =
    `⏱ ${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  element.className =
    "badge " +
    (examSeconds <= 30
      ? "text-bg-danger"
      : "text-bg-warning");
}

// ============================================================
// AFFICHAGE D'UNE QUESTION
// ============================================================

/**
 * Affiche la question actuellement sélectionnée.
 */
function showQuestion() {
  answered = false;

  const question = quizQuestions[currentIndex];
  const simulation = mode === "simulation";
  const difficulty = question.difficulty || "medium";

  // Progression.
  $("#progressText").textContent =
    `Question ${currentIndex + 1} / ${quizQuestions.length}`;

  $("#scoreLive").textContent = `Score : ${score}`;

  $("#scoreLive").classList.toggle(
    "d-none",
    mode === "exam" || simulation,
  );

  $("#progressBar").style.width =
    `${(currentIndex / quizQuestions.length) * 100}%`;

  // Matière.
  $("#themeBadge").textContent = question.theme;

  $("#themeBadge").classList.toggle(
    "d-none",
    simulation,
  );

  // Difficulté.
  $("#difficultyBadge").textContent =
    difficultyLabels[difficulty] || "Intermédiaire";

  $("#difficultyBadge").className =
    `badge ${
      difficulty === "easy"
        ? "text-bg-success"
        : difficulty === "hard"
          ? "text-bg-danger"
          : "text-bg-secondary"
    }`;

  // Badge du piège.
  $("#trapBadge").classList.add("d-none");

  // Question.
  $("#question").textContent = question.question;

  // Consigne.
  $("#instruction").textContent =
    question.type === "multiple"
      ? "Plusieurs réponses peuvent être correctes."
      : question.type === "truefalse"
        ? "Indique si l’affirmation est vraie ou fausse."
        : "Une seule réponse est correcte.";

  // Question marquée.
  $("#markQuestionBtn").textContent = isMarked(question.id)
    ? "★ Marquée"
    : "☆ À revoir";

  $("#markQuestionBtn").className =
    `btn btn-sm ${
      isMarked(question.id)
        ? "btn-warning"
        : "btn-outline-secondary"
    } ms-auto`;

  // Aide clavier indisponible en examen et en simulation.
  $("#keyboardHelp").classList.toggle(
    "d-none",
    simulation || mode === "exam",
  );

  // Préparation des réponses.
  let answers = question.answers.map((text, index) => ({
    text,
    index,
  }));

  if (shuffleAnswersEnabled) {
    answers = shuffle(answers);
  }

  const answersBox = $("#answers");

  answersBox.innerHTML = "";

  answers.forEach((answer, number) => {
    const button = document.createElement("button");

    button.className =
      "btn btn-outline-secondary answer-btn";

    button.textContent =
      `${number + 1}. ${answer.text}`;

    button.dataset.index = answer.index;
    button.dataset.shortcut = number + 1;

    button.onclick = () => toggle(button, question);

    answersBox.appendChild(button);
  });

  // Indice.
  $("#hint").className =
    "alert alert-warning mt-2 d-none";

  $("#hint").textContent = getHint(question);

  $("#hintBtn").classList.toggle(
    "d-none",
    mode !== "revision",
  );

  // Feedback.
  $("#feedback").className =
    "alert mt-4 d-none";

  // En mode examen, le bouton « Valider » est masqué
  // sur la dernière question : seul « Terminer » est affiché.
  $("#validateBtn").classList.toggle(
    "d-none",
    mode === "exam" &&
      currentIndex === quizQuestions.length - 1,
  );

  $("#nextBtn").classList.add("d-none");
  $("#finishBtn").classList.add("d-none");

  // Affichage du bouton « Terminer » sur la dernière question.
  if (
    (mode === "exam" || mode === "simulation") &&
    currentIndex === quizQuestions.length - 1
  ) {
    $("#finishBtn").classList.remove("d-none");
  }
}

// ============================================================
// SÉLECTION DES RÉPONSES
// ============================================================

/**
 * Sélectionne ou désélectionne une réponse.
 */
function toggle(button, question) {
  if (answered) return;

  // Une seule réponse possible.
  if (question.type !== "multiple") {
    document
      .querySelectorAll(".answer-btn")
      .forEach((element) =>
        element.classList.remove("selected"),
      );
  }

  button.classList.toggle("selected");
}

/**
 * Retourne les indices des réponses sélectionnées.
 */
function selected() {
  return [
    ...document.querySelectorAll(
      ".answer-btn.selected",
    ),
  ].map((button) => Number(button.dataset.index));
}

/**
 * Compare deux tableaux sans tenir compte de leur ordre.
 */
function same(a, b) {
  a = [...a].sort();
  b = [...b].sort();

  return (
    a.length === b.length &&
    a.every((value, index) => value === b[index])
  );
}

// ============================================================
// VALIDATION D'UNE QUESTION
// ============================================================

/**
 * Vérifie la réponse donnée par l'utilisateur.
 */
function validate() {
  if (answered) return;

  const question = quizQuestions[currentIndex];
  const selectedAnswers = selected();

  if (!selectedAnswers.length) {
    alert("Sélectionne au moins une réponse.");
    return;
  }

  answered = true;

  const correct = same(
    selectedAnswers,
    question.correct,
  );

  if (correct) {
    score++;
  } else {
    errors.push({
      q: question,
      selected: selectedAnswers,
    });
  }

  // Correction visuelle.
  document
    .querySelectorAll(".answer-btn")
    .forEach((button) => {
      const index = Number(button.dataset.index);

      if (mode === "revision") {
        if (question.correct.includes(index)) {
          button.classList.add("correct");
        } else if (selectedAnswers.includes(index)) {
          button.classList.add("wrong");
        }
      }

      button.disabled = true;
    });

  $("#hintBtn").classList.add("d-none");

  // En mode révision, afficher immédiatement l'explication.
  if (mode === "revision") {
    const feedback = $("#feedback");
    const extra =
      question.detail ||
      getExplanationDetail(question);

    feedback.className =
      `alert mt-4 ${
        correct
          ? "alert-success"
          : "alert-danger"
      }`;

    feedback.innerHTML =
      `<strong>${
        correct
          ? "Bonne réponse !"
          : "À revoir."
      }</strong><br>` +
      `<span>${question.explanation}</span>` +
      `${
        extra
          ? `<div class="mt-2 pt-2 border-top">` +
            `<strong>Pourquoi ?</strong> ${extra}` +
            `</div>`
          : ""
      }` +
      `${
        question.trap
          ? `<div class="mt-2 text-warning-emphasis">` +
            `<strong>⚠️ Attention au piège :</strong> ` +
            `${
              question.trapNote ||
              "La formulation est volontairement proche d’une autre notion."
            }` +
            `</div>`
          : ""
      }`;

    if (question.trap) {
      $("#trapBadge").classList.remove("d-none");
    }

    $("#validateBtn").classList.add("d-none");
    $("#nextBtn").classList.remove("d-none");
  } else {
    // En examen et en simulation, aucune correction immédiate.
    next();
  }
}

/**
 * Passe à la question suivante ou termine le quiz.
 */
function next() {
  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    finish(false);
  }
}

// ============================================================
// QUESTIONS MARQUÉES
// ============================================================

/**
 * Récupère les identifiants des questions marquées.
 */
function getMarked() {
  try {
    return JSON.parse(
      localStorage.getItem(MARKED_KEY) || "[]",
    ).map(String);
  } catch (error) {
    return [];
  }
}

/**
 * Vérifie si une question est marquée.
 */
function isMarked(id) {
  return getMarked().includes(String(id));
}

/**
 * Ajoute ou retire une question des questions marquées.
 */
function toggleMarked(id) {
  let marked = getMarked();

  const key = String(id);

  if (marked.includes(key)) {
    marked = marked.filter(
      (item) => item !== key,
    );
  } else {
    marked.unshift(key);
  }

  localStorage.setItem(
    MARKED_KEY,
    JSON.stringify(marked),
  );

  if ($("#markQuestionBtn")) {
    const isQuestionMarked =
      marked.includes(key);

    $("#markQuestionBtn").textContent =
      isQuestionMarked
        ? "★ Marquée"
        : "☆ À revoir";

    $("#markQuestionBtn").className =
      `btn btn-sm ${
        isQuestionMarked
          ? "btn-warning"
          : "btn-outline-secondary"
      } ms-auto`;
  }

  renderMarkedList();
}

/**
 * Affiche la liste des questions marquées.
 */
function renderMarkedList() {
  const box = $("#markedList");

  if (!box) return;

  const ids = getMarked();

  const questions = ids
    .map((id) =>
      QUESTIONS.find(
        (question) =>
          String(question.id) === id,
      ),
    )
    .filter(Boolean);

  box.innerHTML = questions.length
    ? questions
        .map(
          (question) =>
            `<div class="list-group-item d-flex justify-content-between align-items-start gap-3">` +
            `<div>` +
            `<div class="fw-semibold">${escapeHtml(
              question.question,
            )}</div>` +
            `<div class="small text-secondary mt-1">` +
            `${escapeHtml(question.theme)} · ` +
            `${
              difficultyLabels[
                question.difficulty
              ] || "Intermédiaire"
            }` +
            `</div>` +
            `</div>` +
            `<button class="btn btn-sm btn-outline-danger unmark-btn" data-id="${question.id}">Retirer</button>` +
            `</div>`,
        )
        .join("")
    : `<div class="text-secondary py-4 text-center">` +
      `Aucune question marquée pour le moment.` +
      `</div>`;

  box
    .querySelectorAll(".unmark-btn")
    .forEach(
      (button) =>
        (button.onclick = () =>
          toggleMarked(button.dataset.id)),
    );

  $("#startMarkedBtn").disabled =
    !questions.length;
}

/**
 * Affiche l'écran des questions marquées.
 */
function showMarked() {
  clearInterval(timer);

  targetedMode = false;

  $("#setup").classList.add("d-none");
  $("#quiz").classList.add("d-none");
  $("#result").classList.add("d-none");
  $("#targeted").classList.add("d-none");
  $("#history").classList.add("d-none");
  $("#marked").classList.remove("d-none");

  renderMarkedList();
}

/**
 * Démarre un quiz uniquement avec les questions marquées.
 */
function startMarkedQuiz() {
  const questions = getMarked()
    .map((id) =>
      QUESTIONS.find(
        (question) =>
          String(question.id) === id,
      ),
    )
    .filter(Boolean);

  if (!questions.length) {
    alert("Aucune question marquée.");
    return;
  }

  quizQuestions = shuffle(questions);

  currentIndex = 0;
  score = 0;
  answered = false;
  errors = [];

  mode = "revision";
  targetedMode = true;

  sessionStart = Date.now();
  sessionElapsed = 0;

  $("#marked").classList.add("d-none");
  $("#quiz").classList.remove("d-none");

  showQuestion();
}

// ============================================================
// STATISTIQUES
// ============================================================

/**
 * Récupère la date de dernière réinitialisation des statistiques.
 */
function getStatsResetAt() {
  return Number(
    localStorage.getItem(STATS_RESET_KEY) || 0,
  );
}

/**
 * Réinitialise les statistiques sans supprimer
 * l'historique des sessions.
 */
function resetStats() {
  if (
    !confirm(
      "Réinitialiser les statistiques ? L’historique des sessions restera conservé.",
    )
  ) {
    return;
  }

  localStorage.setItem(
    STATS_RESET_KEY,
    String(Date.now()),
  );

  renderBadges();
  showHistory();
  updateTargetInfo();
}

/**
 * Enregistre la session actuelle.
 */
function saveSession(timeUp = false) {
  const now = Date.now();

  sessionElapsed = Math.max(
    0,
    Math.round(
      (now - (sessionStart || now)) / 1000,
    ),
  );

  const sessions = JSON.parse(
    localStorage.getItem("quizSessions") || "[]",
  );

  const theme = targetedMode
    ? "Entraînement ciblé"
    : mode === "simulation"
      ? "Tous les thèmes (simulation)"
      : $("#theme").value === "all"
        ? "Tous les thèmes"
        : $("#theme").value;

  const percent = Math.round(
    (score / quizQuestions.length) * 100,
  );

  const outcomes = [];

  quizQuestions.forEach((question, index) => {
    let outcome = "unanswered";

    if (index < currentIndex) {
      outcome = errors.some(
        (error) =>
          String(error.q.id) ===
          String(question.id),
      )
        ? "wrong"
        : "correct";
    } else if (
      index === currentIndex &&
      answered
    ) {
      outcome = errors.some(
        (error) =>
          String(error.q.id) ===
          String(question.id),
      )
        ? "wrong"
        : "correct";
    }

    outcomes.push({
      questionId: question.id,
      outcome,
    });
  });

  sessions.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    mode,
    theme,
    count: quizQuestions.length,
    score,
    percent,
    errors: errors.length,
    duration: sessionElapsed,
    timeUp,
    outcomes,
  });

  // Conservation des 100 dernières sessions maximum.
  localStorage.setItem(
    "quizSessions",
    JSON.stringify(sessions.slice(0, 100)),
  );

  renderBadges();
}

// ============================================================
// FIN DU QUIZ ET RÉSULTATS
// ============================================================

/**
 * Termine le quiz et affiche les résultats.
 */
function finish(timeUp = false) {
  clearInterval(timer);

  saveSession(timeUp);

  $("#quiz").classList.add("d-none");
  $("#result").classList.remove("d-none");

  const percent = Math.round(
    (score / quizQuestions.length) * 100,
  );

  $("#resultScore").textContent =
    `${score} / ${quizQuestions.length} — ${percent} %`;

  $("#resultMessage").textContent =
    (timeUp ? "Temps écoulé. " : "") +
    (
      percent >= 90
        ? "Excellent."
        : percent >= 75
          ? "Très bon résultat."
          : percent >= 60
            ? "Bonne base, mais certains points sont à consolider."
            : "Il faut encore réviser."
    );

  $("#resultMode").textContent =
    targetedMode
      ? "Entraînement ciblé"
      : mode === "simulation"
        ? "Simulation examen"
        : mode === "exam"
          ? "Mode examen"
          : "Mode révision";

  $("#errorCount").textContent =
    `${errors.length} question${
      errors.length > 1 ? "s" : ""
    } à revoir`;

  const list = $("#errorList");

  list.innerHTML = "";

  if (errors.length) {
    errors.forEach((error, index) => {
      const item = document.createElement("li");

      item.innerHTML =
        `<strong>${index + 1}. ${error.q.question}</strong>` +
        `<br>` +
        `<span class="text-secondary">` +
        `Réponse correcte : ` +
        `${error.q.correct
          .map(
            (answerIndex) =>
              error.q.answers[answerIndex],
          )
          .join(" / ")}` +
        `</span>`;

      list.appendChild(item);
    });

    $("#errorsCard").classList.remove(
      "d-none",
    );

    localStorage.setItem(
      "quizLastErrors",
      JSON.stringify(
        errors.map((error) => error.q.id),
      ),
    );
  } else {
    $("#errorsCard").classList.add(
      "d-none",
    );

    localStorage.removeItem(
      "quizLastErrors",
    );
  }
}

/**
 * Relance un quiz contenant uniquement
 * les dernières questions ratées.
 */
function reviewErrors() {
  const ids = JSON.parse(
    localStorage.getItem("quizLastErrors") || "[]",
  );

  if (!ids.length) {
    alert("Aucune erreur enregistrée.");
    return;
  }

  const pool = QUESTIONS.filter(
    (question) =>
      ids.includes(question.id) ||
      ids.includes(String(question.id)),
  );

  quizQuestions = shuffle(pool);

  mode = "revision";
  targetedMode = true;

  currentIndex = 0;
  score = 0;
  errors = [];

  sessionStart = Date.now();

  $("#setup").classList.add("d-none");
  $("#result").classList.add("d-none");
  $("#targeted").classList.add("d-none");
  $("#quiz").classList.remove("d-none");

  showQuestion();
}

// ============================================================
// NAVIGATION
// ============================================================

/**
 * Retourne à l'écran principal.
 */
function back() {
  $("#result").classList.add("d-none");
  $("#quiz").classList.add("d-none");
  $("#history").classList.add("d-none");
  $("#targeted").classList.add("d-none");
  $("#marked")?.classList.add("d-none");

  $("#setup").classList.remove("d-none");

  clearInterval(timer);

  targetedMode = false;
}

/**
 * Quitte le quiz sans enregistrer la session.
 */
function quitQuiz() {
  if (
    !confirm(
      "Quitter ce quiz ? La progression de cette session ne sera pas enregistrée.",
    )
  ) {
    return;
  }

  clearInterval(timer);

  timer = null;
  quizQuestions = [];
  currentIndex = 0;
  score = 0;
  answered = false;
  errors = [];
  sessionStart = null;
  sessionElapsed = 0;
  targetedMode = false;

  $("#quiz").classList.add("d-none");
  $("#result").classList.add("d-none");
  $("#history").classList.add("d-none");
  $("#targeted").classList.add("d-none");

  $("#setup").classList.remove("d-none");

  updateModeUI();
  updateCountOptions();
}

// ============================================================
// FORMATAGE
// ============================================================

/**
 * Transforme une durée en secondes en texte lisible.
 */
function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    `${minutes} min` +
    `${remainingSeconds ? ` ${remainingSeconds}s` : ""}`
  );
}

/**
 * Formate une date selon les conventions françaises.
 */
function formatDate(iso) {
  return new Date(iso).toLocaleString(
    "fr-FR",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  );
}

// ============================================================
// STATISTIQUES PAR QUESTION
// ============================================================

/**
 * Construit les statistiques de chaque question
 * à partir de l'historique.
 */
function getQuestionStats() {
  const resetAt = getStatsResetAt();

  const sessions = JSON.parse(
    localStorage.getItem("quizSessions") || "[]",
  ).filter(
    (session) =>
      !resetAt ||
      new Date(session.date).getTime() >
        resetAt,
  );

  const stats = {};

  sessions.forEach((session) => {
    (session.outcomes || []).forEach(
      (outcome) => {
        const id = String(
          outcome.questionId,
        );

        if (!stats[id]) {
          stats[id] = {
            attempts: 0,
            correct: 0,
            wrong: 0,
            last: null,
            lastDate: null,
          };
        }

        if (
          outcome.outcome === "correct" ||
          outcome.outcome === "wrong"
        ) {
          stats[id].attempts++;
          stats[id][outcome.outcome]++;
          stats[id].last =
            outcome.outcome;
          stats[id].lastDate =
            session.date;
        }
      },
    );
  });

  return stats;
}

/**
 * Détermine si une question doit être revue.
 */
function isNeedsReview(stat) {
  if (!stat || !stat.attempts) {
    return false;
  }

  const rate =
    (stat.correct / stat.attempts) * 100;

  return (
    stat.last === "wrong" ||
    rate < 80 ||
    stat.attempts < 3
  );
}

/**
 * Détermine le niveau de maîtrise d'une question.
 */
function masteryStatus(stat) {
  if (!stat || !stat.attempts) {
    return {
      label: "Non évaluée",
      class: "text-secondary",
    };
  }

  const rate =
    (stat.correct / stat.attempts) * 100;

  const resetAt = getStatsResetAt();

  const sessions = JSON.parse(
    localStorage.getItem("quizSessions") || "[]",
  ).filter(
    (session) =>
      !resetAt ||
      new Date(session.date).getTime() >
        resetAt,
  );

  const recent = [];

  sessions.forEach((session) =>
    (session.outcomes || []).forEach(
      (outcome) => {
        if (
          String(outcome.questionId) ===
            String(stat.questionId) &&
          (
            outcome.outcome === "correct" ||
            outcome.outcome === "wrong"
          )
        ) {
          recent.push(outcome.outcome);
        }
      },
    ),
  );

  const lastTwo = recent.slice(0, 2);

  if (
    stat.attempts >= 3 &&
    rate >= 80 &&
    lastTwo.length === 2 &&
    lastTwo.every(
      (result) => result === "correct",
    )
  ) {
    return {
      label: "🟢 Maîtrisée",
      class: "mastery-green",
    };
  }

  if (
    stat.last === "wrong" ||
    rate < 50
  ) {
    return {
      label: "🔴 À revoir",
      class: "mastery-red",
    };
  }

  return {
    label: "🟠 En cours",
    class: "mastery-orange",
  };
}

// ============================================================
// ENTRAÎNEMENT CIBLÉ : THÈMES
// ============================================================

/**
 * Remplit la liste des matières disponibles
 * pour l'entraînement ciblé.
 */
function populateTargetThemes() {
  const select = $("#targetTheme");

  if (!select) return;

  select.innerHTML =
    '<option value="all">Toutes les matières</option>';

  [
    ...new Set(
      QUESTIONS.map(
        (question) => question.theme,
      ),
    ),
  ].forEach((theme) => {
    const option =
      document.createElement("option");

    option.value = theme;
    option.textContent = theme;

    select.appendChild(option);
  });

  updateTargetInfo();
}

/**
 * Met à jour le nombre de questions disponibles
 * pour l'entraînement ciblé.
 */
function updateTargetInfo() {
  const theme = $("#targetTheme").value;
  const scope = $("#targetScope").value;
  const stats = getQuestionStats();

  const pool = QUESTIONS
    .filter(
      (question) =>
        theme === "all" ||
        question.theme === theme,
    )
    .filter((question) => {
      const stat =
        stats[String(question.id)];

      return scope === "errors"
        ? !!(stat && stat.wrong > 0)
        : isNeedsReview(stat);
    });

  $("#targetInfo").innerHTML =
    `<span class="targeted-count">${pool.length}</span> ` +
    `question${pool.length > 1 ? "s" : ""} ` +
    `disponible${pool.length > 1 ? "s" : ""} ` +
    `pour cet entraînement.`;

  const countSelect = $("#targetCount");

  [...countSelect.options].forEach(
    (option) => {
      if (option.value === "all") {
        return;
      }

      const number = Number(
        option.value,
      );

      option.disabled =
        number > pool.length;

      option.textContent =
        `${number} question${
          number > 1 ? "s" : ""
        }` +
        `${
          number > pool.length
            ? " — indisponible"
            : ""
        }`;
    },
  );

  if (
    countSelect.value !== "all" &&
    Number(countSelect.value) >
      pool.length
  ) {
    countSelect.value = "all";
  }
}

// ============================================================
// EXPLICATIONS COMPLÉMENTAIRES
// ============================================================

/**
 * Fournit une explication complémentaire
 * en fonction du thème de la question.
 */
function getExplanationDetail(question) {
  if (
    question.theme.includes(
      "Sécurité générale",
    )
  ) {
    return "Le bon réflexe est de réduire l’exposition au danger avant même de penser à la rapidité d’exécution.";
  }

  if (
    question.theme.includes(
      "Cheminement",
    )
  ) {
    return "La logique de sécurité est d’éviter la zone dangereuse et de vérifier les conditions nécessaires avant tout déplacement ou franchissement.";
  }

  if (
    question.theme.includes(
      "Risques électriques",
    )
  ) {
    return "Le risque électrique ne se limite pas au contact direct : la proximité, un conducteur tombé ou un élément métallique peuvent également créer une situation dangereuse.";
  }

  if (
    question.theme.includes("VACMA")
  ) {
    return "Cette notion est à retenir comme un élément de surveillance de la vigilance et de la réaction du conducteur.";
  }

  if (
    question.theme.includes("Arrêts")
  ) {
    return "La bonne réponse correspond à une catégorie précise d’arrêt ; les autres propositions mélangent des lieux, des fonctions ou des situations.";
  }

  if (
    question.theme.includes("Histoire")
  ) {
    return "Ce repère permet de replacer la notion dans l’évolution du chemin de fer et de mieux distinguer les grandes étapes techniques ou historiques.";
  }

  return "Repère la notion centrale de la question avant de comparer les propositions.";
}

// ============================================================
// MODE SOMBRE
// ============================================================

/**
 * Applique le thème clair ou sombre.
 */
function applyTheme() {
  const dark =
    localStorage.getItem(
      "quizDarkMode",
    ) === "1";

  document.documentElement.setAttribute(
    "data-bs-theme",
    dark ? "dark" : "light",
  );

  document.body.classList.toggle(
    "dark-mode",
    dark,
  );

  const button = $("#themeToggle");

  if (button) {
    button.textContent =
      dark ? "☀️" : "🌙";
  }
}

/**
 * Active ou désactive le mode sombre.
 */
function toggleDarkMode() {
  const dark =
    localStorage.getItem(
      "quizDarkMode",
    ) === "1";

  localStorage.setItem(
    "quizDarkMode",
    dark ? "0" : "1",
  );

  applyTheme();
}

// ============================================================
// RACCOURCIS CLAVIER
// ============================================================

/**
 * Gestion des raccourcis clavier pendant un quiz.
 *
 * 1 à 9 : sélectionner une réponse
 * Entrée : valider / passer à la suivante
 * M : marquer la question
 * I : afficher l'indice en mode révision
 */
document.addEventListener(
  "keydown",
  (event) => {
    if (
      $("#quiz").classList.contains(
        "d-none",
      )
    ) {
      return;
    }

    if (
      event.target.matches(
        "input,textarea,select",
      )
    ) {
      return;
    }

    const question =
      quizQuestions[currentIndex];

    if (!question) return;

    // Raccourcis numériques.
    if (/^[1-9]$/.test(event.key)) {
      const number =
        Number(event.key) - 1;

      const button = [
        ...document.querySelectorAll(
          ".answer-btn",
        ),
      ][number];

      if (button) {
        toggle(button, question);
        event.preventDefault();
      }
    }

    // Touche Entrée.
    else if (event.key === "Enter") {
      event.preventDefault();

      if (!answered) {
        validate();
      } else {
        next();
      }
    }

    // Touche M : marquer la question.
    else if (
      event.key.toLowerCase() === "m"
    ) {
      toggleMarked(question.id);
    }

    // Touche I : afficher l'indice.
    else if (
      event.key.toLowerCase() === "i" &&
      mode === "revision" &&
      !answered
    ) {
      $("#hintBtn").click();
    }
  },
);

// ============================================================
// INDICES DES QUESTIONS
// ============================================================

const HINTS = {
  1: "Repense aux catégories de dangers directement liées à la circulation, aux installations et à l’environnement ferroviaire.",
  2: "Cherche parmi les facteurs qui diminuent la vigilance ou les capacités de réaction.",
  3: "Une voie ferrée reste soumise au risque de circulation, même lorsqu’aucun véhicule n’est visible.",
  4: "En gare, ne pars pas du principe qu’une circulation arrive toujours du même côté.",
  5: "La sécurité concerne à la fois la personne qui intervient et les autres personnes présentes.",
  6: "Les équipements de protection individuelle font partie des règles de sécurité à respecter.",
  7: "Distingue les équipements de protection des comportements ou objets pouvant gêner la vigilance et les déplacements.",
  8: "Une tenue qui peut s’accrocher ou gêner les mouvements présente un risque particulier.",
  9: "Les chaussures adaptées doivent protéger et limiter les risques liés au déplacement.",
  10: "Le premier réflexe est d’éviter d’entrer dans l’espace exposé aux circulations.",
  11: "Pense aux dangers créés par le passage d’un véhicule ferroviaire à proximité.",
  12: "Le stationnement n’est pas un déplacement nécessaire et augmente l’exposition au danger.",
  13: "La vitesse de la voie intervient directement dans la distance minimale à respecter.",
  14: "L’absence de visibilité d’un train ne permet pas de conclure que la voie est sûre.",
  15: "Le conducteur évolue régulièrement à proximité d’installations électriques, même sans intervenir sur celles-ci.",
  16: "Retrouve la périodicité prévue pour maintenir cette habilitation.",
  17: "Un contact électrique peut avoir des conséquences graves sur l’organisme.",
  18: "Un phénomène électrique peut se produire avant même un contact physique.",
  19: "Certains comportements à proximité des installations augmentent fortement l’exposition au risque.",
  20: "Un conducteur tombé au sol doit être traité comme potentiellement dangereux.",
  21: "Un élément qui engage le gabarit peut empêcher une circulation de passer en sécurité.",
  22: "Les supports d’installations électriques ne doivent pas être utilisés comme appui.",
  23: "Cherche les éléments susceptibles de s’accrocher, de détourner l’attention ou de gêner l’audition.",
  24: "Retrouve l’ordre logique des trois actions de premiers secours.",
  25: "Les zones sont numérotées selon leur niveau d’exposition au risque électrique.",
  26: "Pour une zone plus proche de l’installation, une condition supplémentaire liée à la mise hors tension est nécessaire.",
  27: "Un ordre de coupure doit permettre d’identifier clairement l’action, son emplacement, sa raison et son origine.",
  28: "Il existe un sens de circulation normalement associé à chaque voie d’une double voie.",
  29: "Les différents systèmes de cantonnement portent des appellations spécifiques.",
  30: "Le cantonnement tient compte du fait qu’un train ne peut pas s’arrêter instantanément.",
  31: "Retrouve la valeur de référence habituellement associée au BAL.",
  32: "Cherche le dispositif qui signale visuellement qu’un signal ne doit plus être pris en compte.",
  33: "Les essais portent sur différentes vérifications du fonctionnement et de la continuité du frein.",
  34: "Un essai complet ne porte pas sur un seul élément : il vérifie plusieurs aspects du freinage.",
  35: "Repense à la pression de régime de la conduite générale.",
  36: "Les paramètres concernent les caractéristiques nécessaires au calcul et à la surveillance du train.",
  37: "La VACMA est liée à la présence active du conducteur aux commandes.",
  38: "Observe la chronologie des appuis et de la temporisation de la VACMA.",
  39: "Les trois catégories correspondent à des situations d’arrêt différentes.",
};

/**
 * Retourne l'indice correspondant à une question.
 */
function getHint(question) {
  return (
    question.hint ||
    HINTS[question.id] ||
    "Relis la question en identifiant la notion principale et élimine les réponses qui ne correspondent pas à cette notion."
  );
}

// ============================================================
// HISTORIQUE : FILTRES
// ============================================================

/**
 * Retourne les sessions correspondant aux filtres sélectionnés.
 */
function getFilteredSessions() {
  const sessions = JSON.parse(
    localStorage.getItem("quizSessions") || "[]",
  );

  const modeFilter =
    $("#historyModeFilter")?.value ||
    "all";

  const themeFilter =
    $("#historyThemeFilter")?.value ||
    "all";

  const periodFilter =
    $("#historyPeriodFilter")?.value ||
    "all";

  const now = Date.now();

  return sessions.filter((session) => {
    if (
      modeFilter !== "all" &&
      session.mode !== modeFilter
    ) {
      return false;
    }

    if (
      themeFilter !== "all" &&
      session.theme !== themeFilter
    ) {
      return false;
    }

    if (
      periodFilter !== "all" &&
      now -
        new Date(session.date).getTime() >
        Number(periodFilter) *
          86400000
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Remplit le filtre des matières de l'historique.
 */
function populateHistoryThemeFilter(
  sessions,
) {
  const select =
    $("#historyThemeFilter");

  if (!select) return;

  const current = select.value;

  const themes = [
    ...new Set(
      sessions.map(
        (session) => session.theme,
      ),
    ),
  ].sort((a, b) =>
    a.localeCompare(b),
  );

  select.innerHTML =
    '<option value="all">Toutes les matières</option>' +
    themes
      .map(
        (theme) =>
          `<option value="${escapeHtml(
            theme,
          )}">${escapeHtml(
            theme,
          )}</option>`,
      )
      .join("");

  select.value = themes.includes(current)
    ? current
    : "all";
}

// ============================================================
// SÉCURISATION DU HTML
// ============================================================

/**
 * Échappe les caractères spéciaux avant insertion
 * de contenu dans du HTML généré dynamiquement.
 */
function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

// ============================================================
// AFFICHAGE DE L'HISTORIQUE
// ============================================================

/**
 * Affiche l'historique, les statistiques,
 * la progression et le suivi de maîtrise.
 */
function showHistory() {
  clearInterval(timer);

  targetedMode = false;

  $("#setup").classList.add("d-none");
  $("#quiz").classList.add("d-none");
  $("#result").classList.add("d-none");
  $("#targeted").classList.add("d-none");
  $("#history").classList.remove("d-none");

  const allSessions = JSON.parse(
    localStorage.getItem("quizSessions") || "[]",
  );

  populateHistoryThemeFilter(
    allSessions,
  );

  const resetAt = getStatsResetAt();

  const sessions = getFilteredSessions()
    .filter(
      (session) =>
        !resetAt ||
        new Date(session.date).getTime() >
          resetAt,
    );

  const displaySessions =
    getFilteredSessions();

  const body = $("#historyBody");
  const progressBody =
    $("#progressBody");
  const masteryBody =
    $("#masteryBody");

  body.innerHTML = "";
  progressBody.innerHTML = "";
  masteryBody.innerHTML = "";

  let total = 0;
  let best = 0;
  let sum = 0;

  const modeCounts = {};
  const byTheme = {};

  // ----------------------------------------------------------
  // Tableau de l'historique
  // ----------------------------------------------------------

  sessions.forEach((session) => {
    total++;

    best = Math.max(
      best,
      session.percent,
    );

    sum += session.percent;

    modeCounts[session.mode] =
      (modeCounts[session.mode] || 0) +
      1;

    const row =
      document.createElement("tr");

    row.innerHTML =
      `<td>${formatDate(
        session.date,
      )}</td>` +
      `<td>${
        session.mode === "simulation"
          ? '<span class="badge text-bg-success">Simulation</span>'
          : session.mode === "exam"
            ? '<span class="badge text-bg-dark">Examen</span>'
            : '<span class="badge text-bg-primary">Révision</span>'
      }</td>` +
      `<td>${escapeHtml(
        session.theme,
      )}</td>` +
      `<td class="fw-semibold">${
        session.score
      }/${session.count} (${
        session.percent
      }%)</td>` +
      `<td>${formatDuration(
        session.duration,
      )}${
        session.timeUp ? " ⏱" : ""
      }</td>` +
      `<td>${session.errors}</td>`;

    body.appendChild(row);

    // Les sessions ciblées et « tous les thèmes »
    // ne sont pas utilisées pour la progression par matière.
    if (
      session.theme !==
        "Tous les thèmes" &&
      session.theme !==
        "Tous les thèmes (simulation)" &&
      session.theme !==
        "Entraînement ciblé"
    ) {
      if (!byTheme[session.theme]) {
        byTheme[session.theme] = [];
      }

      byTheme[session.theme].push(
        session,
      );
    }
  });

  // ----------------------------------------------------------
  // Progression par matière
  // ----------------------------------------------------------

  Object.entries(byTheme).forEach(
    ([theme, list]) => {
      list.sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date),
      );

      const average = Math.round(
        list.reduce(
          (sum, session) =>
            sum + session.percent,
          0,
        ) / list.length,
      );

      const bestTheme = Math.max(
        ...list.map(
          (session) =>
            session.percent,
        ),
      );

      const last =
        list[list.length - 1];

      const previous =
        list.length > 1
          ? list[list.length - 2]
          : null;

      const evolution = previous
        ? last.percent -
          previous.percent
        : null;

      const evolutionHtml =
        evolution === null
          ? '<span class="text-secondary">—</span>'
          : `<span class="fw-semibold ${
              evolution > 0
                ? "text-success"
                : evolution < 0
                  ? "text-danger"
                  : "text-secondary"
            }">${
              evolution > 0 ? "+" : ""
            }${evolution} pts</span>`;

      const row =
        document.createElement("tr");

      row.innerHTML =
        `<td class="fw-semibold">${escapeHtml(
          theme,
        )}</td>` +
        `<td>${list.length}</td>` +
        `<td>${average}%</td>` +
        `<td>${bestTheme}%</td>` +
        `<td class="fw-semibold">${
          last.percent
        }% <span class="text-secondary fw-normal">(${
          last.score
        }/${last.count})</span></td>` +
        `<td>${evolutionHtml}</td>` +
        `<td>${formatDate(
          last.date,
        )}</td>`;

      progressBody.appendChild(row);
    },
  );

  // ----------------------------------------------------------
  // Suivi de maîtrise
  // ----------------------------------------------------------

  const stats = getQuestionStats();
  const questionsById = {};

  QUESTIONS.forEach(
    (question) => {
      questionsById[String(question.id)] =
        question;
    },
  );

  const masteryRows = Object.entries(
    stats,
  )
    .map(([id, stat]) => {
      stat.questionId = id;

      return {
        q: questionsById[id],
        st: stat,
        status: masteryStatus(stat),
      };
    })
    .filter((item) => item.q)
    .sort((a, b) => {
      const rank = {
        "mastery-red": 0,
        "mastery-orange": 1,
        "mastery-green": 2,
        "text-secondary": 3,
      };

      return (
        rank[a.status.class] -
          rank[b.status.class] ||
        a.q.theme.localeCompare(
          b.q.theme,
        ) ||
        a.q.id - b.q.id
      );
    });

  masteryRows.forEach(
    ({ q, st, status }) => {
      const rate = Math.round(
        (st.correct /
          st.attempts) *
          100,
      );

      const row =
        document.createElement("tr");

      row.innerHTML =
        `<td>${escapeHtml(
          q.question,
        )}</td>` +
        `<td>${escapeHtml(
          q.theme,
        )}</td>` +
        `<td>${st.attempts}</td>` +
        `<td>${rate}%</td>` +
        `<td>${
          st.last === "correct"
            ? '<span class="text-success">Réussie</span>'
            : '<span class="text-danger">Ratée</span>'
        }</td>` +
        `<td class="${status.class}">${status.label}</td>`;

      masteryBody.appendChild(row);
    },
  );

  // ----------------------------------------------------------
  // Résumé de la maîtrise
  // ----------------------------------------------------------

  const masterySummary =
    $("#masterySummary");

  const masteryDetails =
    $("#masteryDetails");

  const toggleMasteryButton =
    $("#toggleMasteryBtn");

  if (masterySummary) {
    const counts = {
      red: 0,
      orange: 0,
      green: 0,
    };

    masteryRows.forEach((item) => {
      if (
        item.status.class ===
        "mastery-red"
      ) {
        counts.red++;
      } else if (
        item.status.class ===
        "mastery-orange"
      ) {
        counts.orange++;
      } else if (
        item.status.class ===
        "mastery-green"
      ) {
        counts.green++;
      }
    });

    masterySummary.innerHTML =
      `<div class="col-4">` +
      `<div class="mastery-summary-card mastery-summary-red">` +
      `<strong>${counts.red}</strong>` +
      `<span>À revoir</span>` +
      `</div>` +
      `</div>` +
      `<div class="col-4">` +
      `<div class="mastery-summary-card mastery-summary-orange">` +
      `<strong>${counts.orange}</strong>` +
      `<span>En cours</span>` +
      `</div>` +
      `</div>` +
      `<div class="col-4">` +
      `<div class="mastery-summary-card mastery-summary-green">` +
      `<strong>${counts.green}</strong>` +
      `<span>Maîtrisées</span>` +
      `</div>` +
      `</div>`;
  }

  if (
    masteryDetails &&
    toggleMasteryButton
  ) {
    masteryDetails.classList.add(
      "d-none",
    );

    toggleMasteryButton.setAttribute(
      "aria-expanded",
      "false",
    );

    toggleMasteryButton.textContent =
      "Afficher le détail";
  }

  // Graphique.
  renderProgressChart(sessions);

  // ----------------------------------------------------------
  // Résumé général
  // ----------------------------------------------------------

  $("#historySummary").innerHTML =
    `<div class="col-6 col-md-3">` +
    `<div class="border rounded p-2 text-center">` +
    `<div class="small text-secondary">Sessions</div>` +
    `<strong>${total}</strong>` +
    `</div>` +
    `</div>` +
    `<div class="col-6 col-md-3">` +
    `<div class="border rounded p-2 text-center">` +
    `<div class="small text-secondary">Moyenne</div>` +
    `<strong>${
      total
        ? Math.round(sum / total)
        : 0
    }%</strong>` +
    `</div>` +
    `</div>` +
    `<div class="col-6 col-md-3">` +
    `<div class="border rounded p-2 text-center">` +
    `<div class="small text-secondary">Meilleur score</div>` +
    `<strong>${best}%</strong>` +
    `</div>` +
    `</div>` +
    `<div class="col-6 col-md-3">` +
    `<div class="border rounded p-2 text-center">` +
    `<div class="small text-secondary">Examens</div>` +
    `<strong>${
      (modeCounts.exam || 0) +
      (modeCounts.simulation || 0)
    }</strong>` +
    `</div>` +
    `</div>`;

  // ----------------------------------------------------------
  // Messages lorsqu'il n'y a aucune donnée
  // ----------------------------------------------------------

  if (!sessions.length) {
    body.innerHTML =
      `<tr>` +
      `<td colspan="6" class="text-center text-secondary py-4">` +
      `Aucune session ne correspond aux filtres sélectionnés.` +
      `</td>` +
      `</tr>`;

    progressBody.innerHTML =
      `<tr>` +
      `<td colspan="7" class="text-center text-secondary py-4">` +
      `Aucune progression disponible pour cette sélection.` +
      `</td>` +
      `</tr>`;

    masteryBody.innerHTML =
      `<tr>` +
      `<td colspan="6" class="text-center text-secondary py-4">` +
      `Aucune donnée de maîtrise à afficher.` +
      `</td>` +
      `</tr>`;
  } else if (
    !Object.keys(byTheme).length
  ) {
    progressBody.innerHTML =
      `<tr>` +
      `<td colspan="7" class="text-center text-secondary py-4">` +
      `Fais au moins un quiz avec un thème précis pour afficher ta progression par matière.` +
      `</td>` +
      `</tr>`;
  } else if (!masteryRows.length) {
    masteryBody.innerHTML =
      `<tr>` +
      `<td colspan="6" class="text-center text-secondary py-4">` +
      `Le suivi de maîtrise apparaîtra avec les nouvelles sessions.` +
      `</td>` +
      `</tr>`;
  }
}

// ============================================================
// GRAPHIQUE DE PROGRESSION
// ============================================================

/**
 * Génère le graphique SVG représentant
 * l'évolution des scores.
 */
function renderProgressChart(
  sessions,
) {
  const element = $("#progressChart");

  if (!sessions.length) {
    element.innerHTML =
      `<div class="text-secondary py-5 text-center">` +
      `Le graphique apparaîtra après tes premières sessions.` +
      `</div>`;

    return;
  }

  // On conserve les 20 dernières sessions.
  const data = [...sessions]
    .reverse()
    .slice(-20);

  const width = Math.max(
    620,
    data.length * 65,
  );

  const height = 240;

  const padding = {
    left: 42,
    right: 20,
    top: 20,
    bottom: 48,
  };

  const innerWidth =
    width -
    padding.left -
    padding.right;

  const innerHeight =
    height -
    padding.top -
    padding.bottom;

  // Position horizontale d'un point.
  const x = (index) =>
    data.length === 1
      ? padding.left +
        innerWidth / 2
      : padding.left +
        (index /
          (data.length - 1)) *
          innerWidth;

  // Position verticale d'un point.
  const y = (value) =>
    padding.top +
    ((100 - value) / 100) *
      innerHeight;

  let svg =
    `<svg viewBox="0 0 ${width} ${height}" ` +
    `role="img" ` +
    `aria-label="Évolution des scores des dernières sessions">`;

  // Lignes horizontales du graphique.
  [0, 25, 50, 75, 100].forEach(
    (value) => {
      svg +=
        `<line class="chart-grid" ` +
        `x1="${padding.left}" ` +
        `y1="${y(value)}" ` +
        `x2="${width - padding.right}" ` +
        `y2="${y(value)}"></line>` +
        `<text x="${
          padding.left - 8
        }" ` +
        `y="${y(value) + 4}" ` +
        `text-anchor="end">${value}%</text>`;
    },
  );

  // Coordonnées de la courbe.
  const points = data
    .map(
      (session, index) =>
        `${x(index)},${y(
          session.percent,
        )}`,
    )
    .join(" ");

  svg +=
    `<polyline class="chart-line" ` +
    `points="${points}"></polyline>`;

  // Points et dates.
  data.forEach(
    (session, index) => {
      const label =
        formatDate(session.date).split(
          " ",
        )[0];

      svg +=
        `<circle class="chart-point" ` +
        `cx="${x(index)}" ` +
        `cy="${y(
          session.percent,
        )}" ` +
        `r="4">` +
        `<title>${formatDate(
          session.date,
        )} — ${session.percent}% — ${
          session.theme
        }</title>` +
        `</circle>` +
        `<text x="${x(index)}" ` +
        `y="${height - 18}" ` +
        `text-anchor="middle">${label}</text>`;
    },
  );

  svg += "</svg>";

  element.innerHTML = svg;
}

// ============================================================
// SUPPRESSION DE L'HISTORIQUE
// ============================================================

/**
 * Supprime tout l'historique des sessions.
 */
function clearHistory() {
  if (
    confirm(
      "Effacer tout l’historique des sessions ?",
    )
  ) {
    localStorage.removeItem(
      "quizSessions",
    );

    localStorage.removeItem(
      "quizLastErrors",
    );

    showHistory();
    updateTargetInfo();
  }
}

// ============================================================
// ÉVÉNEMENTS DES BOUTONS
// ============================================================

// Question marquée.
$("#markQuestionBtn").onclick = () => {
  const question =
    quizQuestions[currentIndex];

  if (question) {
    toggleMarked(question.id);
  }
};

// Écran des questions marquées.
$("#markedBtn").onclick = showMarked;
$("#closeMarkedBtn").onclick = back;
$("#startMarkedBtn").onclick =
  startMarkedQuiz;

// Statistiques.
$("#resetStatsBtn").onclick =
  resetStats;

// Mode sombre.
$("#themeToggle").onclick =
  toggleDarkMode;

// Affichage / masquage du détail de maîtrise.
$("#toggleMasteryBtn").onclick = () => {
  const details = $("#masteryDetails");
  const button =
    $("#toggleMasteryBtn");

  const hidden =
    details.classList.toggle(
      "d-none",
    );

  button.setAttribute(
    "aria-expanded",
    String(!hidden),
  );

  button.textContent = hidden
    ? "Afficher le détail"
    : "Masquer le détail";
};

// Page des cours.
$("#courseBtn").onclick = () => {
  window.location.href =
    "cours.html";
};

$("#closeCourseBtn").onclick = back;

// Mode du quiz.
$("#mode").onchange =
  updateModeUI;

// Thème.
$("#theme").onchange =
  updateCountOptions;

// Démarrer un quiz.
$("#startBtn").onclick =
  startQuiz;

// Historique.
$("#homeHistoryBtn").onclick =
  showHistory;

// ------------------------------------------------------------
// Entraînement ciblé
// ------------------------------------------------------------

$("#targetedBtn").onclick = () => {
  $("#setup").classList.add("d-none");
  $("#history").classList.add("d-none");
  $("#quiz").classList.add("d-none");
  $("#result").classList.add("d-none");

  $("#targeted").classList.remove(
    "d-none",
  );

  populateTargetThemes();
  updateTargetInfo();
};

$("#targetTheme").onchange =
  updateTargetInfo;

$("#targetScope").onchange =
  updateTargetInfo;

$("#startTargetBtn").onclick =
  startTargetedQuiz;

$("#closeTargetBtn").onclick =
  back;

// ------------------------------------------------------------
// Contrôles du quiz
// ------------------------------------------------------------

$("#quitQuizBtn").onclick =
  quitQuiz;

// Indice.
$("#hintBtn").onclick = () => {
  $("#hint").classList.remove(
    "d-none",
  );

  $("#hintBtn").classList.add(
    "d-none",
  );
};

// Validation.
$("#validateBtn").onclick =
  validate;

// Question suivante.
$("#nextBtn").onclick =
  next;

// Terminer le quiz.
$("#finishBtn").onclick = () => {
  if (!answered) {
    validate();
  } else {
    finish(false);
  }
};

// ------------------------------------------------------------
// Résultats
// ------------------------------------------------------------

$("#restartBtn").onclick =
  startQuiz;

$("#backBtn").onclick =
  back;

$("#reviewErrorsBtn").onclick =
  reviewErrors;

// ------------------------------------------------------------
// Historique
// ------------------------------------------------------------

$("#historyBtn").onclick =
  showHistory;

$("#closeHistoryBtn").onclick =
  back;

$("#clearHistoryBtn").onclick =
  clearHistory;

$("#historyModeFilter").onchange =
  showHistory;

$("#historyThemeFilter").onchange =
  showHistory;

$("#historyPeriodFilter").onchange =
  showHistory;

// ============================================================
// INITIALISATION
// ============================================================

// Remplit les thèmes du quiz.
populateThemes();

// Configure le mode sélectionné.
updateModeUI();

// Applique le thème clair / sombre.
applyTheme();

// Affiche les badges éventuels.
renderBadges();

// Affiche la liste des questions marquées.
renderMarkedList();