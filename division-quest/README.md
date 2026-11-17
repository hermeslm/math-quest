# 🦉 Division Quest

Interactive, randomly generated practice tests for **enVision Florida Grade 4 – Topic 5: Divide by 1-Digit Numbers** (lessons 5-1 to 5-11).

## How to run
Double-click `index.html` to open it in any web browser. You don't need to install anything or connect to the internet. The fancy font needs internet; without it, a normal font is used.

## What's inside
- 11 lessons plus a mixed **Topic 5 Test**. Every test gets new random numbers.
- Answer types: number, quotient + remainder, and multiple choice (for estimating).
- On-screen number pad for tablets. On a computer, just type and press Enter.
- 2 tries per question, a 💡 hint, and a step-by-step "How to solve it" after each question (partial quotients, sharing with regrouping, compatible numbers, remainder stories).
- Stars and best scores saved in this browser, plus sounds (🔊 button) and celebrations.
- 🖨️ Printable worksheet with an answer key for any lesson.
- 👪 **Help at home** for each lesson. It has the Math Help at Home example, the Home Activity, links to the Visual Learning Animation and Another Look Video, and a step-by-step guide for parents.
- 🌐 **English / Español**. Use the button at the top. The app starts in the browser's language and remembers your choice. Each test is built in both languages with the same numbers, so you can switch in the middle of a test.

## Files
- `index.html` – page layout
- `css/style.css` – look and feel (has dark mode)
- `js/generators.js` – random question makers, one per lesson. All the math is here; edit number ranges here.
- `js/lang/en.js`, `js/lang/es.js` – all the words, for both the screens and the questions. To add a language, copy one of these files.
- `js/lesson-help.js` – Help at Home content, generated from the enVision Florida family pages
- `js/app.js` – quiz screens, scoring, keypad, sounds, printing, language switch
- `tools/extract_lesson_help.py` – rebuilds `js/lesson-help.js` and `assets/lessons/`:
  `python3 tools/extract_lesson_help.py --langs en,es`
