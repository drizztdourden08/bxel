/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { MapLayerId } from '../../model/ids.type';
import type { MapLayer } from '../../model/tilemap.type';

const buildMapLayer = (ids: IdSource, name: string, cellCount: number): MapLayer => ({
  id: ids.next('tml') as MapLayerId,
  name,
  visible: true,
  locked: false,
  cells: new Uint32Array(cellCount),
});

export { buildMapLayer };
