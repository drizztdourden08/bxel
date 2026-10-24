/* @layer core @kind logic */
const byteAt = (bytes: ArrayLike<number>, index: number): number => bytes[index] ?? 0;

export { byteAt };
