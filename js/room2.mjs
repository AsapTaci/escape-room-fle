export const SPEAKER_QUOTES = {
  'Elsa Fornero':
    'Liberale è il rifiuto di separare il tempo della propria vita, di scinderlo fra un tempo di lavoro senza fantasia e un tempo libero senza significato.',
  'Alberto Mingardi':
    'Liberale è chi non delega e non si sottomette, chi chiede al grande fratello pubblico il conto delle spese.',
  'Mattia Feltri':
    'Liberale è darsi una regola piuttosto che doverla ricevere.',
  'Alessandro De Nicola':
    "Liberale è la sintesi difficile non impossibile, fra l'efficienza del mercato, le riforme della società, le regole della democrazia.",
  'Luciano Floridi':
    "Liberale è chi ha letto vent'anni fa il romanzo di Orwell, scopre che il fatidico 1984 è alle porte, e prepara la difesa contro la più illiberale delle diseguaglianze, quella che potrebbe instaurarsi fra una massa livellata e un'oligarchia di livellatori.",
};

export function isQuoteMatchComplete(mapping) {
  const speakers = Object.keys(SPEAKER_QUOTES);
  if (Object.keys(mapping).length !== speakers.length) return false;
  return speakers.every((speaker) => mapping[speaker] === speaker);
}
