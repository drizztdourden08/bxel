/* @layer renderer-app @kind logic */
const endingOf = (name: string): string => {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot).toLowerCase() : '';
};

export { endingOf };
