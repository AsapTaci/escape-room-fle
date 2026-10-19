const STORAGE_KEY = 'fle-escape-room-state';

export function createInitialState() {
  return { currentRoom: 'ingresso', lettersCollected: {} };
}

export function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return JSON.parse(raw);
  } catch {
    return createInitialState();
  }
}

export function saveState(state, storage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
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
