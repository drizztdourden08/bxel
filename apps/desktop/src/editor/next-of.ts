/* @layer renderer-app @kind logic */
const nextOf = <T>(list: readonly T[], current: T): T => list[(list.indexOf(current) + 1) % list.length] ?? current;

export { nextOf };
