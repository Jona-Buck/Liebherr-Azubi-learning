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
    const moduleCountBadge = $(".nav-count"); if (moduleCountBadge) moduleCountBadge.textContent = subjects.length;\n    $("#main-content").innerHTML = '<section class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> DEINE AUSBILDUNG</div><h1>Lernmodule</h1><p>Wähle einen Lernbereich deiner technischen Ausbildung.</p></div></section><section class="subject-grid modules-grid">' + subjects.map(s => '<button class="subject-card" data-subject="' + s[0] + '"><span class="subject-top"><span class="subject-icon ' + s[5] + '"><i data-lucide="' + s[2] + '"></i></span><span class="subject-arrow"><i data-lucide="arrow-up-right"></i></span></span><strong>' + s[0] + '</strong><span class="subject-caption">' + s[1] + '</span><span class="subject-progress"><span class="subject-track"><i style="width:' + s[3] + '%"></i></span><b>' + s[3] + ' %</b></span><span class="subject-meta">' + s[4] + '</span></button>').join("") + '</section>';
    refreshIcons(); bindActions(); return;
  }
  if (view === "cards") { renderCardSetup(); return; }

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
    item.addEventListener("click", () => switchView("cards"));
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

const flashTopics=[
{id:"basics",name:"Elektrotechnische Grundlagen",desc:"Spannung, Strom, Widerstand und Leistung",cards:[["Was ist elektrische Spannung?","Die Potentialdifferenz zwischen zwei Punkten. Einheit: Volt (V)."],["Was beschreibt die Stromstärke?","Die elektrische Ladungsmenge, die pro Zeit durch einen Leiterquerschnitt fließt. Einheit: Ampere (A)."],["Wie lautet das Ohmsche Gesetz?","U = R · I. Umgestellt: I = U/R und R = U/I."],["Wie berechnet man elektrische Leistung?","P = U · I. Einheit: Watt (W)."],["Wie berechnet man elektrische Arbeit?","W = P · t. Bei kW und Stunden ergibt sich kWh."]]},
{id:"circuits",name:"Reihen- und Parallelschaltung",desc:"Strom, Spannung und Widerstände",cards:[["Wie verhält sich der Strom in einer Reihenschaltung?","Durch alle Bauteile fließt derselbe Strom."],["Wie verhält sich die Spannung in einer Reihenschaltung?","Die Gesamtspannung teilt sich auf die Bauteile auf."],["Wie verhält sich die Spannung in einer Parallelschaltung?","An allen parallelen Zweigen liegt die gleiche Spannung an."],["Wie teilt sich der Strom in einer Parallelschaltung auf?","Der Gesamtstrom teilt sich auf die Zweige auf; die Teilströme addieren sich."],["Wie berechnet man den Gesamtwiderstand in Reihe?","Rges = R1 + R2 + R3 + …"]]},
{id:"acdc",name:"Gleich- und Wechselstrom",desc:"Frequenz, Periodendauer und Effektivwert",cards:[["Was ist Gleichstrom?","Strom, dessen Richtung gleich bleibt."],["Was ist Wechselstrom?","Strom, dessen Richtung und momentaner Wert sich periodisch ändern."],["Was gibt die Frequenz an?","Die Anzahl der Perioden pro Sekunde. Einheit: Hertz (Hz)."],["Wie hängen Frequenz und Periodendauer zusammen?","f = 1/T und T = 1/f."],["Welche Netzfrequenz hat das Stromnetz in Deutschland?","50 Hz."]]},
{id:"measurement",name:"Messen und Prüfgeräte",desc:"Multimeter und Messverfahren",cards:[["Wie wird ein Spannungsmessgerät angeschlossen?","Parallel zum Bauteil, an dem die Spannung gemessen werden soll."],["Wie wird ein Strommessgerät angeschlossen?","In Reihe, damit der gesamte Messstrom durch das Gerät fließt."],["Warum hat ein Voltmeter einen hohen Innenwiderstand?","Damit es den Stromkreis möglichst wenig belastet."],["Was ist vor einer Widerstandsmessung zu beachten?","Die Schaltung muss spannungsfrei sein."],["Was bedeutet HOLD am Digitalmultimeter?","Der aktuell angezeigte Messwert wird festgehalten."]]},
{id:"safety",name:"Schutzmaßnahmen und Sicherheit",desc:"Fünf Sicherheitsregeln, PE, RCD und Schutzklassen",cards:[["Wie lauten die fünf Sicherheitsregeln?","1. Freischalten. 2. Gegen Wiedereinschalten sichern. 3. Spannungsfreiheit feststellen. 4. Erden und kurzschließen. 5. Benachbarte unter Spannung stehende Teile abdecken oder abschranken."],["Welche Kennfarbe hat der Schutzleiter?","Grün-Gelb."],["Wozu dient ein RCD/FI-Schalter?","Er erkennt einen Differenzstrom zwischen Hin- und Rückleiter und schaltet bei Erreichen seines Auslösewerts ab."],["Was bedeutet Schutzklasse II?","Schutz durch doppelte oder verstärkte Isolierung; kein Schutzleiteranschluss erforderlich."]]},
{id:"semiconductors",name:"Halbleiter und Bauelemente",desc:"Diode, LED, Zenerdiode und Transistor",cards:[["Was ist ein Halbleiter?","Ein Werkstoff, dessen Leitfähigkeit zwischen Leitern und Isolatoren liegt und gezielt beeinflusst werden kann."],["Welche Aufgabe hat eine Diode?","Sie lässt Strom in Durchlassrichtung fließen und sperrt in Sperrrichtung weitgehend."],["Wozu dient eine Zenerdiode?","Zur Spannungsbegrenzung oder Spannungsstabilisierung im Sperrdurchbruchbereich."],["Was ist die Aufgabe einer LED?","Sie wandelt elektrische Energie in Licht um. Eine Strombegrenzung ist erforderlich."],["Wofür wird ein Transistor verwendet?","Zum Beispiel als elektronischer Schalter oder zur Signalverstärkung."]]},
{id:"control",name:"Steuerungs- und Schütztechnik",desc:"Schütz, Kontakte, Selbsthaltung und Verriegelung",cards:[["Was ist ein Schütz?","Ein elektromagnetisch betätigter Schalter, häufig zum Schalten von Motoren."],["Was ist ein Schließer?","Ein Kontakt, der unbetätigt offen ist und beim Betätigen schließt."],["Was ist ein Öffner?","Ein Kontakt, der unbetätigt geschlossen ist und beim Betätigen öffnet."],["Wie funktioniert eine Selbsthalteschaltung?","Ein Schließer-Hilfskontakt liegt parallel zum Starttaster und hält die Schützspule nach dem Start eingeschaltet."],["Wozu dient eine elektrische Verriegelung?","Sie verhindert, dass zwei gegensätzlich wirkende Schütze gleichzeitig anziehen."]]},
{id:"math",name:"Technische Mathematik",desc:"Formeln, Einheiten und Berechnungen",cards:[["Wie viel Watt sind ein Kilowatt?","1 kW = 1.000 W."],["Wie berechnet man den Widerstand?","R = U/I."],["Wie berechnet man die Leistung?","P = U · I."],["Was bedeutet der Vorsatz milli?","Ein Tausendstel: 1 m = 0,001 der Grundeinheit."],["Wie berechnet man die Frequenz aus der Periodendauer?","f = 1/T. Bei T = 0,02 s ist f = 50 Hz."]]},
{id:"equipment",name:"Elektrische Betriebsmittel",desc:"Sicherungen, Motoren, Transformatoren und Leitungen",cards:[["Wovor schützt ein Leitungsschutzschalter?","Er schützt Leitungen vor Überlast und Kurzschluss."],["Welche Aufgabe hat eine Schmelzsicherung?","Sie unterbricht den Stromkreis, wenn der Schmelzleiter durch zu hohen Strom schmilzt."],["Was macht ein Transformator?","Er überträgt Energie durch elektromagnetische Induktion und kann Wechselspannungen herauf- oder herabsetzen."],["Was ist ein Kurzschluss?","Eine unbeabsichtigte niederohmige Verbindung zwischen Punkten unterschiedlicher Spannung, die einen sehr hohen Strom verursachen kann."],["Warum muss der Leitungsquerschnitt passend gewählt werden?","Damit Strombelastbarkeit, Spannungsfall, Erwärmung und mechanische Anforderungen eingehalten werden."]]}
];
let chosenFlashTopics=new Set(flashTopics.map(t=>t.id)),flashRun=null;
function renderCardSetup(){
 const items=flashTopics.map(t=>'<label class="flash-topic"><input type="checkbox" value="'+t.id+'" '+(chosenFlashTopics.has(t.id)?"checked":"")+'><span class="flash-check"><i data-lucide="check"></i></span><span class="flash-topic-copy"><strong>'+t.name+'</strong><small>'+t.desc+'</small></span><span class="flash-topic-count">'+t.cards.length+' Karten</span></label>').join("");
 $("#main-content").innerHTML='<section class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> AP TEIL 1 · ELEKTRONIKER FÜR BETRIEBSTECHNIK</div><h1>Karteikarten</h1><p>Wähle vor dem Start die Themen aus, die du lernen möchtest.</p></div></section><section class="flash-setup panel"><div class="flash-setup-head"><div><span class="section-kicker">DEINE LERNAUSWAHL</span><h2>Themen auswählen</h2><p>Du kannst einzelne Bereiche oder alle Themen bearbeiten.</p></div><div class="flash-topic-tools"><button class="text-link" id="choose-all">Alle auswählen</button><button class="text-link" id="choose-none">Auswahl löschen</button></div></div><div class="flash-topic-grid">'+items+'</div><div class="flash-setup-footer"><span id="flash-count">'+chosenFlashTopics.size+' von '+flashTopics.length+' Themen ausgewählt</span><button class="button button-primary" id="flash-start"><i data-lucide="play"></i> Lernen starten</button></div></section><div class="flash-howto"><span><i data-lucide="mouse-pointer-click"></i> Karte antippen, um die Antwort zu sehen</span><span><i data-lucide="move-horizontal"></i> Links = gewusst · rechts = noch üben</span></div>';
 refreshIcons();
 $$('input[type="checkbox"]',$("#main-content")).forEach(el=>el.addEventListener("change",()=>{if(el.checked)chosenFlashTopics.add(el.value);else chosenFlashTopics.delete(el.value);$("#flash-count").textContent=chosenFlashTopics.size+" von "+flashTopics.length+" Themen ausgewählt";}));
 $("#choose-all").addEventListener("click",()=>{chosenFlashTopics=new Set(flashTopics.map(t=>t.id));renderCardSetup();});
 $("#choose-none").addEventListener("click",()=>{chosenFlashTopics.clear();renderCardSetup();});
 $("#flash-start").addEventListener("click",()=>{const deck=flashTopics.filter(t=>chosenFlashTopics.has(t.id)).flatMap(t=>t.cards.map((c,i)=>({topic:t.name,q:c[0],a:c[1],id:t.id+"-"+i})));if(!deck.length){showToast("Bitte wähle mindestens ein Thema aus.");return;}flashRun={deck,index:0,known:[],wrong:[],flipped:false};renderFlashCard();});
}
function safeFlashText(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderFlashCard(){
 const s=flashRun;if(!s)return renderCardSetup();if(s.index>=s.deck.length)return renderFlashResult();const card=s.deck[s.index];
 $("#main-content").innerHTML='<section class="page-heading flash-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> AP TEIL 1 · LERNEINHEIT</div><h1>Deine Karteikarten</h1><p>Decke die Antwort auf und entscheide, ob du die Karte beherrschst.</p></div><button class="button flash-exit" id="flash-exit">Beenden</button></section><section class="flash-session"><div class="flash-session-top"><span>'+card.topic+'</span><strong>'+(s.index+1)+' <small>/ '+s.deck.length+'</small></strong></div><div class="flash-progress"><i style="width:'+(s.index/s.deck.length*100)+'%"></i></div><div class="flash-stage"><span class="flash-side-hint hint-green">← GEWUSST</span><span class="flash-side-hint hint-red">NOCH ÜBEN →</span><article class="flashcard '+(s.flipped?"flipped":"")+'" id="flashcard" tabindex="0" role="button"><div class="flashcard-inner"><div class="flash-face flash-front"><small>FRAGE</small><strong>'+safeFlashText(card.q)+'</strong><span>Antippen, um die Antwort zu sehen</span></div><div class="flash-face flash-back"><small>ANTWORT</small><strong>'+safeFlashText(card.a)+'</strong><span>Antippen zum Umdrehen</span></div></div></article></div><div class="flash-actions"><button class="flash-rate rate-red" id="flash-wrong" '+(!s.flipped?"disabled":"")+'><i data-lucide="x"></i><span><b>Noch üben</b><small>Nach rechts</small></span></button><button class="flash-flip" id="flash-flip">'+(s.flipped?"Frage anzeigen":"Antwort anzeigen")+'</button><button class="flash-rate rate-green" id="flash-known" '+(!s.flipped?"disabled":"")+'><i data-lucide="check"></i><span><b>Gewusst</b><small>Nach links</small></span></button></div><div class="flash-stats"><span>🟢 '+s.known.length+' gewusst</span><span>🔴 '+s.wrong.length+' noch üben</span><span>'+(s.deck.length-s.index-1)+' Karten übrig</span></div></section>';
 refreshIcons();$("#flash-exit").addEventListener("click",()=>switchView("cards"));$("#flash-flip").addEventListener("click",flipFlashCard);
 let startX=null,suppress=false;const el=$("#flashcard");el.addEventListener("click",()=>{if(suppress){suppress=false;return;}flipFlashCard();});el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();flipFlashCard();}});el.addEventListener("pointerdown",e=>{startX=e.clientX;});el.addEventListener("pointerup",e=>{if(startX===null)return;const dx=e.clientX-startX;startX=null;if(Math.abs(dx)>65){suppress=true;if(!flashRun.flipped)flashRun.flipped=true;markFlashCard(dx<0);}});
 $("#flash-known").addEventListener("click",()=>markFlashCard(true));$("#flash-wrong").addEventListener("click",()=>markFlashCard(false));
}
function flipFlashCard(){if(!flashRun)return;flashRun.flipped=!flashRun.flipped;renderFlashCard();}
function markFlashCard(known){if(!flashRun||!flashRun.flipped)return;const s=flashRun;s[known?"known":"wrong"].push(s.deck[s.index]);s.index++;s.flipped=false;renderFlashCard();}
function renderFlashResult(){
 const s=flashRun,pct=Math.round(s.known.length/s.deck.length*100);
 $("#main-content").innerHTML='<section class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> LERNEINHEIT ABGESCHLOSSEN</div><h1>Gut gemacht!</h1><p>Du hast alle ausgewählten Karteikarten bearbeitet.</p></div></section><section class="flash-results panel"><div class="flash-result-icon"><i data-lucide="graduation-cap"></i></div><span class="section-kicker">DEIN ERGEBNIS</span><h2>'+pct+' % gewusst</h2><p>'+s.known.length+' von '+s.deck.length+' Karten als gewusst markiert.</p><div class="flash-result-bars"><div><span>Gewusst</span><b>'+s.known.length+'</b><i class="result-green"><em style="width:'+(s.known.length/s.deck.length*100)+'%"></em></i></div><div><span>Noch üben</span><b>'+s.wrong.length+'</b><i class="result-red"><em style="width:'+(s.wrong.length/s.deck.length*100)+'%"></em></i></div></div><div class="flash-result-actions">'+(s.wrong.length?'<button class="button button-primary" id="repeat-wrong">Falsche Karten wiederholen ('+s.wrong.length+')</button>':'')+'<button class="button '+(s.wrong.length?"button-secondary":"button-primary")+'" id="repeat-all">Alle Karten wiederholen</button><button class="button button-quiet" id="change-topics">Themen ändern</button></div></section>';
 refreshIcons();if($("#repeat-wrong"))$("#repeat-wrong").addEventListener("click",()=>repeatFlashCards(s.wrong));$("#repeat-all").addEventListener("click",()=>repeatFlashCards(s.deck));$("#change-topics").addEventListener("click",()=>switchView("cards"));
}
function repeatFlashCards(deck){flashRun={deck:deck.slice(),index:0,known:[],wrong:[],flipped:false};renderFlashCard();}
