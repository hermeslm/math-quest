// Division Quest — English language pack
"use strict";
globalThis.LANGS = globalThis.LANGS || {};

(() => {
const f = n => Number(n).toLocaleString("en-US");
const UNITS = [["one", "ones"], ["ten", "tens"], ["hundred", "hundreds"], ["thousand", "thousands"], ["ten thousand", "ten thousands"]];
const unit = (k, place) => UNITS[place][k === 1 ? 0 : 1];
const pv = (k, place) => `${f(k)} ${unit(k, place)}`;
const s = (k, word) => (k === 1 ? word : word + "s");

LANGS.en = {
  name: "English",
  switchTo: "🌐 Español",

  lessons: {
    "5-1": { title: "Mental Math: Find Quotients", about: "Use basic facts and place value to divide multiples of 10 and 100 in your head. Example: 1,800 ÷ 6 = 300." },
    "5-2": { title: "Mental Math: Estimate Quotients", about: "Use compatible numbers to estimate. Example: 700 ÷ 9 is about 720 ÷ 9 = 80." },
    "5-3": { title: "Interpret Remainders", about: "Decide what the remainder means in a story: add 1, ignore it, or use it as the answer." },
    "5-4": { title: "Use Partial Quotients to Divide", about: "Ask \"How many ___s are in ___?\" and subtract partial quotients. Example: 63 ÷ 3 = 21." },
    "5-5": { title: "Partial Quotients: Greater Dividends", about: "Use partial quotients with 4-digit numbers. Example: 1,968 ÷ 6 = 328." },
    "5-6": { title: "Use Sharing to Divide", about: "Share place-value blocks equally, one place at a time. Example: 55 ÷ 4 = 13 R 3." },
    "5-7": { title: "Continue Sharing to Divide", about: "Share greater numbers, regroup, and watch for zeros in the quotient." },
    "5-8": { title: "Divide: Choose a Method", about: "Divide by 1-digit numbers using any method you like." },
    "5-9": { title: "Quotients with Multiples of 10, 100, 1,000", about: "Use basic facts with multiples of 10, 100, and 1,000. Example: 2,400 ÷ 60 = 40." },
    "5-10": { title: "Estimate Quotients: 2-Digit Divisors", about: "Round the divisor, then use compatible numbers. Example: 390 ÷ 18 is about 400 ÷ 20 = 20." },
    "5-11": { title: "Apply Math to Real-World Contexts", about: "Solve real-life problems: sharing money, cutting boards, gas mileage, and two-step stories." },
    "mix": { title: "Topic 5 Test (all lessons)", about: "A mix of questions from every lesson in Topic 5." },
  },

  ui: {
    pageTitle: "Division Quest",
    appName: "🦉 Division Quest",
    home: "Home",
    soundToggle: "Sound on/off",
    hello: "Hi, math explorer!",
    intro: "Pick a lesson from <b>Topic 5: Divide by 1-Digit Numbers</b>. Every test is new and random!",
    lesson: id => `Lesson ${id}`,
    lessonTitle: (id, title) => `Lesson ${id}: ${title}`,
    bestScore: "Best score",
    howMany: "How many questions?",
    start: "Start! 🚀",
    print: "🖨️ Printable worksheet",
    helpAtHome: "👪 Help at home",
    lessonAnimation: "🎬 Lesson animation",
    close: "Close",
    questionOf: (i, n) => `Question ${i} of ${n}`,
    hint: "💡 Hint",
    check: "Check ✔",
    next: "Next ➜",
    seeScore: "See my score 🏁",
    erase: "Erase",
    answer: "Answer",
    quotient: "Quotient",
    remainder: "Remainder",
    typeFirst: "Type your answer first! ✏️",
    cheers: ["Awesome! 🎉", "You got it! ⭐", "Math superstar! 🌟", "Great thinking! 🧠", "Wow, nice work! 🙌", "Perfect! 💯"],
    retry: ["Almost! Try again. 💪", "Not quite — check your work. 🔍", "Keep going, you can do it! 🚀"],
    fixedIt: "You fixed it — great job! 👍",
    theAnswerIs: a => `The answer is <b>${a}</b>. Let's see how! 👇`,
    howToSolve: "🦉 How to solve it",
    howToSolvePlain: "How to solve it",
    watchAnimation: id => `🎬 Watch the lesson ${id} animation with a grown-up`,
    resultTitles: ["Good try! Let's practice more! 💪", "Nice work! 👍", "Great job! 🎉", "Amazing! You're a division champion! 🏆"],
    resultScore: (right, total, first) => `You got ${right} out of ${total} right (${first} on the first try).`,
    newTest: "🔄 New test",
    pickLesson: "📚 Pick a lesson",
    review: "Let's review",
    yourAnswer: "Your answer:",
    correctAnswer: "Correct answer:",
    // parent corner
    parentCorner: "👪 Parent corner",
    watchTogether: "🎬 Watch and learn together",
    vla: "🎬 Visual Learning Animation",
    alv: "📺 Another Look Video",
    noAnimation: "This lesson has no animation of its own. Use the animations from earlier lessons and the real-life ideas below.",
    guide: [
      "<b>Watch first.</b> Sit with your child and play the <b>Visual Learning Animation</b>. It shows the idea of the lesson step by step.",
      "<b>Pause and ask.</b> When the animation asks a question, pause it. Let your child answer before you continue.",
      "<b>Retell it.</b> At the end, ask your child to explain the method in their own words, or to show it with a drawing.",
      "<b>Still stuck?</b> Watch the <b>Another Look Video</b>. It explains the same idea in a different way.",
      "<b>Practice.</b> Work through the example below together, try the home activity, then start a Division Quest test.",
    ],
    mathHelp: "🧮 Math help at home",
    homeActivity: "🏠 Home activity:",
    source: "Source:",
    sourceLink: "enVision Florida Family Engagement — lesson page",
    startPractice: "Start practice 🚀",
    allLessons: "📚 All lessons",
    // worksheet
    wsName: "Name:",
    wsDate: "Date:",
    wsQuotient: "Quotient:",
    answerKey: "Answer Key",
  },

  gen: {
    unit, pv,
    // partial quotients
    pqTry: (d, rem, pq, prod, left) => `How many ${d}s are in ${f(rem)}? Try <b>${f(pq)}</b>: ${d} × ${f(pq)} = ${f(prod)}. &nbsp; ${f(rem)} − ${f(prod)} = ${f(left)}`,
    pqAdd: (list, q) => `Add the partial quotients: ${list} = <b>${f(q)}</b>`,
    pqRem: (r, d) => `${f(r)} is less than ${d}, so the remainder is <b>${r}</b>.`,
    pqNoRem: () => "Nothing is left, so there is no remainder.",
    check: (d, q, r, n) => `Check: ${d} × ${f(q)}${r ? ` + ${r}` : ""} = ${f(n)} ✔`,
    // sharing
    notEnough: (cur, d, regrouped) => `${cur}: not enough to put 1 in each of ${d} groups. Regroup ${cur} as ${regrouped}.`,
    share: (cur, d, eachHtml, left, regroupTo, leftPv) =>
      `Share ${cur} into ${d} groups: ${eachHtml} in each group` + (left ? `, ${left} left over.` : ".") +
      (regroupTo ? ` Regroup ${leftPv} as ${regroupTo}.` : ""),
    eachGets: (q, r) => `Each group gets <b>${f(q)}</b>${r ? `, with <b>${r}</b> left over` : ""}.`,
    // tags
    tagEstimate: "Estimate",
    tagCompatible: "Compatible numbers",
    tagPartial: "Partial quotients",
    tagAnyMethod: "Any method",
    aboutHowMuch: (n, d) => `About how much is ${f(n)} ÷ ${d}?`,
    whichCompatible: (n, d) => `Which number is the best compatible number to estimate ${f(n)} ÷ ${d}?`,
    // 5-1
    g51hint: (fact, d, n, k) => `Use the basic fact ${fact} ÷ ${d}. ${f(n)} is ${fact} ${unit(2, k)}.`,
    g51steps: (fact, d, q, n, ans, k) => [
      `Basic fact: ${fact} ÷ ${d} = ${q}, because ${d} × ${q} = ${fact}.`,
      `${f(n)} is ${fact} ${unit(2, k)}.`,
      `${fact} ${unit(2, k)} ÷ ${d} = ${q} ${unit(2, k)} = <b>${f(ans)}</b>`,
      `Check: ${d} × ${f(ans)} = ${f(n)} ✔`,
    ],
    // 5-2
    g52hint: (n, d) => `Find a number close to ${f(n)} that is easy to divide by ${d}. Think about ${d} × ___ facts.`,
    g52steps: (n, d, q, compat, est) => [
      `Think: what number close to ${f(n)} is easy to divide by ${d}?`,
      `${d} × ${q} = ${d * q}, so ${f(compat)} ÷ ${d} = ${f(est)}.`,
      `${f(compat)} is close to ${f(n)}, so ${f(n)} ÷ ${d} is about <b>${f(est)}</b>.`,
    ],
    g52compatHint: (n, d) => `Look for a number close to ${f(n)} that ${d} divides evenly using a basic fact.`,
    g52compatSteps: (n, d, q, compat, est) => [
      `${f(compat)} is close to ${f(n)}.`,
      `${d} × ${q} = ${d * q}, so ${f(compat)} ÷ ${d} = ${f(est)} — easy!`,
      `The other numbers are harder to divide by ${d}, or farther from ${f(n)}. Answer: <b>${f(compat)}</b>`,
    ],
    // 5-3
    g53first: (n, d, q, r) => `${n} ÷ ${d} = ${q} R ${r} &nbsp;(${d} × ${q} = ${d * q}, and ${d * q} + ${r} = ${n})`,
    g53hint: (n, d) => `First find ${n} ÷ ${d}. Then think: what does the remainder mean in this story?`,
    // qr
    qrHint: (n, d) => `Ask: how many ${d}s are in ${f(n)}? Start with a friendly number like ${d} × 10 or ${d} × 100.`,
    g56hint: "Share the hundreds first, then the tens, then the ones. Regroup anything left over into the next place.",
    g57hint: "Share one place at a time, starting with the biggest place. If a place can't be shared, write 0 and regroup.",
    g58hint: "Use partial quotients or sharing — whichever you like! Estimate first so you know about how big the answer is.",
    // 5-4
    airplane: (n, d) => `An airplane has ${d} seats in each row. If there are ${f(n)} passengers, how many rows are needed?`,
    airplaneHint: (n, d) => `Find ${f(n)} ÷ ${d}. How many groups of ${d} are in ${f(n)}?`,
    // 5-9
    g59hint: (d, q, n, div) => `Use the basic fact ${d * q} ÷ ${d} = ${q}. Then think about the zeros: ${f(div)} × ? = ${f(n)}`,
    g59steps: (d, q, n, div, ans) => [
      `Basic fact: ${d * q} ÷ ${d} = ${q}.`,
      `Think multiplication: ${f(div)} × ? = ${f(n)}`,
      `${f(div)} × ${f(ans)} = ${f(n)}, so ${f(n)} ÷ ${f(div)} = <b>${f(ans)}</b>`,
    ],
    // 5-10
    g510hint: (n, D) => `Round ${D} to the nearest ten. Then find a number close to ${f(n)} that is easy to divide by it.`,
    g510steps: (n, D, R, compat, est) => [
      `Round ${D} to <b>${R}</b>.`,
      `${f(compat)} is close to ${f(n)} and easy to divide by ${R}: ${R} × ${f(est)} = ${f(compat)}.`,
      `So ${f(n)} ÷ ${D} is about <b>${f(est)}</b>.`,
    ],

    exactStories: [
      (n, d, N) => `${N} has ${f(n)} stickers and shares them equally among ${d} friends. How many stickers does each friend get?`,
      (n, d) => `A farmer packs ${f(n)} apples equally into ${d} crates. How many apples go in each crate?`,
      (n, d) => `The school library puts ${f(n)} books equally on ${d} shelves. How many books are on each shelf?`,
      (n, d) => `${f(n)} people ride a train with ${d} cars. Each car has the same number of people. How many people are in each car?`,
      (n, d) => `A zoo orders ${f(n)} pounds of food for ${d} elephants to share equally. How many pounds does each elephant get?`,
    ],
    leftoverStories: [
      (n, d, N) => `${N} has ${f(n)} stickers to share equally among ${d} friends. How many stickers does each friend get? How many are left over?`,
      (n, d) => `A baker has ${f(n)} cookies and puts the same number in each of ${d} boxes. How many cookies go in each box? How many are left over?`,
      (n, d) => `A team collects ${f(n)} cans and splits them equally into ${d} bags. How many cans are in each bag? How many are left over?`,
      (n, d, N) => `${N} has ${f(n)} beads to put equally on ${d} bracelets. How many beads go on each bracelet? How many are left over?`,
      (n, d) => `A class has ${f(n)} craft sticks to share equally among ${d} tables. How many sticks does each table get? How many are left over?`,
    ],
    remainderStories: [
      {
        icon: "🃏",
        setup: (n, d, N) => `${N} has ${n} soccer cards. ${N} puts ${d} cards on each page of an album.`,
        up: N => `How many pages does ${N} need to hold ALL the cards?`,
        down: () => "How many pages are completely full?",
        rem: () => "How many cards are on the last page, which is not full?",
        upStep: (q, r) => `There ${r === 1 ? "is" : "are"} ${r} ${s(r, "card")} left over. They still need a page, so add 1: ${q} + 1 = <b>${q + 1}</b>.`,
        downStep: q => `Only full pages count, so we don't use the remainder. The answer is <b>${q}</b>.`,
        remStep: r => `The question asks about the leftovers — that is the remainder: <b>${r}</b>.`,
      },
      {
        icon: "🧒",
        setup: (n, d) => `${n} students are going on a field trip. Each van holds ${d} students.`,
        up: () => "How many vans are needed so every student gets a ride?",
        down: () => "How many vans will be completely full?",
        rem: () => "How many students ride in the van that is not full?",
        upStep: (q, r) => `There ${r === 1 ? "is" : "are"} ${r} ${s(r, "student")} left over. They still need a van, so add 1: ${q} + 1 = <b>${q + 1}</b>.`,
        downStep: q => `Only full vans count, so we don't use the remainder. The answer is <b>${q}</b>.`,
        remStep: r => `The question asks about the leftovers — that is the remainder: <b>${r}</b>.`,
      },
      {
        icon: "🥚",
        setup: (n, d) => `A farm collected ${n} eggs. Each carton holds ${d} eggs.`,
        up: () => "How many cartons are needed to pack ALL the eggs?",
        down: () => "How many cartons can be filled completely?",
        rem: () => "How many eggs are left after filling the full cartons?",
        upStep: (q, r) => `There ${r === 1 ? "is" : "are"} ${r} ${s(r, "egg")} left over. They still need a carton, so add 1: ${q} + 1 = <b>${q + 1}</b>.`,
        downStep: q => `Only full cartons count, so we don't use the remainder. The answer is <b>${q}</b>.`,
        remStep: r => `The question asks about the leftovers — that is the remainder: <b>${r}</b>.`,
      },
      {
        icon: "🍪",
        setup: (n, d, N) => `${N} baked ${n} cookies and puts ${d} cookies in each bag to sell.`,
        up: N => `How many bags does ${N} need to hold ALL the cookies?`,
        down: N => `How many full bags can ${N} sell?`,
        rem: N => `How many cookies are left over for ${N} to eat?`,
        upStep: (q, r) => `There ${r === 1 ? "is" : "are"} ${r} ${s(r, "cookie")} left over. They still need a bag, so add 1: ${q} + 1 = <b>${q + 1}</b>.`,
        downStep: q => `Only full bags count, so we don't use the remainder. The answer is <b>${q}</b>.`,
        remStep: r => `The question asks about the leftovers — that is the remainder: <b>${r}</b>.`,
      },
      {
        icon: "🏕️",
        setup: (n, d) => `${n} campers are sleeping in tents. Each tent holds ${d} campers.`,
        up: () => "How many tents are needed so every camper has a place to sleep?",
        down: () => "How many tents are completely full?",
        rem: () => "How many campers are in the tent that is not full?",
        upStep: (q, r) => `There ${r === 1 ? "is" : "are"} ${r} ${s(r, "camper")} left over. They still need a tent, so add 1: ${q} + 1 = <b>${q + 1}</b>.`,
        downStep: q => `Only full tents count, so we don't use the remainder. The answer is <b>${q}</b>.`,
        remStep: r => `The question asks about the leftovers — that is the remainder: <b>${r}</b>.`,
      },
    ],

    world: {
      garage: (n, d, N) => `${N}'s family earned $${n} at a garage sale. ${d} people share the money equally. How many whole dollars does each person get?`,
      garageHint: (n, d) => `Find ${n} ÷ ${d}. Can you split the leftover dollars?`,
      garageEnd: (q, r) => `Each person gets <b>$${q}</b> (the $${r} left over can't be split into whole dollars).`,
      board: (n, d, N) => `A board is ${n} inches long. ${N} cuts it into ${d} equal pieces. How many inches long is each piece?`,
      boardHint: (n, d) => `Divide the length by the number of pieces: ${n} ÷ ${d}.`,
      gas: (miles, D) => `A car traveled ${miles} miles on ${D} gallons of gas. About how many miles did it go on each gallon?`,
      gasHint: (miles, D, R) => `Estimate ${miles} ÷ ${D}. Round ${D} to ${R} first.`,
      gasSteps: (miles, D, R, compat, est) => [
        `Round ${D} to ${R}. ${f(compat)} is close to ${miles}.`,
        `${f(compat)} ÷ ${R} = ${est}, so about <b>${est}</b> miles per gallon.`,
      ],
      library: (a, b, d) => `A library had ${a} books. It got ${b} more books. The librarian puts all the books equally on ${d} shelves. How many books go on each shelf?`,
      libraryHint: d => `Two steps! First add to find the total number of books. Then divide by ${d}.`,
      librarySteps: (a, b, total, d, q) => [`Step 1: ${a} + ${b} = ${total} books in all.`, `Step 2: ${total} ÷ ${d} = <b>${q}</b>`, `Check: ${d} × ${q} = ${total} ✔`],
      beads: (n, u, d, N) => `${N} has ${n} beads. ${N} uses ${u} beads to make a necklace, then puts the rest equally into ${d} jars. How many beads go in each jar?`,
      beadsHint: d => `Two steps! First subtract the beads used. Then divide what is left by ${d}.`,
      beadsSteps: (n, u, rest, d, q) => [`Step 1: ${n} − ${u} = ${rest} beads left.`, `Step 2: ${rest} ÷ ${d} = <b>${q}</b>`, `Check: ${d} × ${q} = ${rest} ✔`],
      vans: (n, d) => `${n} students are going to the science museum. Each minivan holds ${d} students. How many minivans are needed so everyone can go?`,
      vansHint: (n, d) => `Find ${n} ÷ ${d}. What should you do with the students left over?`,
      vansSteps: (n, d, q, r) => [`${n} ÷ ${d} = ${q} R ${r}`, `The ${r} extra ${s(r, "student")} still need a ride, so add 1 more van: <b>${q + 1}</b>.`],
      tickets: (n, d) => `The 4th grade sold tickets to a play for $${d} each. They collected $${f(n)}. How many tickets did they sell?`,
      ticketsHint: (n, d) => `Each ticket is $${d}. How many groups of $${d} are in $${f(n)}?`,
    },
  },
};
})();
