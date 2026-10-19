export const ARCHIVE_FUNDS = {
  'Fondo Giovanni Malagodi':
    'Di gran lunga il fondo più importante della FLE: le carte di Malagodi e della sua famiglia.',
  'Fondo Valerio Zanone':
    'Relative al suo lungo periodo di storia nel Partito Liberale Italiano.',
  'Fondo Antonio Scialoja':
    "Fornisce un aggancio con i primi anni dello Stato unitario.",
};

export function isArchiveMatchComplete(mapping) {
  const funds = Object.keys(ARCHIVE_FUNDS);
  if (Object.keys(mapping).length !== funds.length) return false;
  return funds.every((fund) => mapping[fund] === fund);
}
