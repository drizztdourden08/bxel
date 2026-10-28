/* @layer renderer-app @kind logic */
const layerPosition = (layers: readonly { id: string }[], id: string): { from: number; total: number } | null => {
  const at = layers.findIndex((each) => each.id === id);
  return at < 0 ? null : { from: layers.length - 1 - at, total: layers.length };
};

export { layerPosition };
