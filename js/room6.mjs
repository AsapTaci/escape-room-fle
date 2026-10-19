export const CORRECT_PINS = ['napoli', 'trieste', 'milano', 'capo-dorlando', 'firenze'];
export const DECOY_PINS = ['torino', 'bologna', 'genova'];

export const PIN_ADDRESSES = {
  napoli: 'Via Miguel De Cervantes Saavedra, 52 — 80133 Napoli',
  trieste: 'Viale Miramare, 23 — 34135 Trieste',
  milano: 'Corso Monforte, 15 — 20122 Milano',
  'capo-dorlando': "Ex Strada Comunale Procaccia s.n.c. — 98071 Capo d'Orlando (ME)",
  firenze: 'Via Lamarmora, 53 — 50121 Firenze',
};

export function isMapComplete(foundSet) {
  return CORRECT_PINS.every((pin) => foundSet.has(pin));
}
