/* @layer renderer-app @kind logic */
import { findTile } from '@bxel/document';
import type { Tileset } from '@bxel/document';
import type { TileStamp } from '../stores/tilemap-store.type';

const usableStamp = (stamp: TileStamp, tileset: Tileset): TileStamp => ({
  ...stamp,
  keys: stamp.keys.map((key) => (key !== 0 && findTile(tileset, key) ? key : 0)),
});

export { usableStamp };
