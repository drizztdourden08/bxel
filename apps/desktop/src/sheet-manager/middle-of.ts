/* @layer renderer-app @kind logic */
const middleOf = (low: number, high: number, size: number): number => Math.round((low + high - size) / 2);

export { middleOf };
