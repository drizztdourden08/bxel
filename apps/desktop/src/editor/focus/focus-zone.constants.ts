/* @layer renderer-app @kind constants */
const FOCUS_ZONE_ATTRIBUTE = 'data-focus-zone';

const FOCUS_ZONE = {
  layers: 'layers',
  sprites: 'sprites',
  timeline: 'timeline',
} as const;

export { FOCUS_ZONE, FOCUS_ZONE_ATTRIBUTE };
