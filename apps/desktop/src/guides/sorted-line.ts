/* @layer renderer-app @kind logic */
const sortedLine = (values: readonly number[]): number[] => [...new Set(values)].sort((a, b) => a - b);

export { sortedLine };
