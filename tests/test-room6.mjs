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
