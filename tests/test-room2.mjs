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
