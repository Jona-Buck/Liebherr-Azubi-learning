const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  const label = $("#toast-message");
  if (!toast || !label) return;
  label.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

const viewInfo = {
  dashboard: ["Dashboard", "Dein persönlicher Lernüberblick."],
  modules: ["Lernmodule", "Alle Lerninhalte deiner technischen Ausbildung im Überblick."],
  exam: ["Prüfungssimulation", "Bereite dich mit realistischen Wissenschecks auf deine Prüfung vor."],
  cards: ["Karteikarten", "Wiederhole wichtige Begriffe und Zusammenhänge."],
  assistant: ["KI-Lernassistent", "Stelle Fachfragen und lass dir technische Zusammenhänge erklären."],
  stats: ["Meine Ergebnisse", "Behalte deinen Lernfortschritt und deine Entwicklung im Blick."],
  favorites: ["Favoriten", "Deine gespeicherten Fragen und Lerninhalte."],
  settings: ["Einstellungen", "Verwalte dein Profil und deine Lernpräferenzen."]
};

const viewIcons = {
  modules: "book-open",
  exam: "clipboard-check",
  cards: "layers",
  assistant: "sparkles",
  stats: "chart-no-axes-combined",
  favorites: "bookmark",
  settings: "settings-2"
};

const dashboardMarkup = $("#main-content").innerHTML;
let lastModalTrigger = null;

function switchView(view) {
  const info = viewInfo[view] || viewInfo.dashboard;

  $$(".sidebar .nav-item[data-view]").forEach(item => {
    const active = item.dataset.view === view;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  $("#breadcrumb-current").textContent = info[0];

  if (view === "dashboard") {
    $("#main-content").innerHTML = dashboardMarkup;
    refreshIcons();
    bindActions();
    return;
  }

  const icon = viewIcons[view] || "book-open";
  if (view === "modules") {
    const subjects = [
      ["Elektrotechnik","Grundlagen & Anwendungen","zap",76,"8 Module · 42 Lektionen","subject-orange"],
      ["Steuerungstechnik","SPS, Schütze & Relais","workflow",52,"6 Module · 31 Lektionen","subject-blue"],
      ["Technische Mathematik","Formeln & Berechnungen","calculator",34,"5 Module · 26 Lektionen","subject-violet"]
    ];
    $("#main-content").innerHTML = '<section class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> DEINE AUSBILDUNG</div><h1>Lernmodule</h1><p>Wähle einen Lernbereich deiner technischen Ausbildung.</p></div></section><section class="subject-grid modules-grid">' + subjects.map(s => '<button class="subject-card" data-subject="' + s[0] + '"><span class="subject-top"><span class="subject-icon ' + s[5] + '"><i data-lucide="' + s[2] + '"></i></span><span class="subject-arrow"><i data-lucide="arrow-up-right"></i></span></span><strong>' + s[0] + '</strong><span class="subject-caption">' + s[1] + '</span><span class="subject-progress"><span class="subject-track"><i style="width:' + s[3] + '%"></i></span><b>' + s[3] + ' %</b></span><span class="subject-meta">' + s[4] + '</span></button>').join("") + '</section>';
    refreshIcons(); bindActions(); return;
  }
  const title = info[0];
  const description = "Dieser Bereich ist als Vorschau angelegt. Die eigentliche Funktion kann im nächsten Entwicklungsschritt ergänzt werden.";

  $("#main-content").innerHTML =
    '<section class="page-heading">' +
      '<div><div class="eyebrow"><span class="eyebrow-line"></span> AZUBI.ACADEMY</div>' +
      '<h1>' + info[0] + '</h1><p>' + info[1] + '</p></div>' +
    '</section>' +
    '<section class="panel placeholder-panel">' +
      '<span class="modal-icon"><i data-lucide="' + icon + '"></i></span>' +
      '<h2>' + title + '</h2>' +
      '<p>' + description + '</p>' +
      '<button class="button button-primary" data-view="dashboard"><i data-lucide="layout-dashboard"></i> Zurück zum Dashboard</button>' +
      '<span class="placeholder-note">LAYOUT-VORSCHAU · FUNKTIONEN FOLGEN</span>' +
    '</section>';

  refreshIcons();
  bindActions();
}

function openExamModal(trigger) {
  const modal = $("#modal");
  lastModalTrigger = trigger || document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  $("#modal-close").focus();
}

function closeExamModal() {
  const modal = $("#modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (lastModalTrigger && typeof lastModalTrigger.focus === "function") {
    lastModalTrigger.focus();
  }
}

function bindActions() {
  $$("[data-view]", $("#main-content")).forEach(item => {
    item.addEventListener("click", event => {
      if (item.tagName === "A") event.preventDefault();
      switchView(item.dataset.view);
    });
  });

  $$('[data-action="start-exam"]', $("#main-content")).forEach(item => {
    item.addEventListener("click", () => openExamModal(item));
  });

  $$('[data-action="continue-learning"]', $("#main-content")).forEach(item => {
    item.addEventListener("click", () => showToast("Lernmodul „Schützschaltungen“ ausgewählt."));
  });

  $$('[data-action="start-review"]', $("#main-content")).forEach(item => {
    item.addEventListener("click", () => showToast("Deine Wiederholungseinheit ist ausgewählt."));
  });

  $$("[data-subject]", $("#main-content")).forEach(item => {
    item.addEventListener("click", () => showToast("Lernbereich „" + item.dataset.subject + "“ ausgewählt."));
  });
}

$$(".sidebar [data-view]").forEach(item => {
  item.addEventListener("click", event => {
    if (item.tagName === "A") event.preventDefault();
    switchView(item.dataset.view);
  });
});

$(".help-card a").addEventListener("click", event => {
  event.preventDefault();
  showToast("Die Support-Kontaktmöglichkeit wird später eingerichtet.");
});

$("#modal-close").addEventListener("click", closeExamModal);
$("#modal").addEventListener("click", event => {
  if (event.target === $("#modal")) closeExamModal();
});
$("#modal-start").addEventListener("click", () => {
  closeExamModal();
  showToast("Die Prüfungssimulation wird in einem nächsten Schritt ergänzt.");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeExamModal();
});

const date = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});
$("#today-date").textContent = date.format(new Date());

bindActions();
refreshIcons();
