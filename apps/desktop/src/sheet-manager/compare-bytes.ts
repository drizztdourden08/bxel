/* @layer renderer-app @kind logic */
const compareBytes = (a: Uint8Array, b: Uint8Array): number => {
  const length = Math.min(a.length, b.length);
  for (let at = 0; at < length; at += 1) {
    const difference = (a[at] ?? 0) - (b[at] ?? 0);
    if (difference !== 0) return difference;
  }
  return a.length - b.length;
};

export { compareBytes };
