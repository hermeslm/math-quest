// Division Quest — paquete de idioma en español
"use strict";
globalThis.LANGS = globalThis.LANGS || {};

(() => {
const f = n => Number(n).toLocaleString("en-US"); // 1,800 — igual que en los libros de la escuela (enVision Florida)
const UNITS = [["unidad", "unidades"], ["decena", "decenas"], ["centena", "centenas"], ["millar", "millares"], ["decena de millar", "decenas de millar"]];
const unit = (k, place) => UNITS[place][k === 1 ? 0 : 1];
const pv = (k, place) => `${f(k)} ${unit(k, place)}`;
const pl = (k, one, many) => (k === 1 ? one : many);

// "Sobran 3 tarjetas. Todavía necesitan una página..."
const upStep = (thing, things, box) => (q, r) =>
  `${pl(r, "Sobra", "Sobran")} ${r} ${pl(r, thing, things)}. Todavía ${pl(r, "necesita", "necesitan")} ${box}, así que suma 1: ${q} + 1 = <b>${q + 1}</b>.`;
const downStep = boxes => q => `Solo cuentan ${boxes}, así que no usamos el residuo. La respuesta es <b>${q}</b>.`;
const remStep = r => `La pregunta es sobre lo que sobra — eso es el residuo: <b>${r}</b>.`;

LANGS.es = {
  name: "Español",
  switchTo: "🌐 English",

  lessons: {
    "5-1": { title: "Cálculo mental: Hallar cocientes", about: "Usa operaciones básicas y el valor de posición para dividir múltiplos de 10 y de 100 mentalmente. Ejemplo: 1,800 ÷ 6 = 300." },
    "5-2": { title: "Cálculo mental: Estimar cocientes", about: "Usa números compatibles para estimar. Ejemplo: 700 ÷ 9 es aproximadamente 720 ÷ 9 = 80." },
    "5-3": { title: "Interpretar residuos", about: "Decide qué significa el residuo en un problema: sumar 1, no usarlo o usarlo como la respuesta." },
    "5-4": { title: "Usar cocientes parciales para dividir", about: "Pregunta \"¿Cuántos grupos de ___ hay en ___?\" y resta cocientes parciales. Ejemplo: 63 ÷ 3 = 21." },
    "5-5": { title: "Cocientes parciales: Dividendos más grandes", about: "Usa cocientes parciales con números de 4 dígitos. Ejemplo: 1,968 ÷ 6 = 328." },
    "5-6": { title: "Usar la repartición para dividir", about: "Reparte bloques de valor de posición en partes iguales, un lugar a la vez. Ejemplo: 55 ÷ 4 = 13 R 3." },
    "5-7": { title: "Más sobre usar la repartición para dividir", about: "Reparte números más grandes, reagrupa y fíjate en los ceros del cociente." },
    "5-8": { title: "Dividir: Escoger un método", about: "Divide por números de 1 dígito con el método que prefieras." },
    "5-9": { title: "Cocientes con múltiplos de 10, de 100 y de 1,000", about: "Usa operaciones básicas con múltiplos de 10, de 100 y de 1,000. Ejemplo: 2,400 ÷ 60 = 40." },
    "5-10": { title: "Estimar cocientes con divisores de 2 dígitos", about: "Redondea el divisor y luego usa números compatibles. Ejemplo: 390 ÷ 18 es aproximadamente 400 ÷ 20 = 20." },
    "5-11": { title: "Aplicar las matemáticas a contextos del mundo real", about: "Resuelve problemas de la vida real: repartir dinero, cortar tablas, millas por galón y problemas de dos pasos." },
    "mix": { title: "Prueba del Tema 5 (todas las lecciones)", about: "Una mezcla de preguntas de todas las lecciones del Tema 5." },
  },

  ui: {
    pageTitle: "Aventura de la División",
    appName: "🦉 Aventura de la División",
    home: "Inicio",
    soundToggle: "Sonido sí/no",
    hello: "¡Hola, explorador de las matemáticas!",
    intro: "Escoge una lección del <b>Tema 5: Dividir por números de 1 dígito</b>. ¡Cada prueba es nueva y diferente!",
    lesson: id => `Lección ${id}`,
    lessonTitle: (id, title) => `Lección ${id}: ${title}`,
    bestScore: "Mejor puntuación",
    howMany: "¿Cuántas preguntas?",
    start: "¡Empezar! 🚀",
    print: "🖨️ Hoja de práctica para imprimir",
    helpAtHome: "👪 Ayuda en casa",
    lessonAnimation: "🎬 Animación de la lección",
    close: "Cerrar",
    questionOf: (i, n) => `Pregunta ${i} de ${n}`,
    hint: "💡 Pista",
    check: "Revisar ✔",
    next: "Siguiente ➜",
    seeScore: "Ver mi puntuación 🏁",
    erase: "Borrar",
    answer: "Respuesta",
    quotient: "Cociente",
    remainder: "Residuo",
    typeFirst: "¡Primero escribe tu respuesta! ✏️",
    cheers: ["¡Genial! 🎉", "¡Lo lograste! ⭐", "¡Superestrella de las matemáticas! 🌟", "¡Muy bien pensado! 🧠", "¡Excelente trabajo! 🙌", "¡Perfecto! 💯"],
    retry: ["¡Casi! Inténtalo otra vez. 💪", "No exactamente — revisa tu trabajo. 🔍", "¡Sigue adelante, tú puedes! 🚀"],
    fixedIt: "¡Lo corregiste — muy bien! 👍",
    theAnswerIs: a => `La respuesta es <b>${a}</b>. ¡Veamos cómo! 👇`,
    howToSolve: "🦉 Cómo resolverlo",
    howToSolvePlain: "Cómo resolverlo",
    watchAnimation: id => `🎬 Mira la animación de la lección ${id} con un adulto`,
    resultTitles: ["¡Buen intento! ¡Practiquemos más! 💪", "¡Buen trabajo! 👍", "¡Muy bien hecho! 🎉", "¡Increíble! ¡Eres campeón de la división! 🏆"],
    resultScore: (right, total, first) => `Tuviste ${right} de ${total} correctas (${first} en el primer intento).`,
    newTest: "🔄 Nueva prueba",
    pickLesson: "📚 Escoger una lección",
    review: "Repasemos",
    yourAnswer: "Tu respuesta:",
    correctAnswer: "Respuesta correcta:",
    // rincón de los padres
    parentCorner: "👪 Rincón para padres",
    watchTogether: "🎬 Miren y aprendan juntos",
    vla: "🎬 Aprendizaje visual animado",
    alv: "📺 Video ¡Revisemos!",
    noAnimation: "Esta lección no tiene animación propia. Usen las animaciones de las lecciones anteriores y las ideas de la vida real que aparecen abajo.",
    guide: [
      "<b>Primero miren.</b> Siéntese con su hijo o hija y reproduzcan el <b>Aprendizaje visual animado</b>. Muestra la idea de la lección paso a paso.",
      "<b>Hagan una pausa y pregunten.</b> Cuando la animación haga una pregunta, páusela. Deje que su hijo o hija responda antes de continuar.",
      "<b>Que lo explique.</b> Al final, pídale que explique el método con sus propias palabras o que lo muestre con un dibujo.",
      "<b>¿Todavía hay dudas?</b> Miren el <b>Video ¡Revisemos!</b> Explica la misma idea de otra manera.",
      "<b>Practiquen.</b> Resuelvan juntos el ejemplo de abajo, hagan la actividad para el hogar y luego empiecen una prueba.",
    ],
    mathHelp: "🧮 Matemáticas para usar en casa",
    homeActivity: "🏠 Actividad para el hogar:",
    source: "Fuente:",
    sourceLink: "enVision Florida Participación familiar — página de la lección",
    startPractice: "Empezar a practicar 🚀",
    allLessons: "📚 Todas las lecciones",
    // hoja de práctica
    wsName: "Nombre:",
    wsDate: "Fecha:",
    wsQuotient: "Cociente:",
    answerKey: "Respuestas",
  },

  gen: {
    unit, pv,
    // cocientes parciales
    pqTry: (d, rem, pq, prod, left) => `¿Cuántos grupos de ${d} hay en ${f(rem)}? Prueba con <b>${f(pq)}</b>: ${d} × ${f(pq)} = ${f(prod)}. &nbsp; ${f(rem)} − ${f(prod)} = ${f(left)}`,
    pqAdd: (list, q) => `Suma los cocientes parciales: ${list} = <b>${f(q)}</b>`,
    pqRem: (r, d) => `${f(r)} es menor que ${d}, así que el residuo es <b>${r}</b>.`,
    pqNoRem: () => "No sobra nada, así que no hay residuo.",
    check: (d, q, r, n) => `Comprueba: ${d} × ${f(q)}${r ? ` + ${r}` : ""} = ${f(n)} ✔`,
    // repartición
    notEnough: (cur, d, regrouped) => `${cur}: no alcanza para poner 1 en cada uno de los ${d} grupos. Reagrupa ${cur} como ${regrouped}.`,
    share: (cur, d, eachHtml, left, regroupTo, leftPv) =>
      `Reparte ${cur} en ${d} grupos: ${eachHtml} en cada grupo` + (left ? `, ${pl(left, "sobra", "sobran")} ${left}.` : ".") +
      (regroupTo ? ` Reagrupa ${leftPv} como ${regroupTo}.` : ""),
    eachGets: (q, r) => `Cada grupo recibe <b>${f(q)}</b>${r ? ` y ${pl(r, "sobra", "sobran")} <b>${r}</b>` : ""}.`,
    // etiquetas
    tagEstimate: "Estimar",
    tagCompatible: "Números compatibles",
    tagPartial: "Cocientes parciales",
    tagAnyMethod: "Cualquier método",
    aboutHowMuch: (n, d) => `¿Aproximadamente cuánto es ${f(n)} ÷ ${d}?`,
    whichCompatible: (n, d) => `¿Cuál es el mejor número compatible para estimar ${f(n)} ÷ ${d}?`,
    // 5-1
    g51hint: (fact, d, n, k) => `Usa la operación básica ${fact} ÷ ${d}. ${f(n)} son ${fact} ${unit(2, k)}.`,
    g51steps: (fact, d, q, n, ans, k) => [
      `Operación básica: ${fact} ÷ ${d} = ${q}, porque ${d} × ${q} = ${fact}.`,
      `${f(n)} son ${fact} ${unit(2, k)}.`,
      `${fact} ${unit(2, k)} ÷ ${d} = ${q} ${unit(2, k)} = <b>${f(ans)}</b>`,
      `Comprueba: ${d} × ${f(ans)} = ${f(n)} ✔`,
    ],
    // 5-2
    g52hint: (n, d) => `Busca un número cercano a ${f(n)} que sea fácil de dividir por ${d}. Piensa en las operaciones de ${d} × ___.`,
    g52steps: (n, d, q, compat, est) => [
      `Piensa: ¿qué número cercano a ${f(n)} es fácil de dividir por ${d}?`,
      `${d} × ${q} = ${d * q}, así que ${f(compat)} ÷ ${d} = ${f(est)}.`,
      `${f(compat)} está cerca de ${f(n)}, así que ${f(n)} ÷ ${d} es aproximadamente <b>${f(est)}</b>.`,
    ],
    g52compatHint: (n, d) => `Busca un número cercano a ${f(n)} que se pueda dividir exactamente por ${d} usando una operación básica.`,
    g52compatSteps: (n, d, q, compat, est) => [
      `${f(compat)} está cerca de ${f(n)}.`,
      `${d} × ${q} = ${d * q}, así que ${f(compat)} ÷ ${d} = ${f(est)} — ¡fácil!`,
      `Los otros números son más difíciles de dividir por ${d} o están más lejos de ${f(n)}. Respuesta: <b>${f(compat)}</b>`,
    ],
    // 5-3
    g53first: (n, d, q, r) => `${n} ÷ ${d} = ${q} R ${r} &nbsp;(${d} × ${q} = ${d * q}, y ${d * q} + ${r} = ${n})`,
    g53hint: (n, d) => `Primero halla ${n} ÷ ${d}. Luego piensa: ¿qué significa el residuo en este problema?`,
    // cociente y residuo
    qrHint: (n, d) => `Pregunta: ¿cuántos grupos de ${d} hay en ${f(n)}? Empieza con un número fácil como ${d} × 10 o ${d} × 100.`,
    g56hint: "Reparte primero las centenas, luego las decenas y luego las unidades. Reagrupa lo que sobre en el siguiente lugar.",
    g57hint: "Reparte un lugar a la vez, empezando por el lugar más grande. Si un lugar no se puede repartir, escribe 0 y reagrupa.",
    g58hint: "Usa cocientes parciales o la repartición, ¡el que prefieras! Estima primero para saber más o menos qué tan grande es la respuesta.",
    // 5-4
    airplane: (n, d) => `Un avión tiene ${d} asientos en cada fila. Si hay ${f(n)} pasajeros, ¿cuántas filas se necesitan?`,
    airplaneHint: (n, d) => `Halla ${f(n)} ÷ ${d}. ¿Cuántos grupos de ${d} hay en ${f(n)}?`,
    // 5-9
    g59hint: (d, q, n, div) => `Usa la operación básica ${d * q} ÷ ${d} = ${q}. Luego piensa en los ceros: ${f(div)} × ? = ${f(n)}`,
    g59steps: (d, q, n, div, ans) => [
      `Operación básica: ${d * q} ÷ ${d} = ${q}.`,
      `Piensa en la multiplicación: ${f(div)} × ? = ${f(n)}`,
      `${f(div)} × ${f(ans)} = ${f(n)}, así que ${f(n)} ÷ ${f(div)} = <b>${f(ans)}</b>`,
    ],
    // 5-10
    g510hint: (n, D) => `Redondea ${D} a la decena más cercana. Luego busca un número cercano a ${f(n)} que sea fácil de dividir por ese número.`,
    g510steps: (n, D, R, compat, est) => [
      `Redondea ${D} a <b>${R}</b>.`,
      `${f(compat)} está cerca de ${f(n)} y es fácil de dividir por ${R}: ${R} × ${f(est)} = ${f(compat)}.`,
      `Entonces, ${f(n)} ÷ ${D} es aproximadamente <b>${f(est)}</b>.`,
    ],

    exactStories: [
      (n, d, N) => `${N} tiene ${f(n)} calcomanías y las reparte en partes iguales entre ${d} amigos. ¿Cuántas calcomanías recibe cada amigo?`,
      (n, d) => `Un granjero empaca ${f(n)} manzanas en partes iguales en ${d} cajas. ¿Cuántas manzanas van en cada caja?`,
      (n, d) => `La biblioteca de la escuela pone ${f(n)} libros en partes iguales en ${d} estantes. ¿Cuántos libros hay en cada estante?`,
      (n, d) => `${f(n)} personas viajan en un tren con ${d} vagones. Cada vagón lleva el mismo número de personas. ¿Cuántas personas van en cada vagón?`,
      (n, d) => `Un zoológico pide ${f(n)} libras de comida para que ${d} elefantes la compartan en partes iguales. ¿Cuántas libras recibe cada elefante?`,
    ],
    leftoverStories: [
      (n, d, N) => `${N} tiene ${f(n)} calcomanías para repartir en partes iguales entre ${d} amigos. ¿Cuántas calcomanías recibe cada amigo? ¿Cuántas sobran?`,
      (n, d) => `Un panadero tiene ${f(n)} galletas y pone el mismo número en cada una de ${d} cajas. ¿Cuántas galletas van en cada caja? ¿Cuántas sobran?`,
      (n, d) => `Un equipo recoge ${f(n)} latas y las divide en partes iguales en ${d} bolsas. ¿Cuántas latas hay en cada bolsa? ¿Cuántas sobran?`,
      (n, d, N) => `${N} tiene ${f(n)} cuentas para poner en partes iguales en ${d} pulseras. ¿Cuántas cuentas van en cada pulsera? ¿Cuántas sobran?`,
      (n, d) => `Una clase tiene ${f(n)} palitos de manualidades para repartir en partes iguales entre ${d} mesas. ¿Cuántos palitos recibe cada mesa? ¿Cuántos sobran?`,
    ],
    remainderStories: [
      {
        icon: "🃏",
        setup: (n, d, N) => `${N} tiene ${n} tarjetas de fútbol. Pone ${d} tarjetas en cada página de un álbum.`,
        up: N => `¿Cuántas páginas necesita ${N} para guardar TODAS las tarjetas?`,
        down: () => "¿Cuántas páginas están completamente llenas?",
        rem: () => "¿Cuántas tarjetas hay en la última página, que no está llena?",
        upStep: upStep("tarjeta", "tarjetas", "una página"),
        downStep: downStep("las páginas llenas"),
        remStep,
      },
      {
        icon: "🧒",
        setup: (n, d) => `${n} estudiantes van de excursión. En cada camioneta caben ${d} estudiantes.`,
        up: () => "¿Cuántas camionetas se necesitan para que todos los estudiantes puedan ir?",
        down: () => "¿Cuántas camionetas irán completamente llenas?",
        rem: () => "¿Cuántos estudiantes van en la camioneta que no está llena?",
        upStep: upStep("estudiante", "estudiantes", "una camioneta"),
        downStep: downStep("las camionetas llenas"),
        remStep,
      },
      {
        icon: "🥚",
        setup: (n, d) => `Una granja recogió ${n} huevos. En cada cartón caben ${d} huevos.`,
        up: () => "¿Cuántos cartones se necesitan para empacar TODOS los huevos?",
        down: () => "¿Cuántos cartones se pueden llenar completamente?",
        rem: () => "¿Cuántos huevos sobran después de llenar los cartones?",
        upStep: upStep("huevo", "huevos", "un cartón"),
        downStep: downStep("los cartones llenos"),
        remStep,
      },
      {
        icon: "🍪",
        setup: (n, d, N) => `${N} horneó ${n} galletas y pone ${d} galletas en cada bolsa para vender.`,
        up: N => `¿Cuántas bolsas necesita ${N} para guardar TODAS las galletas?`,
        down: N => `¿Cuántas bolsas llenas puede vender ${N}?`,
        rem: N => `¿Cuántas galletas le sobran a ${N} para comer?`,
        upStep: upStep("galleta", "galletas", "una bolsa"),
        downStep: downStep("las bolsas llenas"),
        remStep,
      },
      {
        icon: "🏕️",
        setup: (n, d) => `${n} campistas duermen en tiendas de campaña. En cada tienda caben ${d} campistas.`,
        up: () => "¿Cuántas tiendas se necesitan para que cada campista tenga dónde dormir?",
        down: () => "¿Cuántas tiendas están completamente llenas?",
        rem: () => "¿Cuántos campistas hay en la tienda que no está llena?",
        upStep: upStep("campista", "campistas", "una tienda"),
        downStep: downStep("las tiendas llenas"),
        remStep,
      },
    ],

    world: {
      garage: (n, d, N) => `La familia de ${N} ganó $${n} en una venta de garaje. ${d} personas se reparten el dinero en partes iguales. ¿Cuántos dólares enteros recibe cada persona?`,
      garageHint: (n, d) => `Halla ${n} ÷ ${d}. ¿Se pueden repartir los dólares que sobran?`,
      garageEnd: (q, r) => `Cada persona recibe <b>$${q}</b> (${pl(r, "el", "los")} $${r} que ${pl(r, "sobra no se puede", "sobran no se pueden")} repartir en dólares enteros).`,
      board: (n, d, N) => `Una tabla mide ${n} pulgadas de largo. ${N} la corta en ${d} pedazos iguales. ¿Cuántas pulgadas mide cada pedazo?`,
      boardHint: (n, d) => `Divide el largo entre el número de pedazos: ${n} ÷ ${d}.`,
      gas: (miles, D) => `Un carro recorrió ${miles} millas con ${D} galones de gasolina. ¿Aproximadamente cuántas millas recorrió con cada galón?`,
      gasHint: (miles, D, R) => `Estima ${miles} ÷ ${D}. Primero redondea ${D} a ${R}.`,
      gasSteps: (miles, D, R, compat, est) => [
        `Redondea ${D} a ${R}. ${f(compat)} está cerca de ${miles}.`,
        `${f(compat)} ÷ ${R} = ${est}, así que aproximadamente <b>${est}</b> millas por galón.`,
      ],
      library: (a, b, d) => `Una biblioteca tenía ${a} libros. Recibió ${b} libros más. La bibliotecaria pone todos los libros en partes iguales en ${d} estantes. ¿Cuántos libros van en cada estante?`,
      libraryHint: d => `¡Dos pasos! Primero suma para hallar el total de libros. Luego divide por ${d}.`,
      librarySteps: (a, b, total, d, q) => [`Paso 1: ${a} + ${b} = ${total} libros en total.`, `Paso 2: ${total} ÷ ${d} = <b>${q}</b>`, `Comprueba: ${d} × ${q} = ${total} ✔`],
      beads: (n, u, d, N) => `${N} tiene ${n} cuentas. Usa ${u} cuentas para hacer un collar y pone el resto en partes iguales en ${d} frascos. ¿Cuántas cuentas van en cada frasco?`,
      beadsHint: d => `¡Dos pasos! Primero resta las cuentas usadas. Luego divide lo que queda por ${d}.`,
      beadsSteps: (n, u, rest, d, q) => [`Paso 1: ${n} − ${u} = ${rest} cuentas quedan.`, `Paso 2: ${rest} ÷ ${d} = <b>${q}</b>`, `Comprueba: ${d} × ${q} = ${rest} ✔`],
      vans: (n, d) => `${n} estudiantes van al museo de ciencias. En cada minivan caben ${d} estudiantes. ¿Cuántas minivans se necesitan para que todos puedan ir?`,
      vansHint: (n, d) => `Halla ${n} ÷ ${d}. ¿Qué debes hacer con los estudiantes que sobran?`,
      vansSteps: (n, d, q, r) => [`${n} ÷ ${d} = ${q} R ${r}`, `${pl(r, "El estudiante que sobra todavía necesita", `Los ${r} estudiantes que sobran todavía necesitan`)} transporte, así que suma 1 minivan más: <b>${q + 1}</b>.`],
      tickets: (n, d) => `El 4.º grado vendió boletos para una obra de teatro a $${d} cada uno. Recaudaron $${f(n)}. ¿Cuántos boletos vendieron?`,
      ticketsHint: (n, d) => `Cada boleto cuesta $${d}. ¿Cuántos grupos de $${d} hay en $${f(n)}?`,
    },
  },
};
})();
