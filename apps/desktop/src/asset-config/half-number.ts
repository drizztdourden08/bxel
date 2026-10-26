/* @layer renderer-app @kind logic */
const half = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 2) : null);

export { half };
