/* @layer renderer-app @kind logic */
const childCounts = (layers: readonly { readonly id: string; readonly parentId?: string }[]): Map<string, number> => {
  const counts = new Map<string, number>();
  layers.forEach((layer) => {
    if (layer.parentId !== undefined) counts.set(layer.parentId, (counts.get(layer.parentId) ?? 0) + 1);
  });
  return counts;
};

export { childCounts };
