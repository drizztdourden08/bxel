/* @layer renderer-app @kind constants */
const ANTI_ALIAS_TEXT = {
  label: 'Anti alias',
  nothing: 'No stair steps of the front colour to soften.',
  noRamp: 'Put the front colour in a ramp first. Anti alias uses the next colour of its ramp and never makes a new one.',
} as const;

export { ANTI_ALIAS_TEXT };
