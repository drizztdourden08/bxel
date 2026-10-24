/* @layer renderer-app @kind logic */
const clampAxis = (doubled: number | null, length: number): number => Math.min(2 * length, Math.max(0, doubled ?? length));

export { clampAxis };
