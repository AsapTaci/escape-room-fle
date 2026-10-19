import assert from 'node:assert/strict';
import { createInitialState, loadState, saveState, collectLetter, isCodeMatch, getSafeStorage, ROOM_SEQUENCE } from '../js/state.mjs';

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

// resume integration (Task 10 scenario, folded in here per plan Step 2):
// simulate a player who solved room1+room2, then "reloads"
const resumeStorage = fakeStorage();
let rs = createInitialState();
rs = { ...rs, currentRoom: 'presidenti' };
rs = collectLetter(rs, 'scuola', 'L');
saveState(rs, resumeStorage);

const resumed = loadState(resumeStorage);
assert.equal(resumed.currentRoom, 'presidenti');
assert.equal(resumed.lettersCollected.scuola, 'L');

const brandNew = loadState(fakeStorage());
assert.equal(brandNew.currentRoom, 'ingresso');
assert.deepEqual(brandNew.lettersCollected, {});

console.log('all resume integration tests passed');

// final review fix: a storage whose methods throw must never crash loadState/saveState
function throwingStorage() {
  return {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('blocked'); },
    removeItem: () => { throw new Error('blocked'); },
  };
}
assert.deepEqual(loadState(throwingStorage()), createInitialState());
assert.doesNotThrow(() => saveState(createInitialState(), throwingStorage()));

// final review fix: parseable-but-wrong-shape saved state falls back cleanly
assert.deepEqual(loadState(fakeStorage({ 'fle-escape-room-state': 'null' })), createInitialState());
assert.deepEqual(loadState(fakeStorage({ 'fle-escape-room-state': '{}' })), createInitialState());
assert.deepEqual(
  loadState(fakeStorage({ 'fle-escape-room-state': JSON.stringify({ currentRoom: 'not-a-real-room', lettersCollected: {} }) })),
  createInitialState()
);
assert.deepEqual(
  loadState(fakeStorage({ 'fle-escape-room-state': JSON.stringify({ currentRoom: 'scuola' }) })),
  createInitialState()
);
assert.deepEqual(
  loadState(fakeStorage({ 'fle-escape-room-state': JSON.stringify({ currentRoom: 'scuola', lettersCollected: ['not', 'an', 'object'] }) })),
  createInitialState()
);
assert.ok(ROOM_SEQUENCE.includes('scuola'));

// final review fix: getSafeStorage never throws even with no window/localStorage (this Node process has neither)
const safe = getSafeStorage();
assert.equal(typeof safe.getItem, 'function');
assert.equal(typeof safe.setItem, 'function');
safe.setItem('k', 'v');
assert.equal(safe.getItem('k'), 'v');

console.log('all final-review hardening tests passed');
