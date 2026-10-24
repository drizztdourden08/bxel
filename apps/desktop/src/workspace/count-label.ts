/* @layer renderer-app @kind logic */
const countLabel = (count: number, one: string, many: string): string => `${count} ${count === 1 ? one : many}`;

export { countLabel };
