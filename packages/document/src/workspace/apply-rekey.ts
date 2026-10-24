/* @layer core @kind logic */
import type { AssetSlice } from '../model/asset.type';
import { remapIds } from './remap-ids';

const applyRekey = (slice: AssetSlice, map: ReadonlyMap<string, string>): AssetSlice =>
  map.size === 0 ? slice : { ...slice, id: map.get(slice.id) ?? slice.id, artwork: remapIds(slice.artwork, map) };

export { applyRekey };
