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
