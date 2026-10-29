/* @layer renderer-app @kind logic */
const tokensOf = (text: string): string[] => [...text.matchAll(/(?:[^\s"]*:)?"[^"]*"|\S+/g)].map((match) => match[0]);

export { tokensOf };
