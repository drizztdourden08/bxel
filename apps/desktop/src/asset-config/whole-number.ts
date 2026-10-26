/* @layer renderer-app @kind logic */
const whole = (value: unknown): number | null => (typeof value === 'number' && Number.isInteger(value) ? value : null);

export { whole };
