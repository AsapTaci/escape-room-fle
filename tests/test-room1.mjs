import assert from 'node:assert/strict';
import { INGRESSO_CODE } from '../js/room1.mjs';
import { isCodeMatch } from '../js/state.mjs';

assert.equal(INGRESSO_CODE, '1962');
assert.equal(isCodeMatch('1962', INGRESSO_CODE), true);
assert.equal(isCodeMatch('1963', INGRESSO_CODE), false);
console.log('all room1.mjs tests passed');
