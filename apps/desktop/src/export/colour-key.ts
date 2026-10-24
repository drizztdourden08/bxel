/* @layer renderer-app @kind logic */
const colourKey = (data: ArrayLike<number>, at: number): number => {
  if ((data[at + 3] ?? 0) === 0) return 0;
  return (((data[at] ?? 0) << 24) | ((data[at + 1] ?? 0) << 16) | ((data[at + 2] ?? 0) << 8) | (data[at + 3] ?? 0)) >>> 0;
};

export { colourKey };
