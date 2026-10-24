/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { editLayerCells } from '../../draft/edit-layer-cells';
import type { OpenedLayer, PlaceOptions } from './map-layer.type';
import { openLayer } from './open-layer';
import { placementIndexes } from './placement-indexes';

const placeCells = (draft: Draft, options: PlaceOptions, valueOf: (opened: OpenedLayer) => number): void => {
  const opened = openLayer(draft, options);
  const indexes = placementIndexes(opened.tilemap, options);
  const value = valueOf(opened);
  editLayerCells(draft, opened, (cells) => {
    for (const index of indexes) cells[index] = value;
  });
};

export { placeCells };
