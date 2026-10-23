/* @layer renderer-app @kind logic */
const clampZoom = (levels: readonly number[], zoom: number): number => {
  const low = levels[0] ?? zoom;
  const high = levels.at(-1) ?? zoom;
  return Math.min(high, Math.max(low, zoom));
};

export { clampZoom };
