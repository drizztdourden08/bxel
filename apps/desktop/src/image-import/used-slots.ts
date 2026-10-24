/* @layer renderer-app @kind logic */
const usedSlots = (pixels: Uint8Array, transparent: boolean): number => {
  const seen = new Set<number>(pixels);
  if (transparent) seen.delete(0);
  return seen.size;
};

export { usedSlots };
