/* @layer renderer-app @kind logic */
const shiftKeys = (list: readonly string[], moved: ReadonlySet<string>, by: number): string[] => {
  const out = [...list];
  const picked = out.map((key, index) => (moved.has(key) ? index : -1)).filter((index) => index >= 0);
  for (const index of by < 0 ? picked : [...picked].reverse()) {
    const next = index + Math.sign(by);
    const other = out[next];
    const here = out[index];
    if (other !== undefined && here !== undefined && !moved.has(other)) {
      out[next] = here;
      out[index] = other;
    }
  }
  return out;
};

export { shiftKeys };
