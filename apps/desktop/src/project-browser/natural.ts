/* @layer renderer-app @kind logic */

const natural = (left: string, right: string): number => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });

export { natural };
