#!/usr/bin/env python3
"""Build js/lesson-help.js from the Savvas Florida Family Engagement lesson pages.

For every Topic 5 lesson it pulls:
  * "MATH HELP AT HOME" (sample practice exercise)
  * "HOME ACTIVITY" (title + materials + activity)
  * the Visual Learning Animation and Another Look Video links
and downloads the example images into assets/lessons/ so the app works offline.

Usage:  python3 tools/extract_lesson_help.py [--langs en,es]
Run from the division-quest folder. Only uses the Python standard library.
"""
import argparse
import html
import json
import os
import re
import urllib.request
from html.parser import HTMLParser

BASE = "https://media.pk12ls.com/curriculum/math/enVisionFlorida_2023/family_engage/"
LESSONS = [f"5-{i}" for i in range(1, 12)]
ALLOWED = {"p", "b", "strong", "i", "em", "br", "ul", "ol", "li", "table", "tr", "td", "th", "sup", "sub"}
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSET_DIR = os.path.join(HERE, "assets", "lessons")


def fetch(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        return r.read()


class Cleaner(HTMLParser):
    """Keep simple formatting tags, turn MathML into text and download images."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.math = 0
        self.frac = []  # stack of [parts] for <mfrac>

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "math":
            self.math += 1
            self.out.append('<span class="mth">')
        elif tag == "mfrac":
            self.frac.append(len(self.out))
        elif tag == "img" and a.get("src"):
            self.out.append(save_image(a["src"], a.get("alt", "")))
        elif tag in ALLOWED and not self.math:
            self.out.append("<br>" if tag == "br" else f"<{tag}>")

    def handle_endtag(self, tag):
        if tag == "math":
            self.math -= 1
            self.out.append("</span>")
        elif tag == "mfrac" and self.frac:
            start = self.frac.pop()
            parts = [p for p in self.out[start:] if p.strip()]
            del self.out[start:]
            if len(parts) == 2:
                self.out.append(f'<span class="frac"><sup>{parts[0]}</sup>&frasl;<sub>{parts[1]}</sub></span>')
            else:
                self.out.append("/".join(parts))
        elif tag in ALLOWED and tag != "br" and not self.math:
            self.out.append(f"</{tag}>")

    def handle_data(self, data):
        txt = html.escape(data.replace("\xa0", " "), quote=False)
        if self.math:
            txt = txt.strip()
            if txt in ("÷", "×", "=", "+", "−", "-"):
                txt = f" {txt} "
        self.out.append(txt)

    def result(self):
        s = "".join(self.out)
        s = re.sub(r"[ \t\r\n]+", " ", s)
        for _ in range(3):  # remove empty tags, including nested ones like <p><b> </b></p>
            s = re.sub(r"<(p|b|li|i|em|strong)>\s*</\1>", "", s)
        s = re.sub(r"\s*(<br>\s*)+</p>", "</p>", s)
        return s.strip()


def save_image(src, alt):
    os.makedirs(ASSET_DIR, exist_ok=True)
    name = os.path.basename(src)
    path = os.path.join(ASSET_DIR, name)
    if not os.path.exists(path):
        with open(path, "wb") as f:
            f.write(fetch(BASE + src.lstrip("./")))
    return f'<img src="assets/lessons/{name}" alt="{html.escape(alt)}">'


def clean(fragment):
    c = Cleaner()
    c.feed(fragment)
    return c.result()


def text(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", fragment))).strip()


def sections(page):
    """Return {h2 title: [(h3 title, body html), ...]} for each page section."""
    out = {}
    for sec in page.split('<div class="page-section">')[1:]:
        h2 = re.search(r"<h2>(.*?)</h2>", sec, re.S)
        if not h2:
            continue
        subs = []
        for m in re.finditer(r"<h3>(.*?)</h3>.*?<div class=\"columns-1\">(.*?)</div>\s*</div>\s*</div>\s*<!-- End Subsection", sec, re.S):
            subs.append((text(m.group(1)), m.group(2)))
        if not subs:  # section without subsections (e.g. overview "Connect the math")
            body = re.search(r"<!-- Section Text -->(.*?)<!-- Sub Sections -->", sec, re.S)
            subs.append(("", body.group(1) if body else ""))
        out[text(h2.group(1)).upper()] = subs
    return out


def lesson_help(lesson, lang):
    n = int(lesson.split("-")[1])
    page_url = f"{BASE}g04_t05_l{n:02d}_{lang}.html"
    page = fetch(page_url).decode("utf-8")
    if not page.strip():
        return overview_help(lang)

    links = [u for u in re.findall(r'href="(https://us-school\.pk12ls\.com/[^"]+/player\.html)"', page)
             if "Glossary" not in u]
    secs = sections(page)
    help_key = next(k for k in secs if k.startswith(("MATH HELP", "MATEMÁTICAS")))
    act_key = next(k for k in secs if k.startswith(("HOME ACTIVITY", "ACTIVIDAD")))
    act_title, act_body = secs[act_key][0]
    return {
        "page": page_url,
        "animation": links[0] if links else None,
        "video": links[1] if len(links) > 1 else None,
        "mathHelp": [{"title": t, "html": clean(b)} for t, b in secs[help_key]],
        "activity": {"title": act_title, "html": clean(act_body)},
    }


def overview_help(lang):
    """Lesson 5-11 has no family page; use the topic overview's 'Connect the math'."""
    page_url = f"{BASE}g04_t05_overview_{lang}.html"
    secs = sections(fetch(page_url).decode("utf-8"))
    key = next(k for k in secs if k.startswith(("CONNECT", "CONECTAR")))
    return {
        "page": page_url,
        "animation": None,
        "video": None,
        "mathHelp": [],
        "activity": {"title": key.capitalize(), "html": clean(secs[key][0][1])},
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--langs", default="en")
    args = ap.parse_args()
    data = {}
    for lesson in LESSONS:
        data[lesson] = {lang: lesson_help(lesson, lang) for lang in args.langs.split(",")}
        print(lesson, "ok")
    out = os.path.join(HERE, "js", "lesson-help.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("// Generated by tools/extract_lesson_help.py from the Savvas Florida Family Engagement pages.\n")
        f.write("// Do not edit by hand — re-run the script instead.\n")
        f.write("const LESSON_HELP = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    print("wrote", out)


if __name__ == "__main__":
    main()
