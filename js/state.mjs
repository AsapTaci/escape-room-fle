const STORAGE_KEY = 'fle-escape-room-state';

export const ROOM_SEQUENCE = ['ingresso', 'scuola', 'presidenti', 'archivio', 'biblioteca', 'mappa', 'finale'];

export function createInitialState() {
  return { currentRoom: 'ingresso', lettersCollected: {} };
}

function isValidState(candidate) {
  return (
    candidate !== null &&
    typeof candidate === 'object' &&
    ROOM_SEQUENCE.includes(candidate.currentRoom) &&
    typeof candidate.lettersCollected === 'object' &&
    candidate.lettersCollected !== null &&
    !Array.isArray(candidate.lettersCollected)
  );
}

export function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return isValidState(parsed) ? parsed : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function saveState(state, storage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked or full: progress just won't resume next time.
  }
}

function createMemoryStorage() {
  const store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
  };
}

let cachedSafeStorage = null;

// Browsers can refuse localStorage entirely (private mode, blocked site
// data, or a sandboxed iframe like the one a published Artifact runs in),
// where even reading `window.localStorage` throws. Fall back to an
// in-memory store so the game still plays; it just won't resume later.
export function getSafeStorage() {
  if (cachedSafeStorage) return cachedSafeStorage;
  try {
    const probeKey = '__fle_storage_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    cachedSafeStorage = window.localStorage;
  } catch {
    cachedSafeStorage = createMemoryStorage();
  }
  return cachedSafeStorage;
}

export function collectLetter(state, roomId, letter) {
  return {
    ...state,
    lettersCollected: { ...state.lettersCollected, [roomId]: letter },
  };
}

export function isCodeMatch(input, code) {
  return input.trim().toUpperCase() === code.toUpperCase();
}
