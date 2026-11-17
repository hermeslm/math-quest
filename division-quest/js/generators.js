// Division Quest — random question generators for enVision Grade 4, Topic 5.
// Each generator returns a question object:
// { lesson, prompt, type: 'number'|'qr'|'choice', answer, choices?, answerText,
//   hint, steps: [html lines], visual?: html }
"use strict";

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const chance = p => Math.random() < p;
const fmt = n => Number(n).toLocaleString("en-US");
const PLACES = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
const NAMES = ["Ned", "Mia", "Leo", "Ava", "Sam", "Zoe", "Max", "Lily", "Omar",
  "Emma", "Noah", "Sofia", "Eli", "Nora", "Jay", "Ruby", "Luis", "Maya"];

function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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
    lines.push(`How many ${d}s are in ${fmt(rem)}? Try <b>${fmt(pq)}</b>: ` +
      `${d} × ${fmt(pq)} = ${fmt(prod)}. &nbsp; ${fmt(rem)} − ${fmt(prod)} = ${fmt(rem - prod)}`);
    parts.push(pq);
    rem -= prod;
  }
  const q = parts.reduce((s, x) => s + x, 0);
  if (parts.length > 1) lines.push(`Add the partial quotients: ${parts.map(fmt).join(" + ")} = <b>${fmt(q)}</b>`);
  lines.push(rem ? `${fmt(rem)} is less than ${d}, so the remainder is <b>${rem}</b>.` : `Nothing is left, so there is no remainder.`);
  lines.push(`Check: ${d} × ${fmt(q)}${rem ? ` + ${rem}` : ""} = ${fmt(n)} ✔`);
  return lines;
}

// "1 ten", "3 tens"
const pv = (k, place) => `${fmt(k)} ${k === 1 ? place.replace(/s$/, "") : place}`;

function sharingSteps(n, d) {
  const digits = String(n).split("").map(Number);
  const L = digits.length;
  const lines = [];
  let carry = 0, started = false;
  digits.forEach((dig, i) => {
    const place = PLACES[L - 1 - i];
    const next = PLACES[L - 2 - i];
    const cur = carry * 10 + dig;
    const each = Math.floor(cur / d);
    const left = cur - each * d;
    if (!started && each === 0 && i < L - 1) {
      lines.push(`${pv(cur, place)}: not enough to put 1 in each of ${d} groups. Regroup ${pv(cur, place)} as ${pv(cur * 10, next)}.`);
    } else {
      started = true;
      let line = `Share ${pv(cur, place)} into ${d} groups: <b>${each}</b> ${each === 1 ? place.replace(/s$/, "") : place} in each group`;
      line += left ? `, ${left} left over.` : ".";
      if (left && i < L - 1) line += ` Regroup ${pv(left, place)} as ${pv(left * 10, next)}.`;
      lines.push(line);
    }
    carry = left;
  });
  const q = Math.floor(n / d), r = n % d;
  lines.push(`Each group gets <b>${fmt(q)}</b>${r ? `, with <b>${r}</b> left over` : ""}.`);
  return lines;
}

// Place-value blocks picture (numbers below 1,000)
function blocksHTML(n) {
  if (n >= 1000) return placeChartHTML(n);
  const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
  const rep = (cls, k) => `<span class="${cls}"></span>`.repeat(k);
  return `<div class="blocks" aria-label="${h} hundreds, ${t} tens, ${o} ones">
    ${h ? `<div class="blk-group">${rep("blk-h", h)}</div>` : ""}
    ${t ? `<div class="blk-group">${rep("blk-t", t)}</div>` : ""}
    ${o ? `<div class="blk-group ones">${rep("blk-o", o)}</div>` : ""}
  </div>`;
}

function placeChartHTML(n) {
  const digits = String(n).split("");
  const names = digits.map((_, i) => PLACES[digits.length - 1 - i]);
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

// ---------- story banks ----------

const EXACT_STORIES = [
  (n, d, N) => `${N} has ${fmt(n)} stickers and shares them equally among ${d} friends. How many stickers does each friend get?`,
  (n, d) => `A farmer packs ${fmt(n)} apples equally into ${d} crates. How many apples go in each crate?`,
  (n, d) => `The school library puts ${fmt(n)} books equally on ${d} shelves. How many books are on each shelf?`,
  (n, d) => `${fmt(n)} people ride a train with ${d} cars. Each car has the same number of people. How many people are in each car?`,
  (n, d) => `A zoo orders ${fmt(n)} pounds of food for ${d} elephants to share equally. How many pounds does each elephant get?`,
];

const LEFTOVER_STORIES = [
  (n, d, N) => `${N} has ${fmt(n)} stickers to share equally among ${d} friends. How many stickers does each friend get? How many are left over?`,
  (n, d) => `A baker has ${fmt(n)} cookies and puts the same number in each of ${d} boxes. How many cookies go in each box? How many are left over?`,
  (n, d) => `A team collects ${fmt(n)} cans and splits them equally into ${d} bags. How many cans are in each bag? How many are left over?`,
  (n, d, N) => `${N} has ${fmt(n)} beads to put equally on ${d} bracelets. How many beads go on each bracelet? How many are left over?`,
  (n, d) => `A class has ${fmt(n)} craft sticks to share equally among ${d} tables. How many sticks does each table get? How many are left over?`,
];

const REMAINDER_STORIES = [
  {
    icon: "🃏", item: "card", box: "page",
    setup: (n, d, N) => `${N} has ${n} soccer cards. ${N} puts ${d} cards on each page of an album.`,
    up: N => `How many pages does ${N} need to hold ALL the cards?`,
    down: () => `How many pages are completely full?`,
    rem: () => `How many cards are on the last page, which is not full?`,
  },
  {
    icon: "🧒", item: "student", box: "van",
    setup: (n, d) => `${n} students are going on a field trip. Each van holds ${d} students.`,
    up: () => `How many vans are needed so every student gets a ride?`,
    down: () => `How many vans will be completely full?`,
    rem: () => `How many students ride in the van that is not full?`,
  },
  {
    icon: "🥚", item: "egg", box: "carton",
    setup: (n, d) => `A farm collected ${n} eggs. Each carton holds ${d} eggs.`,
    up: () => `How many cartons are needed to pack ALL the eggs?`,
    down: () => `How many cartons can be filled completely?`,
    rem: () => `How many eggs are left after filling the full cartons?`,
  },
  {
    icon: "🍪", item: "cookie", box: "bag",
    setup: (n, d, N) => `${N} baked ${n} cookies and puts ${d} cookies in each bag to sell.`,
    up: N => `How many bags does ${N} need to hold ALL the cookies?`,
    down: N => `How many full bags can ${N} sell?`,
    rem: N => `How many cookies are left over for ${N} to eat?`,
  },
  {
    icon: "🏕️", item: "camper", box: "tent",
    setup: (n, d) => `${n} campers are sleeping in tents. Each tent holds ${d} campers.`,
    up: () => `How many tents are needed so every camper has a place to sleep?`,
    down: () => `How many tents are completely full?`,
    rem: () => `How many campers are in the tent that is not full?`,
  },
];

// ---------- lesson generators ----------

// 5-1 Mental Math: Find Quotients (multiples of 10 and 100 ÷ 1-digit)
function gen51() {
  const d = rand(2, 9), q = rand(2, 9), k = pick([1, 2]);
  const f = d * q, unit = k === 1 ? "tens" : "hundreds";
  const n = f * 10 ** k, ans = q * 10 ** k;
  const story = chance(0.3);
  return {
    prompt: story ? pick(EXACT_STORIES)(n, d, pick(NAMES)) : `${fmt(n)} ÷ ${d} = ?`,
    type: "number", answer: ans, answerText: fmt(ans),
    hint: `Use the basic fact ${f} ÷ ${d}. ${fmt(n)} is ${f} ${unit}.`,
    steps: [
      `Basic fact: ${f} ÷ ${d} = ${q}, because ${d} × ${q} = ${f}.`,
      `${fmt(n)} is ${f} ${unit}.`,
      `${f} ${unit} ÷ ${d} = ${q} ${unit} = <b>${fmt(ans)}</b>`,
      `Check: ${d} × ${fmt(ans)} = ${fmt(n)} ✔`,
    ],
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
      prompt: `<span class="tag">Estimate</span> About how much is ${fmt(n)} ÷ ${d}?`,
      type: "choice", ...c,
      hint: `Find a number close to ${fmt(n)} that is easy to divide by ${d}. Think about ${d} × ___ facts.`,
      steps: [
        `Think: what number close to ${fmt(n)} is easy to divide by ${d}?`,
        `${d} × ${q} = ${d * q}, so ${fmt(compat)} ÷ ${d} = ${fmt(est)}.`,
        `${fmt(compat)} is close to ${fmt(n)}, so ${fmt(n)} ÷ ${d} is about <b>${fmt(est)}</b>.`,
      ],
    };
  }
  const rounded = Math.round(n / s) * s;
  // Near-by distractors must NOT divide evenly by d, so there is only one best answer.
  const near = [rounded, rounded + s, rounded - s, rounded + 2 * s, rounded - 2 * s].filter(x => x % d !== 0);
  const c = makeChoices(compat, [...shuffle(near).slice(0, 2), compat + d * s, compat - d * s]);
  return {
    prompt: `<span class="tag">Compatible numbers</span> Which number is the best compatible number to estimate ${fmt(n)} ÷ ${d}?`,
    type: "choice", ...c,
    hint: `Look for a number close to ${fmt(n)} that ${d} divides evenly using a basic fact.`,
    steps: [
      `${fmt(compat)} is close to ${fmt(n)}.`,
      `${d} × ${q} = ${d * q}, so ${fmt(compat)} ÷ ${d} = ${fmt(est)} — easy!`,
      `The other numbers are harder to divide by ${d}, or farther from ${fmt(n)}. Answer: <b>${fmt(compat)}</b>`,
    ],
  };
}

// 5-3 Interpret Remainders
function gen53() {
  const d = rand(3, 9), q = rand(3, 12), r = rand(1, d - 1);
  const n = d * q + r, N = pick(NAMES), S = pick(REMAINDER_STORIES);
  const kind = pick(["up", "down", "rem"]);
  const ans = kind === "up" ? q + 1 : kind === "down" ? q : r;
  const steps = [`${n} ÷ ${d} = ${q} R ${r} &nbsp;(${d} × ${q} = ${d * q}, and ${d * q} + ${r} = ${n})`];
  if (n <= 60) steps.push(groupsHTML(n, d, S.icon));
  steps.push({
    up: `There are ${r} ${S.item}${r > 1 ? "s" : ""} left over. They still need a ${S.box}, so add 1: ${q} + 1 = <b>${q + 1}</b>.`,
    down: `Only full ${S.box}s count, so we don't use the remainder. The answer is <b>${q}</b>.`,
    rem: `The question asks about the leftovers — that is the remainder: <b>${r}</b>.`,
  }[kind]);
  return {
    prompt: `${S.setup(n, d, N)} <b>${S[kind](N)}</b>`,
    type: "number", answer: ans, answerText: fmt(ans),
    hint: `First find ${n} ÷ ${d}. Then think: what does the remainder mean in this story?`,
    steps,
  };
}

function qrQuestion(n, d, opts = {}) {
  const q = Math.floor(n / d), r = n % d;
  return {
    prompt: opts.story ? pick(LEFTOVER_STORIES)(n, d, pick(NAMES))
      : `${opts.label ? `<span class="tag">${opts.label}</span> ` : ""}${fmt(n)} ÷ ${d} = ?`,
    type: "qr", answer: { q, r }, answerText: `${fmt(q)} R ${r}`,
    hint: opts.hint || `Ask: how many ${d}s are in ${fmt(n)}? Start with a friendly number like ${d} × 10 or ${d} × 100.`,
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
      prompt: `An airplane has ${d} seats in each row. If there are ${fmt(n)} passengers, how many rows are needed?`,
      type: "number", answer: q, answerText: fmt(q),
      hint: `Find ${fmt(n)} ÷ ${d}. How many groups of ${d} are in ${fmt(n)}?`,
      steps: partialQuotientSteps(n, d),
    };
  }
  return qrQuestion(dividendFor(d, d * 10, 999, chance(0.5)), d, { label: "Partial quotients" });
}

// 5-5 Partial Quotients: Greater Dividends (4-digit)
function gen55() {
  const d = rand(2, 9);
  const n = dividendFor(d, 1000, 9999, chance(0.5));
  return qrQuestion(n, d, { story: chance(0.3), label: "Partial quotients" });
}

// 5-6 Use Sharing to Divide (place-value blocks)
function gen56() {
  const d = rand(2, 6);
  const n = dividendFor(d, d * 10, 999, chance(0.5));
  return qrQuestion(n, d, {
    story: chance(0.4), method: "sharing", visual: blocksHTML(n),
    hint: `Share the hundreds first, then the tens, then the ones. Regroup anything left over into the next place.`,
  });
}

// 5-7 Continue Sharing to Divide (3–4 digit, zeros in the quotient)
function gen57() {
  const d = rand(2, 9);
  let n;
  for (let tries = 0; tries < 200; tries++) {
    n = dividendFor(d, 100, 9999, chance(0.5));
    if (!chance(0.5) || String(Math.floor(n / d)).slice(1).includes("0")) break;
  }
  return qrQuestion(n, d, {
    story: chance(0.3), method: "sharing", visual: blocksHTML(n),
    hint: `Share one place at a time, starting with the biggest place. If a place can't be shared, write 0 and regroup.`,
  });
}

// 5-8 Choose a Method
function gen58() {
  const d = rand(2, 9);
  const n = dividendFor(d, 100, 9999, chance(0.6));
  return qrQuestion(n, d, {
    story: chance(0.4), label: "Any method", method: pick(["sharing", "partial"]),
    hint: `Use partial quotients or sharing — whichever you like! Estimate first so you know about how big the answer is.`,
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
    hint: `Use the basic fact ${d * q} ÷ ${d} = ${q}. Then think about the zeros: ${fmt(div)} × ? = ${fmt(n)}`,
    steps: [
      `Basic fact: ${d * q} ÷ ${d} = ${q}.`,
      `Think multiplication: ${fmt(div)} × ? = ${fmt(n)}`,
      `${fmt(div)} × ${fmt(ans)} = ${fmt(n)}, so ${fmt(n)} ÷ ${fmt(div)} = <b>${fmt(ans)}</b>`,
    ],
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
    prompt: `<span class="tag">Estimate</span> About how much is ${fmt(n)} ÷ ${D}?`,
    type: "choice", ...c,
    hint: `Round ${D} to the nearest ten. Then find a number close to ${fmt(n)} that is easy to divide by it.`,
    steps: [
      `Round ${D} to <b>${R}</b>.`,
      `${fmt(compat)} is close to ${fmt(n)} and easy to divide by ${R}: ${R} × ${fmt(est)} = ${fmt(compat)}.`,
      `So ${fmt(n)} ÷ ${D} is about <b>${fmt(est)}</b>.`,
    ],
  };
}

// 5-11 Apply Math to Real-World Contexts
function gen511() {
  const N = pick(NAMES);
  const num = (prompt, ans, hint, steps) => ({ prompt, type: "number", answer: ans, answerText: fmt(ans), hint, steps });
  switch (rand(0, 6)) {
    case 0: {
      const d = rand(3, 6), q = rand(20, 60), r = rand(1, d - 1), n = d * q + r;
      return num(`${N}'s family earned $${n} at a garage sale. ${d} people share the money equally. How many whole dollars does each person get?`,
        q, `Find ${n} ÷ ${d}. Can you split the leftover dollars?`,
        [...partialQuotientSteps(n, d).slice(0, -1), `Each person gets <b>$${q}</b> (the $${r} left over can't be split into whole dollars).`]);
    }
    case 1: {
      const d = rand(2, 9), q = rand(4, 16), n = d * q;
      return num(`A board is ${n} inches long. ${N} cuts it into ${d} equal pieces. How many inches long is each piece?`,
        q, `Divide the length by the number of pieces: ${n} ÷ ${d}.`, partialQuotientSteps(n, d));
    }
    case 2: {
      const [R, D] = pick([[10, 11], [10, 12], [20, 18], [20, 19], [20, 21], [20, 22]]);
      const est = R === 10 ? pick([20, 30, 40]) : pick([20, 25, 30]);
      const compat = R * est;
      const miles = compat + rand(3, 15) * (chance(0.5) ? 1 : -1);
      const c = makeChoices(est, shuffle([est * 10, est - 10, est + 10, est + 20]));
      return {
        prompt: `<span class="tag">Estimate</span> A car traveled ${miles} miles on ${D} gallons of gas. About how many miles did it go on each gallon?`,
        type: "choice", ...c,
        hint: `Estimate ${miles} ÷ ${D}. Round ${D} to ${R} first.`,
        steps: [`Round ${D} to ${R}. ${fmt(compat)} is close to ${miles}.`, `${fmt(compat)} ÷ ${R} = ${est}, so about <b>${est}</b> miles per gallon.`],
      };
    }
    case 3: {
      const d = rand(3, 8), q = rand(12, 60), total = d * q;
      const a = rand(Math.floor(total * 0.3), Math.floor(total * 0.7)), b = total - a;
      return num(`A library had ${a} books. It got ${b} more books. The librarian puts all the books equally on ${d} shelves. How many books go on each shelf?`,
        q, `Two steps! First add to find the total number of books. Then divide by ${d}.`,
        [`Step 1: ${a} + ${b} = ${total} books in all.`, `Step 2: ${total} ÷ ${d} = <b>${q}</b>`, `Check: ${d} × ${q} = ${total} ✔`]);
    }
    case 4: {
      const d = rand(3, 8), q = rand(10, 40), rest = d * q, u = rand(10, 50), n = rest + u;
      return num(`${N} has ${n} beads. ${N} uses ${u} beads to make a necklace, then puts the rest equally into ${d} jars. How many beads go in each jar?`,
        q, `Two steps! First subtract the beads used. Then divide what is left by ${d}.`,
        [`Step 1: ${n} − ${u} = ${rest} beads left.`, `Step 2: ${rest} ÷ ${d} = <b>${q}</b>`, `Check: ${d} × ${q} = ${rest} ✔`]);
    }
    case 5: {
      const d = rand(6, 9), q = rand(12, 40), r = rand(1, d - 1), n = d * q + r;
      return num(`${n} students are going to the science museum. Each minivan holds ${d} students. How many minivans are needed so everyone can go?`,
        q + 1, `Find ${n} ÷ ${d}. What should you do with the students left over?`,
        [`${n} ÷ ${d} = ${q} R ${r}`, `The ${r} extra students still need a ride, so add 1 more van: <b>${q + 1}</b>.`]);
    }
    default: {
      const d = rand(3, 9), q = rand(25, 150), n = d * q;
      return num(`The 4th grade sold tickets to a play for $${d} each. They collected $${fmt(n)}. How many tickets did they sell?`,
        q, `Each ticket is $${d}. How many groups of $${d} are in $${fmt(n)}?`, partialQuotientSteps(n, d));
    }
  }
}

const LESSONS = [
  { id: "5-1", icon: "🧠", title: "Mental Math: Find Quotients", gen: gen51,
    about: "Use basic facts and place value to divide multiples of 10 and 100 in your head. Example: 1,800 ÷ 6 = 300." },
  { id: "5-2", icon: "🔮", title: "Mental Math: Estimate Quotients", gen: gen52,
    about: "Use compatible numbers to estimate. Example: 700 ÷ 9 is about 720 ÷ 9 = 80." },
  { id: "5-3", icon: "🧩", title: "Interpret Remainders", gen: gen53,
    about: "Decide what the remainder means in a story: add 1, ignore it, or use it as the answer." },
  { id: "5-4", icon: "🪜", title: "Use Partial Quotients to Divide", gen: gen54,
    about: "Ask \"How many ___s are in ___?\" and subtract partial quotients. Example: 63 ÷ 3 = 21." },
  { id: "5-5", icon: "🏔️", title: "Partial Quotients: Greater Dividends", gen: gen55,
    about: "Use partial quotients with 4-digit numbers. Example: 1,968 ÷ 6 = 328." },
  { id: "5-6", icon: "🧱", title: "Use Sharing to Divide", gen: gen56,
    about: "Share place-value blocks equally, one place at a time. Example: 55 ÷ 4 = 13 R 3." },
  { id: "5-7", icon: "🔁", title: "Continue Sharing to Divide", gen: gen57,
    about: "Share greater numbers, regroup, and watch for zeros in the quotient." },
  { id: "5-8", icon: "🎯", title: "Divide: Choose a Method", gen: gen58,
    about: "Divide by 1-digit numbers using any method you like." },
  { id: "5-9", icon: "⚡", title: "Quotients with Multiples of 10, 100, 1,000", gen: gen59,
    about: "Use basic facts with multiples of 10, 100, and 1,000. Example: 2,400 ÷ 60 = 40." },
  { id: "5-10", icon: "🔭", title: "Estimate Quotients: 2-Digit Divisors", gen: gen510,
    about: "Round the divisor, then use compatible numbers. Example: 390 ÷ 18 is about 400 ÷ 20 = 20." },
  { id: "5-11", icon: "🌎", title: "Apply Math to Real-World Contexts", gen: gen511,
    about: "Solve real-life problems: sharing money, cutting boards, gas mileage, and two-step stories." },
];

const MIXED = { id: "mix", icon: "🏆", title: "Topic 5 Test (all lessons)", about: "A mix of questions from every lesson in Topic 5." };

function makeTest(lessonId, count) {
  const qs = [], seen = new Set();
  for (let i = 0; i < count; i++) {
    let Q;
    for (let tries = 0; tries < 30; tries++) {
      const L = lessonId === "mix" ? LESSONS[i % LESSONS.length] : LESSONS.find(l => l.id === lessonId);
      Q = { lesson: L.id, ...L.gen() };
      if (!seen.has(Q.prompt)) break;
    }
    seen.add(Q.prompt);
    qs.push(Q);
  }
  return lessonId === "mix" ? shuffle(qs) : qs;
}

if (typeof module !== "undefined") module.exports = { LESSONS, MIXED, makeTest };
