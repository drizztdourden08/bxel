/* @layer renderer-app @kind constants */
const REFERENCE_LIMITS = {
  count: 8,
  scale: { min: 1, max: 3200 },
  opacity: { min: 0, max: 100 },
  offset: { min: -100000, max: 100000 },
} as const;

const REFERENCE_DEFAULTS = { x: 0, y: 0, scale: 100, opacity: 50, locked: false, above: true } as const;

const REFERENCE_TEXT = {
  section: 'Reference images',
  add: 'Add reference...',
  none: 'No reference image. Alt and drop a picture on the canvas, or add one here.',
  hint: 'Kept for this file only. Never painted into the art and never exported.',
  tooMany: (count: number): string => `A file shows at most ${count} reference images.`,
  unreadable: 'That picture could not be read.',
  unavailable: 'A reference image needs a picture file.',
  missing: 'Missing',
  remove: (name: string): string => `Remove ${name}`,
  x: 'X',
  y: 'Y',
  scale: 'Scale',
  opacity: 'Opacity',
  lock: 'Lock',
  above: 'Above the art',
  below: 'Below the art',
  place: 'Place',
  position: (name: string, axis: string): string => `${axis} position of ${name}`,
  scaleOf: (name: string): string => `Scale of ${name}`,
  opacityOf: (name: string): string => `Opacity of ${name}`,
  lockOf: (name: string): string => `Lock ${name}`,
  placeOf: (name: string): string => `Place ${name}`,
  added: (name: string): string => `Added the reference image ${name}`,
} as const;

export { REFERENCE_DEFAULTS, REFERENCE_LIMITS, REFERENCE_TEXT };
