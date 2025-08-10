# Color Golf

A tiny one-screen puzzle: make the **left** color match the **right** by entering **RGB deltas** (changes) like `(+10, -5, 0)`. Channels clamp to 0–255. You win when the hidden RGB **Manhattan distance** is within the chosen tolerance.

---

## Quick start

* Open `index.html` in any modern browser. No build step, no dependencies.
* Or serve the folder (recommended for querystring features):

  ```bash
  # pick one
  python -m http.server 8000
  npx http-server -p 8000
  ```

  Then visit `http://localhost:8000/`.

---

## How to play

1. **Pick a tolerance**

   * Default (26) · Easy (60) · Hard (0)

2. **Choose a mode**

   * **Daily Game** – deterministic pair of colors for *today* (based on your local date).
   * **Random Game** – two fresh random colors.

3. **Make moves**
   Type three integers for **R**, **G**, **B** (blanks count as `0`) and hit **Make Move** (or press **Enter**).

   * Each move adds your deltas to the current color.
   * Each channel is **clamped** to `0…255`.
   * Pure zero moves `(0, 0, 0)` are ignored (not logged, doesn’t spend a move).
   * Your deltas are recorded in a **Move log** like `(+12, -7, 0)`.

4. **Use the hint (optional, once per move)**
   Click **Get HSL Hint** to see guidance like “increase Hue, keep Saturation, decrease Lightness.” This converts both colors to HSL and nudges you toward the target. Using it increments **Hints Used** and locks hints until you make a real (non-zero) move.

5. **Win condition**
   After every move the game computes the hidden RGB **Manhattan distance**
   `|Rcur−Rtar| + |Gcur−Gtar| + |Bcur−Btar|`.
   You win when that sum is **≤ tolerance**. On win:

   * The exact hex codes are revealed.
   * A share button appears (works even if X/Twitter widgets are blocked).

6. **Restart**
   Hit **↺ Restart** to return to setup and pick a different tolerance or mode.

---

## Controls & niceties

* **Enter** → makes a move.
* **Hints Used** and **Moves** counters are shown live.
* Hex codes are hidden (and removed from the accessibility tree) **during play** to avoid spoilers; they’re revealed on win.
* Optional British spelling: append `?british` for **Colour Golf** and a 🇬🇧 badge.

---

## Game options & URLs

* **Tolerance**

  * `Default (26)` – tight but forgiving
  * `Easy (60)` – great for learning
  * `Hard (0)` – exact match only

* **Daily vs Random**

  * **Daily** colors are generated deterministically from your **local date** (`YYYY-MM-DD`), so everyone on the same date sees the same puzzle.
  * **Random** uses `crypto.getRandomValues` when available, falling back to `Math.random`.

* **Querystrings**

  * `?british` → switches “Color” → “Colour”.
  * `?test` → runs lightweight console tests (see Dev Notes).

Examples:

```
index.html?british
index.html?test
index.html?british&test
```

---

## Strategy tips

* Use **HSL Hint** to choose the direction, then translate that into sensible RGB steps.

  * “Increase Lightness” → bump all of R, G, B upward.
  * “Decrease Saturation” → move channels toward their average.
  * Hue changes are trickier—adjust the most dominant channels toward the target hue.

* Work in **smaller steps** near the finish so clamping doesn’t overshoot.

---

## Accessibility & UX

* Semantic labels for swatches; current/target colors are described.
* Hex values stay hidden from screen readers until you win (prevents accidental spoilers).
* Clear focus styles and high-contrast palette.

---

## Under the hood

* **Distance metric:** RGB **Manhattan distance** (L1) drives the win check.
* **Clamping:** Channels are clamped to `0…255` after each move.
* **Move logging:** Signed formatting (`+n`, `-n`, `0`) mirrors your input.
* **Hint cadence:** At most one hint per move; zero moves don’t unlock hints.
* **Daily generation:**

  * Seed = FNV-1a 32-bit hash of `"YYYY-MM-DD:cur"` / `":tar"` (local date).
  * Pseudorandom = Mulberry32 seeded from that hash.
  * Each channel is `floor(rng * 256)`.
* **Random generation:** Uses `window.crypto.getRandomValues` when available.
* **Share button:** Falls back to a plain X/Twitter Web Intent link, and upgrades to the official widget if `widgets.js` loads.

---

## Dev notes

* Single file (`index.html`). Vanilla JS, no frameworks, no build.
* Run quick smoke tests by visiting `index.html?test` and opening the console:

  * Validates `rgbToHsl`, `clamp`, Manhattan sum, deterministic seeding, etc.

---

## License

**CC0 1.0 Universal (Public Domain).**
You can copy, modify, distribute, and perform the work, even for commercial purposes, all without asking permission.
