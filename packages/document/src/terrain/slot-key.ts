/* @layer core @kind logic */
const slotKey = (keys: readonly number[], index: number, fallback: number): number => {
  for (let at = index; at >= 0; at -= 1) {
    const key = keys[at] ?? 0;
    if (key !== 0) return key;
  }
  return fallback;
};

export { slotKey };
