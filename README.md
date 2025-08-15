# Color Golf

A browser game, live [here](https://thiagovscoelho.github.io/colorgolf/). Make the left color match the right using **RGB deltas**. Type changes for **R / G / B**, clamp happens automatically, and you win when the hidden RGB **Manhattan distance** is within the chosen tolerance.

> Add `?british` to the URL for **Colour Golf** 🇬🇧
> Add `?test` to run lightweight console tests.

---

## Demo & Running

This is a single, static HTML file. No build, no deps.

* Open `index.html` in any modern browser.
* Click **Daily Game** (seeded by your local date) or **Random Game**.
* Optional: network is only used to render an *X (Twitter)* share button **after a win**; the game itself is offline-ready.

---

## How to Play

1. Enter three integers for **R**, **G**, **B** (positives or negatives).

   * Leaving a box blank counts as **0**.
2. Click **Make Move** (or press **Enter**).

   * Your deltas are **added** to the current color.
   * Each channel is **clamped** to `0–255`.
   * The move is logged like `(+10, -5, 0)`; the **Moves** counter increments.
3. (Optional) Press **Get HSL Hint** **once per move** to see guidance like
   *“increase Hue, keep Saturation, decrease Lightness.”*

   * Using a hint increments **Hints Used** and locks hints until you make another move.
4. You **win** when `|Rcur−Rtar| + |Gcur−Gtar| + |Bcur−Btar| ≤ tolerance`.

   * On win, the hex codes are revealed and a share button appears.

**Phone tip:** Tap the **R/G/B** labels to quickly flip the sign of that input (handy if your numeric keypad lacks a minus key).

---

## Modes & Tolerance

* **Daily Game** — Deterministic puzzle for *your* local date (`YYYY-MM-DD`).

  * The current and target colors are seeded from the date via FNV-1a → Mulberry32.
* **Random Game** — Fresh colors each time (`crypto.getRandomValues` when available).

**Tolerance options:**

* **Default (26)** – balanced
* **Easy (60)** – generous
* **Hard (0)** – exact match only

---

## Hints (HSL)

Hints compare **H**, **S**, **L** of the current and target colors:

* Hue direction respects the **shortest path on the color wheel**.
* Tiny differences are treated as “keep” (≈ `<1°` hue, `<0.5` points for S/L on a 0–100 scale).
* One hint per move; making a non-zero move unlocks the next hint.

---

## Controls & Shortcuts

* **Enter** – Make Move
* **↺ Restart** – Return to setup (pick a new tolerance or mode).
* **R/G/B label click** – Flip sign of its input.

---

## Accessibility

* Game area uses `aria-live="polite"` for updates.
* Swatches expose `role="img"` with labels.
* Hex codes remain **hidden** (and `aria-hidden`) during play to avoid spoilers; revealed on win.

---

## Share Your Win

After winning, a large **Share** button appears:

* Prefills text like:
  `I won today's (2025-08-09) #ColorGolf game in 6 moves in Default tolerance! (used 1 hints)`
* Uses *X (Twitter) widgets.js* when possible; falls back to a standard web-intent link.
* No tracking beyond that (widgets use `dnt: true`).

---

## Implementation Notes

* **State:** current color, target color, move count, hints used, tolerance label, mode, local date.
* **Update rule:** `next = clamp(cur + delta)` per channel; zeros-only deltas are ignored (don’t spend a move and don’t unlock a hint).
* **Distance:** RGB **Manhattan** metric decides victory.
* **Seeding (Daily):**

  * Seed strings: `YYYY-MM-DD:cur` and `YYYY-MM-DD:tar` hashed with **FNV-1a 32-bit**.
  * Hash → **Mulberry32** PRNG → three `0–255` integers per color.
  * Daily is based on the **player’s local date**, not UTC.
* **Random:** uses `crypto.getRandomValues` when available, otherwise `Math.random`.
* **Testing:** `?test` query runs lightweight console assertions for utilities (RGB↔HSL sanity, clamp, Manhattan, seeding determinism, parsing, sign flipping).

---

## Development

* Edit the single HTML file; everything (HTML/CSS/JS) is inline.
* Any static host works (GitHub Pages, Netlify, etc.).
* No build steps required.

---

## License

**CC0 1.0 Universal (Public Domain).**
To the extent possible under law, the author has waived all copyright and related or neighboring rights to this work. See [https://creativecommons.org/publicdomain/zero/1.0/](https://creativecommons.org/publicdomain/zero/1.0/) for details.

---

## Credits

Built as a tiny puzzle/toy for color intuition and quick keyboard play. Have fun!
