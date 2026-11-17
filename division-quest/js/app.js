// Division Quest — interactive quiz UI
"use strict";

const $ = s => document.querySelector(s);
const COLORS = ["#ffd166", "#a0e7e5", "#ffaebc", "#b4f8c8", "#c3b1e1", "#fbe7c6",
  "#9ad0f5", "#ffc09f", "#d0f4de", "#fcf6bd", "#e4c1f9"];
const CHEERS = ["Awesome! 🎉", "You got it! ⭐", "Math superstar! 🌟", "Great thinking! 🧠", "Wow, nice work! 🙌", "Perfect! 💯"];
const RETRY = ["Almost! Try again. 💪", "Not quite — check your work. 🔍", "Keep going, you can do it! 🚀"];

const state = {
  lesson: null, count: 10, questions: [], i: 0, attempts: 0, results: [],
  sound: loadPref("sound", true), activeInput: null, locked: false,
};

// ---------- storage (safe) ----------
function loadPref(key, fallback) {
  try { const v = localStorage.getItem("dq-" + key); return v === null ? fallback : JSON.parse(v); }
  catch { return fallback; }
}
function savePref(key, value) {
  try { localStorage.setItem("dq-" + key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ---------- sound ----------
let actx;
function tone(freq, start, dur, type = "triangle", vol = 0.15) {
  if (!state.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    const t = actx.currentTime + start;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(actx.destination);
    o.start(t); o.stop(t + dur);
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
      ${L.id === "mix" ? "" : `<span class="lc-num">Lesson ${L.id}</span>`}
      <span class="lc-title">${L.title}</span>
      <span class="lc-stars" title="Best score">${starStr(best[L.id])}</span>`;
    b.onclick = () => openSetup(L);
    grid.appendChild(b);
  });
  show("home");
}

function openSetup(L) {
  state.lesson = L;
  $("#s-icon").textContent = L.icon;
  $("#s-title").textContent = L.id === "mix" ? L.title : `Lesson ${L.id}: ${L.title}`;
  $("#s-about").textContent = L.about;
  document.querySelectorAll("#count-pick button").forEach(b =>
    b.classList.toggle("on", +b.dataset.n === state.count));
  $("#setup").showModal();
}

// ---------- quiz ----------
function startQuiz() {
  $("#setup").close();
  state.questions = makeTest(state.lesson.id, state.count);
  state.i = 0;
  state.results = [];
  show("quiz");
  renderQuestion();
}

function renderQuestion() {
  const Q = state.questions[state.i];
  const total = state.questions.length;
  state.attempts = 0;
  state.locked = false;
  $("#q-lesson").textContent = `Lesson ${Q.lesson}`;
  $("#q-count").textContent = `Question ${state.i + 1} of ${total}`;
  $("#q-score").textContent = `⭐ ${state.results.filter(r => r.correct).length}`;
  $("#q-progress").style.width = (state.i / total) * 100 + "%";
  $("#q-prompt").innerHTML = Q.prompt;
  $("#q-visual").innerHTML = Q.visual || "";
  $("#q-feedback").textContent = "";
  $("#q-feedback").className = "feedback";
  $("#q-hint").hidden = true;
  $("#q-hint").innerHTML = "💡 " + Q.hint;
  $("#q-steps").hidden = true;
  $("#hint-btn").hidden = false;
  $("#check-btn").hidden = Q.type === "choice";
  $("#next-btn").hidden = true;
  $("#keypad").hidden = Q.type === "choice";

  const area = $("#q-answer");
  if (Q.type === "number") {
    area.innerHTML = `<div class="ans-box"><label for="ans-main">Answer</label>
      <input id="ans-main" class="ans" inputmode="none" autocomplete="off" placeholder="?"></div>`;
  } else if (Q.type === "qr") {
    area.innerHTML = `<div class="ans-box"><label for="ans-q">Quotient</label>
        <input id="ans-q" class="ans" inputmode="none" autocomplete="off" placeholder="?"></div>
      <span class="r-label">R</span>
      <div class="ans-box"><label for="ans-r">Remainder</label>
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
  if (state.activeInput && !matchMedia("(pointer: coarse)").matches) state.activeInput.focus();
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

function check(choiceIdx, choiceBtn) {
  if (state.locked) return;
  const Q = state.questions[state.i];
  const a = Q.type === "choice" ? choiceIdx : readAnswer(Q);
  if (a === null) {
    const card = $(".question-card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
    $("#q-feedback").textContent = "Type your answer first! ✏️";
    $("#q-feedback").className = "feedback bad";
    return;
  }
  state.attempts++;
  const ok = isRight(Q, a);
  const fb = $("#q-feedback");
  const inputs = document.querySelectorAll("#q-answer input");

  if (ok) {
    fb.textContent = state.attempts === 1 ? pickOne(CHEERS) : "You fixed it — great job! 👍";
    fb.className = "feedback good";
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
    fb.textContent = pickOne(RETRY);
    fb.className = "feedback bad";
    $("#q-hint").hidden = false;
    $("#hint-btn").hidden = true;
    setTimeout(() => inputs.forEach(i => i.classList.remove("wrong")), 700);
    if (inputs[0]) { inputs[0].select(); state.activeInput = inputs[0]; }
  } else {
    fb.innerHTML = `The answer is <b>${Q.answerText}</b>. Let's see how! 👇`;
    fb.className = "feedback bad";
    if (Q.type === "choice") document.querySelectorAll(".choice")[Q.answer].classList.add("right");
    finishQuestion(false, a);
  }
}

function finishQuestion(correct, given) {
  const Q = state.questions[state.i];
  state.locked = true;
  state.results.push({ correct, firstTry: correct && state.attempts === 1, given });
  document.querySelectorAll("#q-answer input, .choice").forEach(el => (el.disabled = true));
  $("#q-steps").innerHTML = stepsHTML(Q);
  $("#q-steps").hidden = false;
  $("#check-btn").hidden = true;
  $("#hint-btn").hidden = true;
  $("#keypad").hidden = true;
  $("#next-btn").hidden = false;
  $("#next-btn").textContent = state.i === state.questions.length - 1 ? "See my score 🏁" : "Next ➜";
  $("#next-btn").focus();
  $("#q-score").textContent = `⭐ ${state.results.filter(r => r.correct).length}`;
}

function stepsHTML(Q) {
  return `<h4>🦉 How to solve it</h4><ol>${Q.steps.map(s => `<li>${s}</li>`).join("")}</ol>`;
}

function next() {
  if (state.i < state.questions.length - 1) {
    state.i++;
    renderQuestion();
  } else {
    showResults();
  }
}

const pickOne = a => a[Math.floor(Math.random() * a.length)];

// ---------- results ----------
function showResults() {
  const total = state.questions.length;
  const right = state.results.filter(r => r.correct).length;
  const pct = right / total;
  const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;

  const best = loadPref("best", {});
  if (stars > (best[state.lesson.id] || 0)) { best[state.lesson.id] = stars; savePref("best", best); }

  $("#r-stars").innerHTML = [0, 1, 2].map(k => `<span>${k < stars ? "⭐" : "☆"}</span>`).join("");
  $("#r-title").textContent = ["Good try! Let's practice more! 💪", "Nice work! 👍", "Great job! 🎉", "Amazing! You're a division champion! 🏆"][stars];
  const first = state.results.filter(r => r.firstTry).length;
  $("#r-score").textContent = `You got ${right} out of ${total} right (${first} on the first try).`;

  $("#r-review").innerHTML = state.questions.map((Q, k) => {
    const r = state.results[k];
    return `<div class="review-item ${r.correct ? "" : "missed"}">
      <div class="ri-q">${k + 1}. ${Q.prompt}</div>
      <div class="ri-a">${r.correct ? "✅" : "❌"} Your answer: ${showAnswerText(Q, r.given)}
        ${r.correct ? "" : ` · Correct answer: <b>${Q.answerText}</b>`}</div>
      <details ${r.correct ? "" : "open"}><summary>How to solve it</summary><div class="steps">${stepsHTML(Q)}</div></details>
    </div>`;
  }).join("");

  show("results");
  if (stars >= 2) { sfx.win(); burst(["🏆", "⭐", "🎉", "🌟", "🥳"], 30); }
}

// ---------- printable worksheet ----------
function printWorksheet() {
  const L = state.lesson;
  const qs = makeTest(L.id, state.count);
  const title = L.id === "mix" ? L.title : `Lesson ${L.id}: ${L.title}`;
  const answerLine = Q => Q.type === "choice"
    ? `<div class="ws-choices">${Q.choices.map((c, k) => `<span>${"ABCD"[k]}) ${c}</span>`).join("")}</div>`
    : Q.type === "qr" ? `<div class="ws-line">Quotient: ________ &nbsp; R ________</div>` : `<div class="ws-line"></div>`;
  $("#print-area").innerHTML = `
    <div class="ws-head"><b>Name: ______________________</b><b>Date: ____________</b></div>
    <h2>🦉 Division Quest — ${title}</h2>
    ${qs.map((Q, k) => `<div class="ws-q"><b>${k + 1}.</b> ${Q.prompt}${Q.visual || ""}${answerLine(Q)}</div>`).join("")}
    <div class="ws-key"><h2>Answer Key — ${title}</h2>
      <ol>${qs.map(Q => `<li>${Q.type === "choice" ? "ABCD"[Q.answer] + ") " : ""}${Q.answerText}</li>`).join("")}</ol></div>`;
  $("#setup").close();
  setTimeout(() => window.print(), 100);
}

// ---------- wiring ----------
function updateSoundBtn() { $("#sound-btn").textContent = state.sound ? "🔊" : "🔇"; }

$("#sound-btn").onclick = () => { state.sound = !state.sound; savePref("sound", state.sound); updateSoundBtn(); };
$("#go-home").onclick = renderHome;
$("#menu-btn").onclick = renderHome;
$("#again-btn").onclick = () => { state.questions = makeTest(state.lesson.id, state.count); state.i = 0; state.results = []; show("quiz"); renderQuestion(); };
$("#start-btn").onclick = startQuiz;
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

updateSoundBtn();
renderHome();
