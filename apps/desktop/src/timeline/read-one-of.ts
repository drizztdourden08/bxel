/* @layer renderer-app @kind logic */

const readOneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => allowed.find((each) => each === value) ?? fallback;

export { readOneOf };
