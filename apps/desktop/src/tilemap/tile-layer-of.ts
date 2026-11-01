/* @layer renderer-app @kind logic */
import type { MapLayer } from '@bxel/document';
import { firstTileLayer } from './first-tile-layer';

const tileLayerOf = (layers: readonly MapLayer[], id: string | null): MapLayer | null => {
  const start = layers.find((each) => each.id === id) ?? layers.at(-1);
  const tile = start ? firstTileLayer(layers, start.id) : null;
  return layers.find((each) => each.id === tile) ?? [...layers].reverse().find((each) => each.kind !== 'group') ?? null;
};

export { tileLayerOf };
