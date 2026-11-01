/* @layer renderer-app @kind types */
import type { Tile, TileField } from '@bxel/document';
import type { ChoiceFilter, TileFilter } from '../../../stores/tileset-view-store.type';

interface MatchTile {
  tile: Tile;
  name: string;
  uses: number;
  terrainSlot: number | null;
}

interface MatchQuery {
  search: string;
  filters: readonly TileFilter[];
  choices: readonly ChoiceFilter[];
  fields: readonly TileField[];
}

export type { MatchQuery, MatchTile };
