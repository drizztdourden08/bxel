/* @layer renderer-app @kind logic */
const plural = (count: number, noun: string): string => `${count} ${noun}${count === 1 ? '' : 's'}`;

export { plural };
