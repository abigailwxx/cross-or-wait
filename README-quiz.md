# Wait For It · 15 Westminster Street website

This folder is the **QUIZ + DATA** part of our site. It is one self-contained file, `index.html` (no build step and no frameworks; the only outside resource is Google Fonts).

## What's in index.html

| Part | Element id | What it does |
|---|---|---|
| Homepage / splash | `#splash` | Big "CROSS OR WAIT" in block letters. The letters break into dots, and the dots become a network (4 pedestrians, 4 drivers, 2 signals). Hovering a dot shows that person's interview answer. ENTER goes to the quiz. |
| Quiz start | `#start` | "What kind of pedestrian are you?" plus a big PRESS button. |
| Questions 1–6 | `#question` | One sentence and two push buttons per question. Data is in `QUESTIONS` in the script. |
| Reveal | `#reveal` | The 6 answers orbit the button, then "SEE MY TYPE". |
| Result | `#result` | One of 4 types: Believer, Checker, Masher, Gap-Finder (data is in `TYPES`). |
| Everyone's results | `#results` | A live dot map, type counts and per-question splits from every test taken. Open it directly with `#results` at the end of the URL. |

## Visual system (please keep it when combining)

- Colors (CSS variables in `:root`):
  - `--bg #111931` (night road)
  - `--card #1B2547`
  - `--navy #00017A`
  - `--lime #BAFD50` (titles)
  - `--cyan #75FBFD` (drivers / cars)
  - `--yellow #FFFF75` (pedestrians)
  - `--pink #EA3380` (signals / DON'T WALK)
  - `--white`
  - `--dim #8A93B2`
- Fonts:
  - **Doto** for titles (dot-matrix, from Google Fonts).
  - **DM Mono** for everything else.
  - The splash title uses hand-built 5×7 block letters (`GLYPH` in the script), not a font.
- Push button component: `.push` (it sets `--accent` and `--size`). It glows on hover and sinks in on press.

## Navigation plan for the full site

HOMEPAGE → **GAME** · **QUIZ** · **MOTION** · **DATA**.

GAME and MOTION are made by other group members. When combining:
1. Keep `#splash` as the homepage.
2. Add GAME and MOTION as their own sections (or pages).
3. Point the splash's top links to all four sections.

## Saving results (Google Sheet)

At the top of the script:

```js
const RESULTS_URL = "";
```

If it is empty, the quiz still works, but results aren't saved. To turn saving on:

1. Make a Google Sheet. Go to Extensions → Apps Script and paste in `google-apps-script.gs`.
2. Deploy → New deployment → Web app. Set "Execute as: Me" and "Who has access: Anyone".
3. Paste the `/exec` link into `RESULTS_URL`.

Every finished test adds or updates one row: time, id, type, road, go, q1–q6. A retake from the same browser replaces that person's row.

## Publishing

Upload `index.html` to Netlify Drop (app.netlify.com/drop) or to GitHub Pages. Nothing else is needed.
