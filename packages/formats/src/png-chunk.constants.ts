/* @layer core @kind constants */

const PNG_CHUNK = {
  IHDR: 'IHDR',
  PLTE: 'PLTE',
  TRNS: 'tRNS',
  IDAT: 'IDAT',
  IEND: 'IEND',
} as const;

export { PNG_CHUNK };
