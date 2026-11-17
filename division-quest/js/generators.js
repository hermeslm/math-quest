// Division Quest — random question generators for enVision Grade 4, Topic 5.
//
// All the math lives here; all the words live in the language packs
// (js/lang/en.js, js/lang/es.js) and are reached through `X`.
// A seeded random generator is used so the SAME test can be built in every
// language: the numbers match and only the words change.
//
// Each generator returns a question object:
// { lesson, prompt, type: 'number'|'qr'|'choice', answer, choices?, answerText,
//   hint, steps: [html lines], visual?: html }
"use strict";

let rnd = Math.random; // replaced by a seeded generator in makeTest()
let X = null;          // active language pack (LANGS[lang].gen)

const rand = (a, b) => Math.floor(rnd() * (b - a + 1)) + a;
const pick = arr => arr[Math.floor(rnd() * arr.length)];
const chance = p => rnd() < p;
const fmt = n => Number(n).toLocaleString("en-US"); // US format (1,800) in both languages, like the school books
const NAMES = ["Ned", "Mia", "Leo", "Ava", "Sam", "Zoe", "Max", "Lily", "Omar",
  "Emma", "Noah", "Sofia", "Eli", "Nora", "Luis", "Maya", "Diego", "Lucía"];

function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build 4 unique positive-integer choices; returns {choices, answer, answerText}
function makeChoices(correct, candidates) {
  const set = [correct];
  for (const c of candidates) {
    if (set.length === 4) break;
    if (c > 0 && Number.isInteger(c) && !set.includes(c)) set.push(c);
  }
  let k = 2;
  while (set.length < 4) {
    const c = correct * k++;
    if (!set.includes(c)) set.push(c);
  }
  const shuffled = shuffle(set);
  return { choices: shuffled.map(fmt), answer: shuffled.indexOf(correct), answerText: fmt(correct) };
}

const tag = t => `<span class="tag">${t}</span> `;

// ---------- worked-solution helpers ----------

function partialQuotientSteps(n, d) {
  const lines = [];
  const parts = [];
  let rem = n;
  while (rem >= d) {
    let p = 1;
    while (d * p * 10 <= rem) p *= 10;
    const pq = Math.floor(rem / (d * p)) * p;
    const prod = d * pq;
    lines.push(X.pqTry(d, rem, pq, prod, rem - prod));
    parts.push(pq);
    rem -= prod;
  }
  const q = parts.reduce((s, x) => s + x, 0);
  if (parts.length > 1) lines.push(X.pqAdd(parts.map(fmt).join(" + "), q));
  lines.push(rem ? X.pqRem(rem, d) : X.pqNoRem());
  lines.push(X.check(d, q, rem, n));
  return lines;
}

// place index: 0 ones, 1 tens, 2 hundreds, 3 thousands, 4 ten thousands
function sharingSteps(n, d) {
  const digits = String(n).split("").map(Number);
  const L = digits.length;
  const lines = [];
  let carry = 0, started = false;
  digits.forEach((dig, i) => {
    const place = L - 1 - i, next = place - 1;
    const cur = carry * 10 + dig;
    const each = Math.floor(cur / d);
    const left = cur - each * d;
    if (!started && each === 0 && i < L - 1) {
      lines.push(X.notEnough(X.pv(cur, place), d, X.pv(cur * 10, next)));
    } else {
      started = true;
      lines.push(X.share(X.pv(cur, place), d, `<b>${each}</b> ${X.unit(each, place)}`, left,
        left && i < L - 1 ? X.pv(left * 10, next) : null, X.pv(left, place)));
    }
    carry = left;
  });
  lines.push(X.eachGets(Math.floor(n / d), n % d));
  return lines;
}

// Place-value blocks picture (numbers below 1,000)
function blocksHTML(n) {
  if (n >= 1000) return placeChartHTML(n);
  const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
  const rep = (cls, k) => `<span class="${cls}"></span>`.repeat(k);
  return `<div class="blocks" aria-label="${X.pv(h, 2)}, ${X.pv(t, 1)}, ${X.pv(o, 0)}">
    ${h ? `<div class="blk-group">${rep("blk-h", h)}</div>` : ""}
    ${t ? `<div class="blk-group">${rep("blk-t", t)}</div>` : ""}
    ${o ? `<div class="blk-group ones">${rep("blk-o", o)}</div>` : ""}
  </div>`;
}

function placeChartHTML(n) {
  const digits = String(n).split("");
  const names = digits.map((_, i) => X.unit(2, digits.length - 1 - i));
  return `<table class="pv-chart"><tr>${names.map(p => `<th>${p}</th>`).join("")}</tr>
    <tr>${digits.map(x => `<td>${x}</td>`).join("")}</tr></table>`;
}

// Picture of n items split into groups of d (for small n)
function groupsHTML(n, d, icon) {
  const q = Math.floor(n / d), r = n % d;
  let html = `<div class="groups">`;
  for (let g = 0; g < q; g++) html += `<div class="grp">${icon.repeat(d)}</div>`;
  if (r) html += `<div class="grp leftover">${icon.repeat(r)}</div>`;
  return html + `</div>`;
}

// ---------- lesson generators ----------

// 5-1 Mental Math: Find Quotients (multiples of 10 and 100 ÷ 1-digit)
function gen51() {
  const d = rand(2, 9), q = rand(2, 9), k = pick([1, 2]);
  const f = d * q, n = f * 10 ** k, ans = q * 10 ** k;
  const story = chance(0.3);
  const N = pick(NAMES), S = pick(X.exactStories);
  return {
    prompt: story ? S(n, d, N) : `${fmt(n)} ÷ ${d} = ?`,
    type: "number", answer: ans, answerText: fmt(ans),
    hint: X.g51hint(f, d, n, k),
    steps: X.g51steps(f, d, q, n, ans, k),
  };
}

// 5-2 Mental Math: Estimate Quotients (compatible numbers)
function gen52() {
  const d = rand(3, 9), q = rand(2, 9), s = pick([10, 10, 100]);
  const compat = d * q * s;
  const off = rand(1, Math.floor(d * s / 3)) * (chance(0.5) ? 1 : -1);
  const n = compat + off, est = q * s;
  if (chance(0.5)) {
    const c = makeChoices(est, shuffle([(q + 1) * s, (q - 1) * s, est * 10, est / 10]));
    return {
      prompt: tag(X.tagEstimate) + X.aboutHowMuch(n, d),
      type: "choice", ...c,
      hint: X.g52hint(n, d),
      steps: X.g52steps(n, d, q, compat, est),
    };
  }
  const rounded = Math.round(n / s) * s;
  // Near-by distractors must NOT divide evenly by d, so there is only one best answer.
  const near = [rounded, rounded + s, rounded - s, rounded + 2 * s, rounded - 2 * s].filter(x => x % d !== 0);
  const c = makeChoices(compat, [...shuffle(near).slice(0, 2), compat + d * s, compat - d * s]);
  return {
    prompt: tag(X.tagCompatible) + X.whichCompatible(n, d),
    type: "choice", ...c,
    hint: X.g52compatHint(n, d),
    steps: X.g52compatSteps(n, d, q, compat, est),
  };
}

// 5-3 Interpret Remainders
function gen53() {
  const d = rand(3, 9), q = rand(3, 12), r = rand(1, d - 1);
  const n = d * q + r, N = pick(NAMES), S = pick(X.remainderStories);
  const kind = pick(["up", "down", "rem"]);
  const ans = kind === "up" ? q + 1 : kind === "down" ? q : r;
  const steps = [X.g53first(n, d, q, r)];
  if (n <= 60) steps.push(groupsHTML(n, d, S.icon));
  steps.push(kind === "up" ? S.upStep(q, r) : kind === "down" ? S.downStep(q) : S.remStep(r));
  return {
    prompt: `${S.setup(n, d, N)} <b>${S[kind](N)}</b>`,
    type: "number", answer: ans, answerText: fmt(ans),
    hint: X.g53hint(n, d),
    steps,
  };
}

function qrQuestion(n, d, opts = {}) {
  const q = Math.floor(n / d), r = n % d;
  const N = pick(NAMES), S = pick(X.leftoverStories);
  return {
    prompt: opts.story ? S(n, d, N) : `${opts.label ? tag(opts.label) : ""}${fmt(n)} ÷ ${d} = ?`,
    type: "qr", answer: { q, r }, answerText: `${fmt(q)} R ${r}`,
    hint: opts.hint || X.qrHint(n, d),
    steps: opts.method === "sharing" ? sharingSteps(n, d) : partialQuotientSteps(n, d),
    visual: opts.visual,
  };
}

function dividendFor(d, min, max, wantRemainder) {
  const q = rand(Math.ceil(min / d), Math.floor((max - d + 1) / d));
  const r = wantRemainder ? rand(1, d - 1) : 0;
  return d * q + r;
}

// 5-4 Use Partial Quotients to Divide (2- and 3-digit dividends)
function gen54() {
  const d = rand(2, 9);
  if (chance(0.3)) {
    const n = dividendFor(d, 30, 999, false), q = n / d;
    return {
      prompt: X.airplane(n, d),
      type: "number", answer: q, answerText: fmt(q),
      hint: X.airplaneHint(n, d),
      steps: partialQuotientSteps(n, d),
    };
  }
  return qrQuestion(dividendFor(d, d * 10, 999, chance(0.5)), d, { label: X.tagPartial });
}

// 5-5 Partial Quotients: Greater Dividends (4-digit)
function gen55() {
  const d = rand(2, 9);
  const n = dividendFor(d, 1000, 9999, chance(0.5));
  return qrQuestion(n, d, { story: chance(0.3), label: X.tagPartial });
}

// 5-6 Use Sharing to Divide (place-value blocks)
function gen56() {
  const d = rand(2, 6);
  const n = dividendFor(d, d * 10, 999, chance(0.5));
  return qrQuestion(n, d, { story: chance(0.4), method: "sharing", visual: blocksHTML(n), hint: X.g56hint });
}

// 5-7 Continue Sharing to Divide (3–4 digit, zeros in the quotient)
function gen57() {
  const d = rand(2, 9);
  let n;
  for (let tries = 0; tries < 200; tries++) {
    n = dividendFor(d, 100, 9999, chance(0.5));
    if (!chance(0.5) || String(Math.floor(n / d)).slice(1).includes("0")) break;
  }
  return qrQuestion(n, d, { story: chance(0.3), method: "sharing", visual: blocksHTML(n), hint: X.g57hint });
}

// 5-8 Choose a Method
function gen58() {
  const d = rand(2, 9);
  const n = dividendFor(d, 100, 9999, chance(0.6));
  return qrQuestion(n, d, {
    story: chance(0.4), label: X.tagAnyMethod, method: pick(["sharing", "partial"]), hint: X.g58hint,
  });
}

// 5-9 Mental Math: Multiples of 10, 100, and 1,000
function gen59() {
  const d = rand(2, 9), q = rand(2, 9), b = pick([0, 1, 1]);
  const a = rand(Math.max(1, b), 3);
  const n = d * q * 10 ** a, div = d * 10 ** b, ans = q * 10 ** (a - b);
  return {
    prompt: `${fmt(n)} ÷ ${fmt(div)} = ?`,
    type: "number", answer: ans, answerText: fmt(ans),
    hint: X.g59hint(d, q, n, div),
    steps: X.g59steps(d, q, n, div, ans),
  };
}

// 5-10 Estimate Quotients for 2-Digit Divisors
function gen510() {
  const t = rand(2, 8), o = pick([1, 2, 8, 9]);
  const D = t * 10 + o, R = Math.round(D / 10) * 10;
  const q = rand(2, 9), s = pick([1, 10]);
  const compat = R * q * s;
  let n = compat + rand(1, Math.max(1, Math.floor(R * s / 4))) * (chance(0.5) ? 1 : -1);
  if (n < D) n = compat;
  const est = q * s;
  const c = makeChoices(est, shuffle([est * 10, (q + 3) * s, (q - 3) * s, (q + 5) * s]));
  return {
    prompt: tag(X.tagEstimate) + X.aboutHowMuch(n, D),
    type: "choice", ...c,
    hint: X.g510hint(n, D),
    steps: X.g510steps(n, D, R, compat, est),
  };
}

// 5-11 Apply Math to Real-World Contexts
function gen511() {
  const N = pick(NAMES);
  const num = (prompt, ans, hint, steps) => ({ prompt, type: "number", answer: ans, answerText: fmt(ans), hint, steps });
  const W = X.world;
  switch (rand(0, 6)) {
    case 0: {
      const d = rand(3, 6), q = rand(20, 60), r = rand(1, d - 1), n = d * q + r;
      return num(W.garage(n, d, N), q, W.garageHint(n, d),
        [...partialQuotientSteps(n, d).slice(0, -1), W.garageEnd(q, r)]);
    }
    case 1: {
      const d = rand(2, 9), q = rand(4, 16), n = d * q;
      return num(W.board(n, d, N), q, W.boardHint(n, d), partialQuotientSteps(n, d));
    }
    case 2: {
      const [R, D] = pick([[10, 11], [10, 12], [20, 18], [20, 19], [20, 21], [20, 22]]);
      const est = R === 10 ? pick([20, 30, 40]) : pick([20, 25, 30]);
      const compat = R * est;
      const miles = compat + rand(3, 15) * (chance(0.5) ? 1 : -1);
      const c = makeChoices(est, shuffle([est * 10, est - 10, est + 10, est + 20]));
      return {
        prompt: tag(X.tagEstimate) + W.gas(miles, D),
        type: "choice", ...c,
        hint: W.gasHint(miles, D, R),
        steps: W.gasSteps(miles, D, R, compat, est),
      };
    }
    case 3: {
      const d = rand(3, 8), q = rand(12, 60), total = d * q;
      const a = rand(Math.floor(total * 0.3), Math.floor(total * 0.7)), b = total - a;
      return num(W.library(a, b, d), q, W.libraryHint(d), W.librarySteps(a, b, total, d, q));
    }
    case 4: {
      const d = rand(3, 8), q = rand(10, 40), rest = d * q, u = rand(10, 50), n = rest + u;
      return num(W.beads(n, u, d, N), q, W.beadsHint(d), W.beadsSteps(n, u, rest, d, q));
    }
    case 5: {
      const d = rand(6, 9), q = rand(12, 40), r = rand(1, d - 1), n = d * q + r;
      return num(W.vans(n, d), q + 1, W.vansHint(n, d), W.vansSteps(n, d, q, r));
    }
    default: {
      const d = rand(3, 9), q = rand(25, 150), n = d * q;
      return num(W.tickets(n, d), q, W.ticketsHint(n, d), partialQuotientSteps(n, d));
    }
  }
}

// Titles and descriptions come from the language packs (LANGS[lang].lessons).
const LESSONS = [
  { id: "5-1", icon: "🧠", gen: gen51 },
  { id: "5-2", icon: "🔮", gen: gen52 },
  { id: "5-3", icon: "🧩", gen: gen53 },
  { id: "5-4", icon: "🪜", gen: gen54 },
  { id: "5-5", icon: "🏔️", gen: gen55 },
  { id: "5-6", icon: "🧱", gen: gen56 },
  { id: "5-7", icon: "🔁", gen: gen57 },
  { id: "5-8", icon: "🎯", gen: gen58 },
  { id: "5-9", icon: "⚡", gen: gen59 },
  { id: "5-10", icon: "🔭", gen: gen510 },
  { id: "5-11", icon: "🌎", gen: gen511 },
];
const MIXED = { id: "mix", icon: "🏆" };

// Build a test in one language from a seed.
function makeTest(lessonId, count, lang = "en", seed = (Math.random() * 2 ** 32) >>> 0) {
  rnd = mulberry32(seed);
  X = LANGS[lang].gen;
  const qs = [], seen = new Set();
  for (let i = 0; i < count; i++) {
    let Q, key;
    for (let tries = 0; tries < 30; tries++) {
      const L = lessonId === "mix" ? LESSONS[i % LESSONS.length] : LESSONS.find(l => l.id === lessonId);
      Q = { lesson: L.id, ...L.gen() };
      key = Q.lesson + Q.type + Q.prompt.replace(/[^\d]/g, ""); // same in every language
      if (!seen.has(key)) break;
    }
    seen.add(key);
    qs.push(Q);
  }
  const out = lessonId === "mix" ? shuffle(qs) : qs;
  rnd = Math.random;
  return out;
}

// Build the same test in every language: [{en: Q, es: Q}, ...]
function makeBilingualTest(lessonId, count) {
  const seed = (Math.random() * 2 ** 32) >>> 0;
  const byLang = Object.keys(LANGS).map(lang => [lang, makeTest(lessonId, count, lang, seed)]);
  return byLang[0][1].map((_, i) => Object.fromEntries(byLang.map(([lang, qs]) => [lang, qs[i]])));
}

if (typeof module !== "undefined") module.exports = { LESSONS, MIXED, makeTest, makeBilingualTest };
