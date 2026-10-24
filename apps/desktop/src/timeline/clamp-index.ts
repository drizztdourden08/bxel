/* @layer renderer-app @kind logic */
const clampIndex = (value: number, total: number): number => Math.min(Math.max(value, 0), total - 1);

export { clampIndex };
