/* @layer renderer-app @kind logic */
const clampRange = (value: number, range: { min: number; max: number }): number => Math.min(range.max, Math.max(range.min, Math.round(value)));

export { clampRange };
