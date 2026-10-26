/* @layer renderer-app @kind constants */
const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

const OPACITY_CONTROL = { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent } as const;

export { OPACITY_CONTROL };
