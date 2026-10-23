/* @layer core @kind constants */

const PNG_FILTER = {
  NONE: 0,
  SUB: 1,
  UP: 2,
  AVERAGE: 3,
  PAETH: 4,
} as const;

export { PNG_FILTER };
