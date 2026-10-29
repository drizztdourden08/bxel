/* @layer renderer-app @kind logic */
const rootOf = (path: string, roots: readonly string[]): string | undefined => {
  const lower = path.toLowerCase();
  return roots.find((root) => lower.startsWith(`${root.toLowerCase()}/`));
};

export { rootOf };
