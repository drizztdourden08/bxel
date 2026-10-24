/* @layer core @kind constants */

const PNG_FILTER_SCORE = {
  SIGNED_MIDPOINT: 128,
  BYTE_RANGE: 256,
} as const;

const PNG_FILTER_COST = Uint8Array.from({ length: PNG_FILTER_SCORE.BYTE_RANGE }, (_, byte) =>
  byte < PNG_FILTER_SCORE.SIGNED_MIDPOINT ? byte : PNG_FILTER_SCORE.BYTE_RANGE - byte,
);

export { PNG_FILTER_COST };
