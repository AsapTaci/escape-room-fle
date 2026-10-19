import assert from 'node:assert/strict';
import { FINAL_CODE } from '../js/finale.mjs';
import { isCodeMatch } from '../js/state.mjs';

assert.equal(FINAL_CODE, 'LUIGI');
assert.equal(isCodeMatch('luigi', FINAL_CODE), true);
assert.equal(isCodeMatch('  LuIgI  ', FINAL_CODE), true);
assert.equal(isCodeMatch('luig', FINAL_CODE), false);

console.log('all finale.mjs tests passed');
