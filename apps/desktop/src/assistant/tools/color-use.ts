/* @layer renderer-app @kind logic */
const colorUse = (bytes: Uint8Array): [number, number][] => {
  const counts = new Map<number, number>();
  for (const value of bytes) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((first, second) => first[0] - second[0]);
};

export { colorUse };
