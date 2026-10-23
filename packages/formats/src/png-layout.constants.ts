/* @layer core @kind constants */

const PNG_LAYOUT = {
  IHDR_LENGTH: 13,
  CHUNK_OVERHEAD: 12,
  TYPE_OFFSET: 4,
  DATA_OFFSET: 8,
  INTERLACE_ADAM7: 1,
} as const;

export { PNG_LAYOUT };
