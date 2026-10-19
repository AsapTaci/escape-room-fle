export const PRESIDENT_ORDER = [
  'Gaetano Martino',
  'Ruggero Moscati',
  'Vittorio Badini Confalonieri',
  'Franco Mattei',
  'Giancarlo Lunati',
  'Valerio Zanone',
  'Roberto Einaudi',
  'Mario Lupo',
  'Giuseppe Benedetto',
];

export function isPresidentOrderCorrect(order) {
  if (order.length !== PRESIDENT_ORDER.length) return false;
  return order.every((name, i) => name === PRESIDENT_ORDER[i]);
}
