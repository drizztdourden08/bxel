/* @layer core @kind logic */
const listOf = (value: unknown): readonly unknown[] => (Array.isArray(value) ? (value as readonly unknown[]) : []);

export { listOf };
