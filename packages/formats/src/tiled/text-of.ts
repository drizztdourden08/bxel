/* @layer core @kind logic */
const textOf = (value: unknown, fallback: string): string => (typeof value === 'string' ? value : fallback);

export { textOf };
