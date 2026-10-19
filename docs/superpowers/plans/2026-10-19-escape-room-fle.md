# Escape Room FLE Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, desktop-first escape-room puzzle game themed on
the Fondazione Luigi Einaudi, playable via a shared link, visually styled
like the Fondazione's real social graphics, and publish it as a Claude
Artifact.

**Architecture:** One static `index.html` + `styles.css` + a set of vanilla
JS modules (ES modules, no bundler). Pure game-logic (lock codes, matching
checks, ordering checks, save/resume) lives in `.mjs` files with zero DOM
dependency, so they're testable directly with Node's built-in `assert` —
no test framework needed. DOM wiring (rendering rooms, handling clicks)
lives in separate `.js` files that import the logic modules and manual-test
in the browser. A single `state.mjs` module tracks current room + collected
letters and persists to `localStorage` only as a resume convenience.

**Tech Stack:** Vanilla HTML/CSS/JS (ES modules), Node.js (built-in
`assert`, no npm packages) for logic unit tests, Google Fonts (Montserrat,
Fira Sans Condensed / Fira Sans Extra Condensed), Claude Artifact for
hosting/sharing.

**Spec:** `/Users/pietrozanardi/Desktop/escape-room-fle-einaudi/DESIGN.md`

## Global Constraints

- Desktop-first in this version; no mobile layout (DESIGN.md "Non-goals").
- No backend, no accounts, no shared/cross-device save (DESIGN.md "Non-goals").
- `localStorage` used only to resume progress in the same browser, never for
  shared state (DESIGN.md "Vincoli tecnici").
- No build step: static files only, ES modules loaded directly by the browser.
- Palette: navy `#0C2454`, blue `#0C3C6C`, azzurro `#4F7DB0`, nero `#04070F`,
  white, **yellow `#F2B705` as accent only** — never a large fill (DESIGN.md
  "Stile visivo").
- Fonts: **Montserrat** for body/UI; **Fira Sans Extra Condensed 800** for
  poster-style titles; **Fira Sans Condensed Bold 700** for the blue subtitle
  line (DESIGN.md "Stile visivo").
- People = circular avatars with initials (no real face photos), except
  **Giuseppe Benedetto**, who uses the existing authorized photo at
  `~/.claude/skills/Fleinaudi/assets/template_html/assets/autore.jpg`
  (DESIGN.md "Foto/ritratti").
- No invented quotes or facts attributed to real people — only the verbatim
  text in DESIGN.md "Materiali reali verificati" may appear in-game.
- Room 1 lock code: **1962** (no letter awarded). Rooms 2–6 each award one
  letter, in order: **L, U, I, G, I**. Final lock code: **LUIGI**
  (case-insensitive, trimmed).
- Logo FE: reuse `~/.claude/skills/Fleinaudi/assets/logo.png` directly
  (already authorized), shown white-on-dark via CSS filter.
- Sede background photos: download from
  `https://www.fondazioneluigieinaudi.it/wp-content/uploads/2021/05/fle-slide-sede-N-min.jpg`
  (N = 1..7) — ask the user's explicit permission before downloading,
  naming each file and its source URL, per the download-permission rule.

## Review Focus

- A player mistyping a lock code (wrong length, extra spaces, lowercase)
  should see a clear "not quite" state and stay able to retry — never a
  silent no-op or a JS error that freezes the room.
- Closing/reloading the tab mid-game must resume at the same room with the
  same letters collected; a brand-new browser with no saved state must start
  cleanly at the intro screen, never crash on missing/corrupt `localStorage`.
- The Room 3 president-ordering puzzle must reject a partially-correct order
  (e.g. two presidents swapped) — only the exact chronological sequence
  unlocks the letter.
- The Room 6 map must let a player click a decoy pin without losing already
  -found correct pins, and without ever revealing which pins are decoys
  before they're clicked.
- The final lock must accept "LUIGI" typed in any case or with leading
  /trailing spaces, since players will type free text, not a fixed-case
  code.

---

## File Structure

```
escape-room-fle-einaudi/
  index.html
  styles.css
  js/
    state.mjs        # pure state/persistence logic (Node-testable)
    room1.mjs         # pure logic: ingresso lock code
    room2.mjs         # pure logic: quote-speaker matching
    room3.mjs         # pure logic: president ordering
    room4.mjs         # pure logic: archive fund matching
    room5.mjs         # pure logic: library fact matching
    room6.mjs         # pure logic: map pin checking
    finale.mjs        # pure logic: final code check
    ui.mjs            # shared DOM helpers: lock widget, letter tray, modal
    main.js           # boot + room router, wires ui.mjs + room renderers
    render-room1.js … render-finale.js  # one DOM-rendering file per room
  assets/
    logo.png          # copied from Fleinaudi skill assets
    benedetto.jpg      # copied from Fleinaudi skill assets (autore.jpg)
    sede-1.jpg … sede-7.jpg  # downloaded from the live site, with permission
  tests/
    test-state.mjs
    test-room1.mjs
    test-room2.mjs
    test-room3.mjs
    test-room4.mjs
    test-room5.mjs
    test-room6.mjs
    test-finale.mjs
```

## Interfaces reference (names every task must match exactly)

- `state.mjs`: `createInitialState()`, `loadState(storage)`,
  `saveState(state, storage)`, `collectLetter(state, roomId, letter)`,
  `isCodeMatch(input, code)`.
- `room1.mjs`: `INGRESSO_CODE = "1962"`.
- `room2.mjs`: `SPEAKER_QUOTES` (object: speaker name → quote string),
  `isQuoteMatchComplete(mapping)`.
- `room3.mjs`: `PRESIDENT_ORDER` (array of 9 names, chronological),
  `isPresidentOrderCorrect(order)`.
- `room4.mjs`: `ARCHIVE_FUNDS` (object: fund name → description string),
  `isArchiveMatchComplete(mapping)`.
- `room5.mjs`: `LIBRARY_FACTS` (object: label → value string),
  `isLibraryMatchComplete(mapping)`.
- `room6.mjs`: `CORRECT_PINS` (array of city ids), `DECOY_PINS` (array of
  city ids), `isMapComplete(foundSet)`.
- `finale.mjs`: `FINAL_CODE = "LUIGI"`.
- `ui.mjs`: `renderLockWidget({code, onSuccess, container})`,
  `renderLetterTray(lettersCollected, container)`,
  `renderModal({title, body, container})`.

---

### Task 1: Project scaffold, visual foundation, and real assets

**Files:**
- Create: `index.html`, `styles.css`
- Create: `assets/logo.png`, `assets/benedetto.jpg` (copied, no download)
- Create: `assets/sede-1.jpg` … `assets/sede-7.jpg` (downloaded, permission required)
- Create: `js/main.js` (intro screen only, no rooms yet)

**Interfaces:**
- Produces: the CSS custom properties later tasks rely on:
  `--navy: #0C2454; --blue: #0C3C6C; --azzurro: #4F7DB0; --nero: #04070F;
  --giallo: #F2B705;` plus `.lock-widget`, `.letter-tray`, `.modal`,
  `.avatar-circle` base classes (empty/placeholder styles — filled in by
  later tasks' DOM, but the class names must exist now so later tasks don't
  invent different ones).

- [ ] **Step 1: Copy the two already-authorized assets**

```bash
mkdir -p assets
cp ~/.claude/skills/Fleinaudi/assets/logo.png assets/logo.png
cp ~/.claude/skills/Fleinaudi/assets/template_html/assets/autore.jpg assets/benedetto.jpg
```

- [ ] **Step 2: Ask the user for permission to download the 7 sede photos**

Ask explicitly, naming each file, its source URL, and that these are JPEGs
of a few hundred KB each:
`https://www.fondazioneluigieinaudi.it/wp-content/uploads/2021/05/fle-slide-sede-1-min.jpg`
through `-7-min.jpg`. Do not download before the user says yes.

- [ ] **Step 3: Download the 7 files into `assets/sede-1.jpg` … `assets/sede-7.jpg`**

Once approved, fetch each URL and save under the sequential local names
above (rename from `fle-slide-sede-N-min.jpg` to `sede-N.jpg`).

- [ ] **Step 4: Write `index.html` skeleton**

A single page with: a `<head>` loading Google Fonts (Montserrat; Fira Sans
Extra Condensed; Fira Sans Condensed) and `styles.css`; a `<body>` with one
`#app` container; `<script type="module" src="js/main.js"></script>` at the
end. No room markup yet — `main.js` renders the intro screen into `#app`.

- [ ] **Step 5: Write `styles.css` with the CSS custom properties and base
  classes listed in Interfaces above**

Dark navy background, Montserrat for body text, the lock/tray/modal/avatar
classes present (can be minimal — later tasks add their specific rules).

- [ ] **Step 6: Write `js/main.js` intro screen**

Renders a title card (Fleinaudi poster look: dark background using
`assets/sede-1.jpg` tinted navy via CSS, big condensed title, FE logo
bottom) and a "Comincia" button. Clicking it just logs to console for now
(wired to real room routing in Task 10).

- [ ] **Step 7: Manual verification**

Open `index.html` in the browser pane (`preview_start`), confirm: fonts
load, palette matches the constants above, background photo is visibly
tinted navy/black (not a raw unedited photo), logo appears bottom, no
console errors.

- [ ] **Step 8: Commit**

```bash
git init -q 2>/dev/null; git add -A
git commit -m "Scaffold escape room page with Fleinaudi visual foundation"
```

---

### Task 2: Game state module (`state.mjs`)

**Files:**
- Create: `js/state.mjs`
- Test: `tests/test-state.mjs`

**Interfaces:**
- Consumes: nothing (first logic module).
- Produces: `createInitialState()`, `loadState(storage)`,
  `saveState(state, storage)`, `collectLetter(state, roomId, letter)`,
  `isCodeMatch(input, code)` — exact names/signatures every later room
  module and `main.js` will call.

- [ ] **Step 1: Write the failing tests**

```js
import assert from 'node:assert/strict';
import { createInitialState, loadState, saveState, collectLetter, isCodeMatch } from '../js/state.mjs';

function fakeStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
  };
}

// fresh storage -> initial state, never throws
const freshState = loadState(fakeStorage());
assert.deepEqual(freshState, createInitialState());

// save then load roundtrips
const storage = fakeStorage();
const s = collectLetter(createInitialState(), 'scuola', 'L');
saveState(s, storage);
assert.deepEqual(loadState(storage), s);

// corrupt storage falls back to initial state, does not throw
const corrupt = fakeStorage({ 'fle-escape-room-state': '{not json' });
assert.deepEqual(loadState(corrupt), createInitialState());

// collecting the same room's letter twice does not duplicate it
const once = collectLetter(createInitialState(), 'scuola', 'L');
const twice = collectLetter(once, 'scuola', 'L');
assert.deepEqual(once.lettersCollected, twice.lettersCollected);

// isCodeMatch is case-insensitive and trims whitespace
assert.equal(isCodeMatch('  luigi ', 'LUIGI'), true);
assert.equal(isCodeMatch('LUIG', 'LUIGI'), false);

console.log('all state.mjs tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-state.mjs`
Expected: FAIL (module `../js/state.mjs` not found / functions undefined).

- [ ] **Step 3: Implement `js/state.mjs`**

`createInitialState()` returns `{ currentRoom: 'ingresso', lettersCollected: {} }`
(an object keyed by roomId so re-collecting is a no-op). `loadState(storage)`
reads key `'fle-escape-room-state'`, `JSON.parse`s it, returns
`createInitialState()` if missing or parse fails (wrap in try/catch).
`saveState` `JSON.stringify`s under the same key. `collectLetter` returns a
new state object (don't mutate the input) with `lettersCollected[roomId]`
set to `letter`. `isCodeMatch(input, code)` compares
`input.trim().toUpperCase() === code.toUpperCase()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-state.mjs`
Expected: prints "all state.mjs tests passed", exit code 0.

- [ ] **Step 5: Commit**

```bash
git add js/state.mjs tests/test-state.mjs
git commit -m "Add game state module with persistence and code matching"
```

---

### Task 3: Shared UI widgets (`ui.mjs`) + Room 1 Ingresso

**Files:**
- Create: `js/ui.mjs`, `js/room1.mjs`, `js/render-room1.js`
- Test: `tests/test-room1.mjs`
- Modify: `styles.css` (flesh out `.lock-widget`, `.modal`, `.letter-tray`
  rules), `js/main.js` (route "Comincia" button to render Room 1)

**Interfaces:**
- Consumes: `state.mjs` exports from Task 2.
- Produces: `room1.mjs` exports `INGRESSO_CODE = "1962"`. `ui.mjs` exports
  `renderLockWidget({code, onSuccess, container})` — renders a text input +
  submit button inside `container`; on submit, compares via
  `isCodeMatch` (imported from `state.mjs`); on match calls `onSuccess()`;
  on mismatch shows a `.lock-widget__error` message (e.g. "Non è questo…")
  without clearing the input, so the Review Focus "wrong code" behavior is
  visible and reusable by every later room. `renderModal({title, body,
  container})` and `renderLetterTray(lettersCollected, container)` are also
  defined here (used starting Task 4) even though Room 1 doesn't award a
  letter.

- [ ] **Step 1: Write the failing test for the pure logic**

```js
import assert from 'node:assert/strict';
import { INGRESSO_CODE } from '../js/room1.mjs';
import { isCodeMatch } from '../js/state.mjs';

assert.equal(INGRESSO_CODE, '1962');
assert.equal(isCodeMatch('1962', INGRESSO_CODE), true);
assert.equal(isCodeMatch('1963', INGRESSO_CODE), false);
console.log('all room1.mjs tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-room1.mjs`
Expected: FAIL (`room1.mjs` not found).

- [ ] **Step 3: Implement `js/room1.mjs`**

Exports only the constant `INGRESSO_CODE = "1962"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-room1.mjs`
Expected: prints "all room1.mjs tests passed".

- [ ] **Step 5: Implement `js/ui.mjs`**

Three DOM-rendering functions as described in Interfaces. The lock widget's
error state (Review Focus item 1) must not disable the input or button —
the player must be able to retry immediately.

- [ ] **Step 6: Implement `js/render-room1.js` and wire `js/main.js`**

`render-room1.js` renders the Ingresso scene (tinted `sede-2.jpg` or
similar background, the "È stata costituita nel 1962 da Giovanni Malagodi"
plaque text as a clickable object that opens a modal, then the lock widget
with `code: INGRESSO_CODE`). On success, calls a passed-in `onSolved`
callback. `main.js`'s "Comincia" button now clears `#app` and calls
`renderRoom1(container, onSolved)` where `onSolved` just logs
`"ingresso solved"` for now (real room routing arrives in Task 10).

- [ ] **Step 7: Manual verification**

In the browser: click "Comincia", click the plaque (modal shows the real
1962/Malagodi text), type a wrong code (see the error message, can retry),
type `1962` (success path logs/fires).

- [ ] **Step 8: Commit**

```bash
git add js/ui.mjs js/room1.mjs js/render-room1.js js/main.js styles.css tests/test-room1.mjs
git commit -m "Add shared UI widgets and Room 1 Ingresso puzzle"
```

---

### Task 4: Room 2 — Sala della Scuola di Liberalismo

**Files:**
- Create: `js/room2.mjs`, `js/render-room2.js`
- Test: `tests/test-room2.mjs`

**Interfaces:**
- Consumes: `ui.mjs` (`renderLetterTray`), `state.mjs` (`collectLetter`).
- Produces: `SPEAKER_QUOTES`, `isQuoteMatchComplete(mapping)`.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { SPEAKER_QUOTES, isQuoteMatchComplete } from '../js/room2.mjs';

const speakers = Object.keys(SPEAKER_QUOTES);
assert.equal(speakers.length, 5);
assert.ok(speakers.includes('Elsa Fornero'));

const correctMapping = Object.fromEntries(speakers.map((s) => [s, s]));
assert.equal(isQuoteMatchComplete(correctMapping), true);

const wrongMapping = { ...correctMapping, 'Elsa Fornero': 'Alberto Mingardi' };
assert.equal(isQuoteMatchComplete(wrongMapping), false);

const partialMapping = Object.fromEntries(speakers.slice(0, 4).map((s) => [s, s]));
assert.equal(isQuoteMatchComplete(partialMapping), false);

console.log('all room2.mjs tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-room2.mjs` — Expected: FAIL (module not found).

- [ ] **Step 3: Implement `js/room2.mjs`**

`SPEAKER_QUOTES` = the 5 verbatim speaker→quote pairs from DESIGN.md
("Materiali reali verificati"): Elsa Fornero, Alberto Mingardi, Mattia
Feltri, Alessandro De Nicola, Luciano Floridi, each mapped to its exact
quote string from the spec. `isQuoteMatchComplete(mapping)` returns true
only if `mapping` has all 5 keys and `mapping[speaker] === speaker` for
every one (the game models "matched correctly" as the player's guess for
each speaker equalling the speaker itself, once the UI layer has already
translated clicks into speaker-to-speaker comparisons — see Step 5).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-room2.mjs` — Expected: prints "all room2.mjs tests passed".

- [ ] **Step 5: Implement `js/render-room2.js`**

Renders 5 speaker cards (circular initials avatar + Light-name/
**Bold-SURNAME**) and 5 draggable/clickable quote fragments in a shuffled
order. Click-to-select pairing (per DESIGN.md, left to the builder): click
a speaker, then click a quote, to pair them; re-clicking a speaker changes
its pairing. A "Verifica" button builds the `mapping` object and calls
`isQuoteMatchComplete`; on success, calls `collectLetter(state, 'scuola',
'L')`, persists via `saveState`, shows the letter in the tray via
`renderLetterTray`, and calls the passed-in `onSolved` callback. On
failure, shows the same non-blocking error treatment as the Task 3 lock
widget (mismatched pairs highlighted, player can retry).

- [ ] **Step 6: Manual verification**

In the browser: mismatch a pair deliberately → see error, pairs stay
editable; match all 5 correctly → letter **L** appears in the tray.

- [ ] **Step 7: Commit**

```bash
git add js/room2.mjs js/render-room2.js tests/test-room2.mjs
git commit -m "Add Room 2 Scuola di Liberalismo quote-matching puzzle"
```

---

### Task 5: Room 3 — Galleria dei Presidenti

**Files:**
- Create: `js/room3.mjs`, `js/render-room3.js`
- Test: `tests/test-room3.mjs`

**Interfaces:**
- Produces: `PRESIDENT_ORDER`, `isPresidentOrderCorrect(order)`.

- [ ] **Step 1: Write the failing test (covers Review Focus: near-miss rejected)**

```js
import assert from 'node:assert/strict';
import { PRESIDENT_ORDER, isPresidentOrderCorrect } from '../js/room3.mjs';

assert.equal(PRESIDENT_ORDER.length, 9);
assert.equal(PRESIDENT_ORDER[0], 'Gaetano Martino');
assert.equal(PRESIDENT_ORDER[8], 'Giuseppe Benedetto');
assert.equal(isPresidentOrderCorrect(PRESIDENT_ORDER), true);

const swapped = [...PRESIDENT_ORDER];
[swapped[3], swapped[4]] = [swapped[4], swapped[3]];
assert.equal(isPresidentOrderCorrect(swapped), false);

console.log('all room3.mjs tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-room3.mjs` — Expected: FAIL.

- [ ] **Step 3: Implement `js/room3.mjs`**

`PRESIDENT_ORDER` = the 9 names in DESIGN.md order: Gaetano Martino,
Ruggero Moscati, Vittorio Badini Confalonieri, Franco Mattei, Giancarlo
Lunati, Valerio Zanone, Roberto Einaudi, Mario Lupo, Giuseppe Benedetto.
`isPresidentOrderCorrect(order)` compares `order` element-by-element
against `PRESIDENT_ORDER` (same length and every index equal).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-room3.mjs` — Expected: prints "all room3.mjs tests passed".

- [ ] **Step 5: Implement `js/render-room3.js`**

9 name plaques (no photos — per DESIGN.md's "Foto/ritratti" decision, text
-only plaque cards for historical presidents), shown shuffled, each with
up/down or drag handles to reorder. A "Verifica ordine" button reads the
current order into an array and calls `isPresidentOrderCorrect`; on
success, `collectLetter(state, 'presidenti', 'U')`, update tray, call
`onSolved`; on failure (including a merely-swapped near-miss), same
non-blocking error treatment, order stays editable.

- [ ] **Step 6: Manual verification**

Swap two presidents deliberately → verify fails, order still editable; put
them in the exact order above → letter **U** appears.

- [ ] **Step 7: Commit**

```bash
git add js/room3.mjs js/render-room3.js tests/test-room3.mjs
git commit -m "Add Room 3 Galleria dei Presidenti ordering puzzle"
```

---

### Task 6: Room 4 — Archivio Storico

**Files:**
- Create: `js/room4.mjs`, `js/render-room4.js`
- Test: `tests/test-room4.mjs`

**Interfaces:**
- Produces: `ARCHIVE_FUNDS`, `isArchiveMatchComplete(mapping)`.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { ARCHIVE_FUNDS, isArchiveMatchComplete } from '../js/room4.mjs';

const funds = Object.keys(ARCHIVE_FUNDS);
assert.equal(funds.length, 3);
assert.ok(funds.includes('Fondo Giovanni Malagodi'));

const correct = Object.fromEntries(funds.map((f) => [f, f]));
assert.equal(isArchiveMatchComplete(correct), true);

const wrong = { ...correct, 'Fondo Giovanni Malagodi': 'Fondo Valerio Zanone' };
assert.equal(isArchiveMatchComplete(wrong), false);

console.log('all room4.mjs tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-room4.mjs` — Expected: FAIL.

- [ ] **Step 3: Implement `js/room4.mjs`**

`ARCHIVE_FUNDS` = the 3 verbatim fund→description pairs from DESIGN.md:
Fondo Giovanni Malagodi ("di gran lunga il fondo più importante della
FLE…"), Fondo Valerio Zanone ("relative al suo lungo periodo di storia nel
PLI"), Fondo Antonio Scialoja ("fornisce un aggancio con i primi anni dello
Stato unitario"). `isArchiveMatchComplete` mirrors `isQuoteMatchComplete`'s
logic (all 3 keys present and self-matched).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-room4.mjs` — Expected: prints "all room4.mjs tests passed".

- [ ] **Step 5: Implement `js/render-room4.js`**

3 "faldoni" (folder) cards with fund names, 3 description strips, same
click-to-pair interaction as Room 2. On success: `collectLetter(state,
'archivio', 'I')`, update tray, `onSolved`.

- [ ] **Step 6: Manual verification**

Mismatch → error, retry works; correct match → letter **I** appears.

- [ ] **Step 7: Commit**

```bash
git add js/room4.mjs js/render-room4.js tests/test-room4.mjs
git commit -m "Add Room 4 Archivio Storico matching puzzle"
```

---

### Task 7: Room 5 — Biblioteca

**Files:**
- Create: `js/room5.mjs`, `js/render-room5.js`
- Test: `tests/test-room5.mjs`

**Interfaces:**
- Produces: `LIBRARY_FACTS`, `isLibraryMatchComplete(mapping)`.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { LIBRARY_FACTS, isLibraryMatchComplete } from '../js/room5.mjs';

const labels = Object.keys(LIBRARY_FACTS);
assert.equal(labels.length, 3);
assert.equal(LIBRARY_FACTS['Anno di adesione al Sistema Bibliotecario Nazionale'], '2004');

const correct = Object.fromEntries(labels.map((l) => [l, LIBRARY_FACTS[l]]));
assert.equal(isLibraryMatchComplete(correct), true);

const wrong = { ...correct, [labels[0]]: 'valore sbagliato' };
assert.equal(isLibraryMatchComplete(wrong), false);

console.log('all room5.mjs tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-room5.mjs` — Expected: FAIL.

- [ ] **Step 3: Implement `js/room5.mjs`**

`LIBRARY_FACTS` = `{ 'Anno della donazione di Alberto Giovannini': '1923',
'Anno di adesione al Sistema Bibliotecario Nazionale': '2004', 'Volumi
posseduti oggi': '7.000' }` (values verbatim from DESIGN.md's Biblioteca
source facts). `isLibraryMatchComplete(mapping)` returns true only if, for
every label in `LIBRARY_FACTS`, `mapping[label] === LIBRARY_FACTS[label]`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-room5.mjs` — Expected: prints "all room5.mjs tests passed".

- [ ] **Step 5: Implement `js/render-room5.js`**

3 label cards, 3 shuffled value tiles (1923 / 2004 / 7.000), click-to-pair.
On success: `collectLetter(state, 'biblioteca', 'G')`, update tray,
`onSolved`. Scene note in the narration text: the player has left the main
building and is now at Via della Traspontina 15 (per DESIGN.md's "piccolo
colpo di scena").

- [ ] **Step 6: Manual verification**

Mismatch → error, retry; correct match → letter **G** appears.

- [ ] **Step 7: Commit**

```bash
git add js/room5.mjs js/render-room5.js tests/test-room5.mjs
git commit -m "Add Room 5 Biblioteca matching puzzle"
```

---

### Task 8: Room 6 — Mappa delle Sedi Regionali

**Files:**
- Create: `js/room6.mjs`, `js/render-room6.js`
- Test: `tests/test-room6.mjs`

**Interfaces:**
- Produces: `CORRECT_PINS`, `DECOY_PINS`, `isMapComplete(foundSet)`.

- [ ] **Step 1: Write the failing test (covers Review Focus: decoy doesn't
  reset progress)**

```js
import assert from 'node:assert/strict';
import { CORRECT_PINS, DECOY_PINS, isMapComplete } from '../js/room6.mjs';

assert.equal(CORRECT_PINS.length, 5);
assert.ok(CORRECT_PINS.includes('napoli'));
assert.ok(DECOY_PINS.length >= 2);
assert.equal(new Set([...CORRECT_PINS, ...DECOY_PINS]).size, CORRECT_PINS.length + DECOY_PINS.length);

const found = new Set(CORRECT_PINS.slice(0, 4));
assert.equal(isMapComplete(found), false);

const allFound = new Set(CORRECT_PINS);
assert.equal(isMapComplete(allFound), true);

console.log('all room6.mjs tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-room6.mjs` — Expected: FAIL.

- [ ] **Step 3: Implement `js/room6.mjs`**

`CORRECT_PINS = ['napoli', 'trieste', 'milano', 'capo-dorlando', 'firenze']`
(the 5 real secondary offices). `DECOY_PINS` = the builder's choice of 2-3
Italian city ids with no real FLE office (e.g. `['torino', 'bologna',
'genova']` — per DESIGN.md, no historical meaning, pure design choice).
`isMapComplete(foundSet)` returns true iff `foundSet` (a `Set`) contains
every id in `CORRECT_PINS`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-room6.mjs` — Expected: prints "all room6.mjs tests passed".

- [ ] **Step 5: Implement `js/render-room6.js`**

A stylized SVG/CSS map of Italy with clickable pins at `CORRECT_PINS` and
`DECOY_PINS` positions (visually indistinguishable before clicking — per
Review Focus, decoys must not be revealed in advance). Clicking a correct
pin marks it found (persisted in local component state, added to a running
`Set`) and shows its real address from DESIGN.md's Fonti; clicking a decoy
shows a brief "non è qui" message and does **not** clear previously-found
pins. Once `isMapComplete` is true: `collectLetter(state, 'mappa', 'I')`,
update tray, `onSolved`.

- [ ] **Step 6: Manual verification**

Click a decoy pin → see "non è qui", already-found correct pins still shown
as found; find all 5 correct pins → letter **I** appears.

- [ ] **Step 7: Commit**

```bash
git add js/room6.mjs js/render-room6.js tests/test-room6.mjs
git commit -m "Add Room 6 Mappa delle Sedi Regionali puzzle"
```

---

### Task 9: Finale — porta d'uscita e schermata di vittoria

**Files:**
- Create: `js/finale.mjs`, `js/render-finale.js`
- Test: `tests/test-finale.mjs`

**Interfaces:**
- Consumes: `ui.mjs` (`renderLockWidget`), `state.mjs` (`isCodeMatch`).
- Produces: `FINAL_CODE = "LUIGI"`.

- [ ] **Step 1: Write the failing test (covers Review Focus: case/whitespace)**

```js
import assert from 'node:assert/strict';
import { FINAL_CODE } from '../js/finale.mjs';
import { isCodeMatch } from '../js/state.mjs';

assert.equal(FINAL_CODE, 'LUIGI');
assert.equal(isCodeMatch('luigi', FINAL_CODE), true);
assert.equal(isCodeMatch('  LuIgI  ', FINAL_CODE), true);
assert.equal(isCodeMatch('luig', FINAL_CODE), false);

console.log('all finale.mjs tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-finale.mjs` — Expected: FAIL.

- [ ] **Step 3: Implement `js/finale.mjs`**

Exports only `FINAL_CODE = "LUIGI"` (the matching logic is already covered
by `isCodeMatch`, reused rather than reimplemented).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-finale.mjs` — Expected: prints "all finale.mjs tests passed".

- [ ] **Step 5: Implement `js/render-finale.js`**

Shows the letter tray with all 5 collected letters, a `renderLockWidget`
configured with `code: FINAL_CODE`; on success, replaces the view with the
victory screen: Fleinaudi poster-style layout (FE logo, condensed title,
the verbatim Vision paragraph from DESIGN.md's "Testo per la schermata
finale", no invented text).

- [ ] **Step 6: Manual verification**

Enter "luigi" lowercase → door opens; verify the victory screen shows the
exact Vision paragraph and the logo.

- [ ] **Step 7: Commit**

```bash
git add js/finale.mjs js/render-finale.js tests/test-finale.mjs
git commit -m "Add finale lock and victory screen"
```

---

### Task 10: Room routing, resume, and full integration

**Files:**
- Modify: `js/main.js` (replace the Task 3 placeholder routing with the
  real room sequence and persistence)

**Interfaces:**
- Consumes: every room's `render-roomN.js` function and `onSolved`
  convention from Tasks 3–9; `state.mjs`'s `loadState`/`saveState`.

- [ ] **Step 1: Write the failing test (covers Review Focus: resume on reload)**

```js
import assert from 'node:assert/strict';
import { loadState, saveState, collectLetter, createInitialState } from '../js/state.mjs';

function fakeStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
  };
}

// simulate: player solved room1 and room2, then "reloads" with a fresh loadState call
const storage = fakeStorage();
let s = createInitialState();
s = { ...s, currentRoom: 'presidenti' };
s = collectLetter(s, 'scuola', 'L');
saveState(s, storage);

const resumed = loadState(storage);
assert.equal(resumed.currentRoom, 'presidenti');
assert.equal(resumed.lettersCollected.scuola, 'L');

// a brand-new player (empty storage) must not see any leftover progress
const brandNew = loadState(fakeStorage());
assert.equal(brandNew.currentRoom, 'ingresso');
assert.deepEqual(brandNew.lettersCollected, {});

console.log('all resume integration tests passed');
```

- [ ] **Step 2: Run test to verify it fails or passes vacuously**

Run: `node tests/test-state.mjs` (this scenario extends the Task 2 test
file — append it there rather than a new file). If Task 2's
implementation is already correct this may pass immediately; if so, note
it in the commit message as a regression-guard rather than new behavior.

- [ ] **Step 3: Implement the real router in `js/main.js`**

A `ROOM_SEQUENCE = ['ingresso', 'scuola', 'presidenti', 'archivio',
'biblioteca', 'mappa', 'finale']` array. On boot: `loadState(localStorage)`,
then render the room at `state.currentRoom` (mapping room id → its
`render-roomN.js` function) instead of always starting at the intro. Each
room's `onSolved` callback: advance `state.currentRoom` to the next id in
`ROOM_SEQUENCE`, `saveState`, clear `#app`, render the next room. The
intro/"Comincia" screen only shows when `state.currentRoom === 'ingresso'`
and no rooms solved yet (i.e., keep Task 1's intro screen as the `ingresso`
`render-room1.js` entry view, not a separate state).

- [ ] **Step 4: Run the full test suite**

Run: `node tests/test-state.mjs && node tests/test-room1.mjs && node
tests/test-room2.mjs && node tests/test-room3.mjs && node
tests/test-room4.mjs && node tests/test-room5.mjs && node
tests/test-room6.mjs && node tests/test-finale.mjs`
Expected: every file prints its "all … tests passed" line, no failures.

- [ ] **Step 5: Manual verification in the browser**

Play through Room 1 and Room 2, then reload the page: confirm it resumes
at Room 3 (Presidenti) with letter **L** still in the tray. Clear
`localStorage` via devtools and reload: confirm it starts clean at the
intro screen.

- [ ] **Step 6: Commit**

```bash
git add js/main.js tests/test-state.mjs
git commit -m "Wire full room routing with save/resume integration"
```

---

### Task 11: Full playtest polish and Artifact publish

**Files:**
- Modify: any file, as issues surface during playtest (no new files
  expected).

- [ ] **Step 1: Play the entire game start to finish in the browser pane**

Follow the verification workflow: open via `preview_start`, click through
all 6 rooms plus the finale in order, deliberately trigger at least one
wrong-answer case per room, confirm every Review Focus item from the plan
header behaves as specified. Check `read_console_messages` for errors at
each room transition.

- [ ] **Step 2: Fix any visual or logic issues found**

Common things to check: text overflowing its container, color contrast on
the navy background, the yellow accent not overused, circular avatars
truly circular at all names' lengths (long surnames like "Badini
Confalonieri").

- [ ] **Step 3: Re-run the full Node test suite**

Same command as Task 10 Step 4 — must still all pass after any fixes.

- [ ] **Step 4: Publish via the Artifact tool**

Call Artifact with `file_path: index.html`, `files` mapping every
`styles.css`, `js/*.mjs`, `js/*.js`, and `assets/*` path to its local file,
`title` (e.g. "Escape Room FLE"), `icon` (e.g. "lock" or "door"), and a
one-line `description`. Confirm the returned URL loads and plays correctly
by opening it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Polish escape room after full playtest"
```

- [ ] **Step 6: Give the user the Artifact link**

Share the published URL, note it's desktop-first (mobile version is a
separate future project per DESIGN.md), and name anything left as a
placeholder or assumption (decoy city choices, hint-button absence, exact
intro/victory copy wording) per DESIGN.md's "Cosa resta deciso dal
costruttore".
