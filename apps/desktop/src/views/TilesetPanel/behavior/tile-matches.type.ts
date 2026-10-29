/* @layer renderer-app @kind types */
import type { Tile } from '@bxel/document';
import type { TileFilter } from '../../../stores/tileset-view-store.type';

interface MatchTile {
  tile: Tile;
  name: string;
  uses: number;
  terrainSlot: number | null;
}

interface MatchQuery {
  search: string;
  filters: readonly TileFilter[];
}

export type { MatchQuery, MatchTile };
