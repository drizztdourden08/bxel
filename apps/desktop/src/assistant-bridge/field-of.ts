/* @layer renderer-app @kind logic */
const fieldOf = (value: unknown, key: string): unknown =>
  typeof value === 'object' && value !== null ? (Reflect.get(value, key) as unknown) : undefined;

export { fieldOf };
