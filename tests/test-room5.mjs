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
