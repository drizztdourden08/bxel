/* @layer renderer-app @kind constants */
const TRANSFORM_LABELS = {
  distort: 'Distort',
  rotate: (angle: number): string => `Rotate ${angle} degrees`,
  scale: 'Scale',
  transform: 'Transform',
} as const;

export { TRANSFORM_LABELS };
