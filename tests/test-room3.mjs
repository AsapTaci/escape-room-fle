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
