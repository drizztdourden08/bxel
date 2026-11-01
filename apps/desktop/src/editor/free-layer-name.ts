/* @layer renderer-app @kind logic */
import type { Layer } from '@bxel/document';

const freeLayerName = (layers: readonly Layer[], stem: string): string => {
  const taken = new Set(layers.map((layer) => layer.name.toLowerCase()));
  for (let at = 1; at <= layers.length + 1; at += 1) {
    const name = at === 1 ? stem : `${stem} ${at}`;
    if (!taken.has(name.toLowerCase())) return name;
  }
  return stem;
};

export { freeLayerName };
