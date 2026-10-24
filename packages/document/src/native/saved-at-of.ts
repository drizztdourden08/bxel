/* @layer core @kind logic */
const savedAtOf = (milliseconds: number): string => new Date(milliseconds).toISOString().replace(/\.\d{3}Z$/, 'Z');

export { savedAtOf };
