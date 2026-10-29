/* @layer renderer-app @kind logic */

const readHex = (value: unknown, fallback: string): string => (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback);

export { readHex };
