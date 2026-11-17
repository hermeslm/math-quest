// Division Quest — interactive quiz UI (English / Español)
"use strict";

const $ = s => document.querySelector(s);
const COLORS = ["#ffd166", "#a0e7e5", "#ffaebc", "#b4f8c8", "#c3b1e1", "#fbe7c6",
  "#9ad0f5", "#ffc09f", "#d0f4de", "#fcf6bd", "#e4c1f9"];

// ---------- storage (safe) ----------
function loadPref(key, fallback) {
  try { const v = localStorage.getItem("dq-" + key); return v === null ? fallback : JSON.parse(v); }
  catch { return fallback; }
}
function savePref(key, value) {
  try { localStorage.setItem("dq-" + key, JSON.stringify(value)); } catch { /* ignore */ }
}

const browserLang = (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";

const state = {
  lang: LANGS[loadPref("lang", browserLang)] ? loadPref("lang", browserLang) : "en",
  lesson: null, count: 10,
  questions: [],   // [{en: Q, es: Q}, ...] — same numbers in every language
  i: 0, attempts: 0, results: [],
  sound: loadPref("sound", true), activeInput: null, locked: false,
  feedback: null,  // {cls, text: () => string} so it can be re-translated
};

// ---------- i18n ----------
function t(key, ...args) {
  const v = LANGS[state.lang].ui[key] ?? LANGS.en.ui[key];
  return typeof v === "function" ? v(...args) : v;
}
const lessonText = id => LANGS[state.lang].lessons[id];
const lessonTitle = L => (L.id === "mix" ? lessonText(L.id).title : t("lessonTitle", L.id, lessonText(L.id).title));
const cur = () => state.questions[state.i][state.lang];
const qAt = k => state.questions[k][state.lang];

function applyStaticText() {
  document.documentElement.lang = state.lang;
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach(el => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-html]").forEach(el => (el.innerHTML = t(el.dataset.i18nHtml)));
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.dataset.i18nTitle);
    el.setAttribute("aria-label", el.title);
  });
  $("#lang-btn").textContent = LANGS[state.lang].switchTo;
}

function setLang(lang) {
  state.lang = lang;
  savePref("lang", lang);
  applyStaticText();
  if ($("#setup").open) fillSetup();
  if (!$("#home").hidden) renderHome();
  else if (!$("#help").hidden) renderHelp(state.lesson);
  else if (!$("#quiz").hidden) refreshQuestionText();
  else if (!$("#results").hidden) renderResults();
}

// ---------- sound ----------
let actx;
function tone(freq, start, dur, type = "triangle", vol = 0.15) {
  if (!state.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    const tt = actx.currentTime + start;
    g.gain.setValueAtTime(vol, tt);
    g.gain.exponentialRampToValueAtTime(0.001, tt + dur);
    o.connect(g).connect(actx.destination);
    o.start(tt); o.stop(tt + dur);
  } catch { /* no audio */ }
}
const sfx = {
  good: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.18)),
  bad: () => { tone(260, 0, 0.2, "sine"); tone(200, 0.15, 0.3, "sine"); },
  win: () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25)),
  tap: () => tone(880, 0, 0.05, "sine", 0.05),
};

function burst(emojis = ["⭐", "🎉", "✨", "🌟"], n = 18) {
  const x = window.innerWidth / 2, y = window.innerHeight / 2.5;
  for (let k = 0; k < n; k++) {
    const s = document.createElement("span");
    s.className = "burst";
    s.textContent = emojis[k % emojis.length];
    s.style.left = x + "px"; s.style.top = y + "px";
    s.style.setProperty("--dx", (Math.random() - 0.5) * 600 + "px");
    s.style.setProperty("--dy", (Math.random() - 0.7) * 500 + "px");
    s.style.setProperty("--rot", (Math.random() - 0.5) * 720 + "deg");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

// ---------- screens ----------
function show(id) {
  document.querySelectorAll(".screen").forEach(s => (s.hidden = s.id !== id));
  window.scrollTo(0, 0);
}

const starStr = n => "⭐".repeat(n || 0) + "☆".repeat(3 - (n || 0));

function renderHome() {
  const best = loadPref("best", {});
  const grid = $("#lesson-grid");
  grid.innerHTML = "";
  [...LESSONS, MIXED].forEach((L, idx) => {
    const b = document.createElement("button");
    b.className = "lesson-card" + (L.id === "mix" ? " mix" : "");
    b.style.setProperty("--c", L.id === "mix" ? "#ffb703" : COLORS[idx % COLORS.length]);
    b.innerHTML = `<span class="lc-icon">${L.icon}</span>
      ${L.id === "mix" ? "" : `<span class="lc-num">${t("lesson", L.id)}</span>`}
      <span class="lc-title">${lessonText(L.id).title}</span>
      <span class="lc-stars" title="${t("bestScore")}">${starStr(best[L.id])}</span>`;
    b.onclick = () => openSetup(L);
    grid.appendChild(b);
  });
  show("home");
}

function fillSetup() {
  const L = state.lesson;
  $("#s-icon").textContent = L.icon;
  $("#s-title").textContent = lessonTitle(L);
  $("#s-about").textContent = lessonText(L.id).about;
  const help = helpFor(L.id);
  $("#setup-help").hidden = !help;
  if (help) {
    $("#anim-btn").hidden = !help.animation;
    if (help.animation) $("#anim-btn").href = help.animation;
  }
}

function openSetup(L) {
  state.lesson = L;
  fillSetup();
  document.querySelectorAll("#count-pick button").forEach(b =>
    b.classList.toggle("on", +b.dataset.n === state.count));
  $("#setup").showModal();
}

// ---------- help at home (parent guide) ----------
function helpFor(id) {
  if (typeof LESSON_HELP === "undefined" || !LESSON_HELP[id]) return null;
  return LESSON_HELP[id][state.lang] || LESSON_HELP[id].en;
}

function renderHelp(L) {
  const H = helpFor(L.id);
  if (!H) return;
  state.lesson = L;
  $("#h-icon").textContent = L.icon;
  $("#h-title").textContent = lessonTitle(L);
  $("#h-about").textContent = lessonText(L.id).about;
  const media = [];
  if (H.animation) media.push(`<a class="btn primary" href="${H.animation}" target="_blank" rel="noopener">${t("vla")}</a>`);
  if (H.video) media.push(`<a class="btn ghost" href="${H.video}" target="_blank" rel="noopener">${t("alv")}</a>`);
  $("#h-media").innerHTML = media.length ? media.join("") : `<p class="muted">${t("noAnimation")}</p>`;
  $("#h-guide").innerHTML = t("guide").map(g => `<li>${g}</li>`).join("");
  $("#h-mathhelp-card").hidden = !H.mathHelp.length;
  $("#h-mathhelp").innerHTML = H.mathHelp.map(m => `<h4>${m.title}</h4>${m.html}`).join("");
  $("#h-act-title").textContent = H.activity.title;
  $("#h-activity").innerHTML = H.activity.html;
  $("#h-source").href = H.page;
  show("help");
}

// ---------- quiz ----------
function newTest() {
  state.questions = makeBilingualTest(state.lesson.id, state.count);
  state.i = 0;
  state.results = [];
  show("quiz");
  renderQuestion();
}

function startQuiz() {
  $("#setup").close();
  newTest();
}

function renderQuestion() {
  const Q = cur();
  state.attempts = 0;
  state.locked = false;
  state.feedback = null;
  $("#q-progress").style.width = (state.i / state.questions.length) * 100 + "%";
  $("#q-score").textContent = `⭐ ${state.results.filter(r => r.correct).length}`;
  $("#q-hint").hidden = true;
  $("#q-steps").hidden = true;
  $("#hint-btn").hidden = false;
  $("#check-btn").hidden = Q.type === "choice";
  $("#next-btn").hidden = true;
  $("#keypad").hidden = Q.type === "choice";

  const area = $("#q-answer");
  if (Q.type === "number") {
    area.innerHTML = `<div class="ans-box"><label for="ans-main"></label>
      <input id="ans-main" class="ans" inputmode="none" autocomplete="off" placeholder="?"></div>`;
  } else if (Q.type === "qr") {
    area.innerHTML = `<div class="ans-box"><label for="ans-q"></label>
        <input id="ans-q" class="ans" inputmode="none" autocomplete="off" placeholder="?"></div>
      <span class="r-label">R</span>
      <div class="ans-box"><label for="ans-r"></label>
        <input id="ans-r" class="ans small" inputmode="none" autocomplete="off" placeholder="0"></div>`;
  } else {
    area.innerHTML = `<div class="choices">${Q.choices.map((c, k) =>
      `<button class="choice" data-k="${k}">${c}</button>`).join("")}</div>`;
    area.querySelectorAll(".choice").forEach(b => (b.onclick = () => check(+b.dataset.k, b)));
  }
  const inputs = area.querySelectorAll("input");
  inputs.forEach(inp => {
    inp.addEventListener("focus", () => (state.activeInput = inp));
    inp.addEventListener("input", () => (inp.value = inp.value.replace(/[^\d]/g, "").slice(0, 6)));
  });
  state.activeInput = inputs[0] || null;
  refreshQuestionText();
  if (state.activeInput && !matchMedia("(pointer: coarse)").matches) state.activeInput.focus();
}

// Everything on the quiz screen that depends on the language.
function refreshQuestionText() {
  const Q = cur();
  $("#q-lesson").textContent = t("lesson", Q.lesson);
  $("#q-count").textContent = t("questionOf", state.i + 1, state.questions.length);
  $("#q-prompt").innerHTML = Q.prompt;
  $("#q-visual").innerHTML = Q.visual || "";
  $("#q-hint").innerHTML = "💡 " + Q.hint;
  const labels = { "ans-main": "answer", "ans-q": "quotient", "ans-r": "remainder" };
  Object.entries(labels).forEach(([id, key]) => {
    const l = document.querySelector(`label[for="${id}"]`);
    if (l) l.textContent = t(key);
  });
  const fb = $("#q-feedback");
  fb.innerHTML = state.feedback ? state.feedback.text() : "";
  fb.className = "feedback " + (state.feedback ? state.feedback.cls : "");
  if (state.locked) {
    const last = state.results[state.results.length - 1];
    $("#q-steps").innerHTML = stepsHTML(Q, !last.correct);
  }
  $("#next-btn").textContent = state.i === state.questions.length - 1 ? t("seeScore") : t("next");
}

function setFeedback(cls, text) {
  state.feedback = { cls, text };
  $("#q-feedback").innerHTML = text();
  $("#q-feedback").className = "feedback " + cls;
}

const num = v => (v.trim() === "" ? null : parseInt(v, 10));

function readAnswer(Q) {
  if (Q.type === "number") return num($("#ans-main").value);
  if (Q.type === "qr") {
    const q = num($("#ans-q").value);
    if (q === null) return null;
    return { q, r: num($("#ans-r").value) ?? 0 };
  }
  return null;
}

function isRight(Q, a) {
  if (Q.type === "qr") return a.q === Q.answer.q && a.r === Q.answer.r;
  return a === Q.answer;
}

function showAnswerText(Q, a) {
  if (a === null || a === undefined) return "—";
  if (Q.type === "qr") return `${fmt(a.q)} R ${a.r}`;
  if (Q.type === "choice") return Q.choices[a];
  return fmt(a);
}

const randIdx = arr => Math.floor(Math.random() * arr.length);

function check(choiceIdx, choiceBtn) {
  if (state.locked) return;
  const Q = cur();
  const a = Q.type === "choice" ? choiceIdx : readAnswer(Q);
  if (a === null) {
    const card = $(".question-card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
    setFeedback("bad", () => t("typeFirst"));
    return;
  }
  state.attempts++;
  const inputs = document.querySelectorAll("#q-answer input");

  if (isRight(Q, a)) {
    const k = randIdx(t("cheers"));
    setFeedback("good", state.attempts === 1 ? () => t("cheers")[k] : () => t("fixedIt"));
    inputs.forEach(i => i.classList.add("right"));
    if (choiceBtn) choiceBtn.classList.add("right");
    sfx.good();
    if (state.attempts === 1) burst();
    finishQuestion(true, a);
    return;
  }

  sfx.bad();
  inputs.forEach(i => i.classList.add("wrong"));
  if (choiceBtn) { choiceBtn.classList.add("wrong"); choiceBtn.disabled = true; }

  if (state.attempts < 2) {
    const k = randIdx(t("retry"));
    setFeedback("bad", () => t("retry")[k]);
    $("#q-hint").hidden = false;
    $("#hint-btn").hidden = true;
    setTimeout(() => inputs.forEach(i => i.classList.remove("wrong")), 700);
    if (inputs[0]) { inputs[0].select(); state.activeInput = inputs[0]; }
  } else {
    setFeedback("bad", () => t("theAnswerIs", cur().answerText));
    if (Q.type === "choice") document.querySelectorAll(".choice")[Q.answer].classList.add("right");
    finishQuestion(false, a);
  }
}

function finishQuestion(correct, given) {
  state.locked = true;
  state.results.push({ correct, firstTry: correct && state.attempts === 1, given });
  document.querySelectorAll("#q-answer input, .choice").forEach(el => (el.disabled = true));
  $("#q-steps").hidden = false;
  $("#check-btn").hidden = true;
  $("#hint-btn").hidden = true;
  $("#keypad").hidden = true;
  $("#next-btn").hidden = false;
  refreshQuestionText();
  $("#next-btn").focus();
  $("#q-score").textContent = `⭐ ${state.results.filter(r => r.correct).length}`;
}

function stepsHTML(Q, withVideo) {
  const H = withVideo && helpFor(Q.lesson);
  const watch = H && H.animation
    ? `<a class="watch-link" href="${H.animation}" target="_blank" rel="noopener">${t("watchAnimation", Q.lesson)}</a>` : "";
  return `<h4>${t("howToSolve")}</h4><ol>${Q.steps.map(s => `<li>${s}</li>`).join("")}</ol>${watch}`;
}

function next() {
  if (state.i < state.questions.length - 1) {
    state.i++;
    renderQuestion();
  } else {
    showResults();
  }
}

// ---------- results ----------
function starsFor() {
  const right = state.results.filter(r => r.correct).length;
  const pct = right / state.questions.length;
  return pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
}

function showResults() {
  const stars = starsFor();
  const best = loadPref("best", {});
  if (stars > (best[state.lesson.id] || 0)) { best[state.lesson.id] = stars; savePref("best", best); }
  renderResults();
  show("results");
  if (stars >= 2) { sfx.win(); burst(["🏆", "⭐", "🎉", "🌟", "🥳"], 30); }
}

function renderResults() {
  const total = state.questions.length;
  const right = state.results.filter(r => r.correct).length;
  const first = state.results.filter(r => r.firstTry).length;
  const stars = starsFor();
  $("#r-stars").innerHTML = [0, 1, 2].map(k => `<span>${k < stars ? "⭐" : "☆"}</span>`).join("");
  $("#r-title").textContent = t("resultTitles")[stars];
  $("#r-score").textContent = t("resultScore", right, total, first);
  $("#r-review").innerHTML = state.questions.map((_, k) => {
    const Q = qAt(k), r = state.results[k];
    return `<div class="review-item ${r.correct ? "" : "missed"}">
      <div class="ri-q">${k + 1}. ${Q.prompt}</div>
      <div class="ri-a">${r.correct ? "✅" : "❌"} ${t("yourAnswer")} ${showAnswerText(Q, r.given)}
        ${r.correct ? "" : ` · ${t("correctAnswer")} <b>${Q.answerText}</b>`}</div>
      <details ${r.correct ? "" : "open"}><summary>${t("howToSolvePlain")}</summary><div class="steps">${stepsHTML(Q, !r.correct)}</div></details>
    </div>`;
  }).join("");
}

// ---------- printable worksheet ----------
function printWorksheet() {
  const L = state.lesson;
  const qs = makeTest(L.id, state.count, state.lang);
  const title = lessonTitle(L);
  const answerLine = Q => Q.type === "choice"
    ? `<div class="ws-choices">${Q.choices.map((c, k) => `<span>${"ABCD"[k]}) ${c}</span>`).join("")}</div>`
    : Q.type === "qr" ? `<div class="ws-line">${t("wsQuotient")} ________ &nbsp; R ________</div>` : `<div class="ws-line"></div>`;
  $("#print-area").innerHTML = `
    <div class="ws-head"><b>${t("wsName")} ______________________</b><b>${t("wsDate")} ____________</b></div>
    <h2>${t("appName")} — ${title}</h2>
    ${qs.map((Q, k) => `<div class="ws-q"><b>${k + 1}.</b> ${Q.prompt}${Q.visual || ""}${answerLine(Q)}</div>`).join("")}
    <div class="ws-key"><h2>${t("answerKey")} — ${title}</h2>
      <ol>${qs.map(Q => `<li>${Q.type === "choice" ? "ABCD"[Q.answer] + ") " : ""}${Q.answerText}</li>`).join("")}</ol></div>`;
  $("#setup").close();
  setTimeout(() => window.print(), 100);
}

// ---------- wiring ----------
function updateSoundBtn() { $("#sound-btn").textContent = state.sound ? "🔊" : "🔇"; }

$("#lang-btn").onclick = () => setLang(state.lang === "en" ? "es" : "en");
$("#sound-btn").onclick = () => { state.sound = !state.sound; savePref("sound", state.sound); updateSoundBtn(); };
$("#go-home").onclick = renderHome;
$("#menu-btn").onclick = renderHome;
$("#again-btn").onclick = newTest;
$("#start-btn").onclick = startQuiz;
$("#help-btn").onclick = () => { $("#setup").close(); renderHelp(state.lesson); };
$("#help-start").onclick = () => openSetup(state.lesson);
$("#help-back").onclick = renderHome;
$("#print-btn").onclick = printWorksheet;
$("#check-btn").onclick = () => check();
$("#next-btn").onclick = next;
$("#hint-btn").onclick = () => { $("#q-hint").hidden = false; $("#hint-btn").hidden = true; };
$("#setup").addEventListener("click", e => { if (e.target === $("#setup")) $("#setup").close(); });

document.querySelectorAll("#count-pick button").forEach(b => (b.onclick = () => {
  state.count = +b.dataset.n;
  document.querySelectorAll("#count-pick button").forEach(x => x.classList.toggle("on", x === b));
}));

document.querySelectorAll("#keypad button").forEach(b => (b.onclick = () => {
  const k = b.dataset.k, inp = state.activeInput;
  sfx.tap();
  if (k === "enter") return check();
  if (!inp || inp.disabled) return;
  if (k === "back") inp.value = inp.value.slice(0, -1);
  else if (inp.value.length < 6) inp.value += k;
}));

document.addEventListener("keydown", e => {
  if ($("#quiz").hidden || e.key !== "Enter") return;
  e.preventDefault();
  if (!$("#next-btn").hidden) next();
  else if (!$("#check-btn").hidden) check();
});

applyStaticText();
updateSoundBtn();
renderHome();
