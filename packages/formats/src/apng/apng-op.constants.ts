/* @layer core @kind constants */

const APNG_OP = {
  DISPOSE_NONE: 0,
  DISPOSE_BACKGROUND: 1,
  DISPOSE_PREVIOUS: 2,
  BLEND_SOURCE: 0,
  BLEND_OVER: 1,
} as const;

export { APNG_OP };
