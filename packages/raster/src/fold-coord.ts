/* @layer core @kind logic */
const foldCoord = (value: number, size: number): number => ((value % size) + size) % size;

export { foldCoord };
