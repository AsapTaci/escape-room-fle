export const LIBRARY_FACTS = {
  'Anno della donazione di Alberto Giovannini': '1923',
  'Anno di adesione al Sistema Bibliotecario Nazionale': '2004',
  'Volumi posseduti oggi': '7.000',
};

export function isLibraryMatchComplete(mapping) {
  const labels = Object.keys(LIBRARY_FACTS);
  return labels.every((label) => mapping[label] === LIBRARY_FACTS[label]);
}
