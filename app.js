const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  $("#toast-message").textContent = message;
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

function switchView(view) {
  const info = viewInfo[view] || viewInfo.dashboard;
  $$(".nav-item[data-view]").forEach(item => item.classList.toggle("active", item.dataset.view === view));
  $("#breadcrumb-current").textContent = info[0];
  if (view === "dashboard") {
    $("#main-content").innerHTML = dashboardMarkup;
    refreshIcons();
    bindActions();
    return;
  }
  $("#main-content").innerHTML = `
    <section class="page-heading">
      <div><div class="eyebrow"><span class="eyebrow-line"></span> AZUBI.ACADEMY</div><h1>${info[0]}</h1><p>${info[1]}</p></div>
    </section>
    <section class="panel" style="padding:30px;min-height:290px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">
      <span class="modal-icon"><i data-lucide="${view === "assistant" ? "sparkles" : view === "exam" ? "clipboard-check" : view === "cards" ? "layers" : view === "stats" ? "chart-no-axes-combined" : "book-open"}"></i></span>
      <h2 style="font-size:18px;margin:0 0 8px">${view === "modules" ? "Deine Lernmodule" : info[0]}</h2>
      <p style="font-size:12px;line-height:1.7;color:#7c899a;max-width:420px;margin:0 0 17px">${view === "modules" ? "Hier findest du später deine Lerninhalte nach Fachgebiet, Ausbildungsjahr und Fortschritt sortiert." : "Dieser Bereich ist im ersten Layout als Vorschau angelegt. Die eigentliche Funktion bauen wir im nächsten Entwicklungsschritt."}</p>
      <button class="button button-primary" data-view="dashboard"><i data-lucide="layout-dashboard"></i> Zurück zum Dashboard</button>
      <span style="font-size:9px;color:#a0aab6;margin-top:14px">LAYOUT-VORSCHAU · FUNKTIONEN FOLGEN</span>
    </section>`;
  refreshIcons();
  $$("[data-view]", $("#main-content")).forEach(item => item.addEventListener("click", () => switchView(item.dataset.view)));
}

const dashboardMarkup = $("#main-content").innerHTML;

function openExamModal() {
  $("#modal").classList.add("open");
  $("#modal").setAttribute("aria-hidden", "false");
}
function closeExamModal() {
  $("#modal").classList.remove("open");
  $("#modal").setAttribute("aria-hidden", "true");
}
function bindActions() {
  $$("[data-view]").forEach(item => item.addEventListener("click", () => switchView(item.dataset.view)));
  $$('[data-action="start-exam"]').forEach(item => item.addEventListener("click", openExamModal));
  $$('[data-action="continue-learning"]').forEach(item => item.addEventListener("click", () => showToast("Lernmodul „Schützschaltungen“ ausgewählt.")));
  $$('[data-action="start-review"]').forEach(item => item.addEventListener("click", () => showToast("Deine Wiederholungseinheit ist ausgewählt.")));
  $$("[data-subject]").forEach(item => item.addEventListener("click", () => showToast("Lernbereich „" + item.dataset.subject + "“ ausgewählt.")));
}
bindActions();

$("#modal-close").addEventListener("click", closeExamModal);
$("#modal").addEventListener("click", event => { if (event.target === $("#modal")) closeExamModal(); });
$("#modal-start").addEventListener("click", () => {
  closeExamModal();
  showToast("Die Prüfungssimulation wird in einem nächsten Schritt ergänzt.");
});
document.addEventListener("keydown", event => { if (event.key === "Escape") closeExamModal(); });

const date = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
$("#today-date").textContent = date.format(new Date());
refreshIcons();