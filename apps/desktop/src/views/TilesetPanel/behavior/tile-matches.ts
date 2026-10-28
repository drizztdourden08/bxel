/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { TileFilter } from '../../../stores/tileset-view-store.type';
import type { MatchQuery, MatchTile } from './tile-matches.type';

const passes = (filter: TileFilter, tile: MatchTile): boolean => {
  if (filter === 'used') return tile.uses > 0;
  if (filter === 'unused') return tile.uses === 0;
  if (filter === 'animated') return tile.tile.animation !== undefined;
  if (filter === 'collision') return tileShapes(tile.tile).length > 0;
  return tile.terrainSlot !== null;
};

const words = (tile: MatchTile): string[] => [
  String(tile.tile.key),
  tile.name,
  tile.tile.type ?? '',
  ...Object.values(tile.tile.data ?? {}).map(String),
];

const termMatches = (term: string, tile: MatchTile): boolean => {
  const text = term.toLowerCase();
  const typed = /^type:(.+)$/.exec(text);
  if (typed) return (tile.tile.type ?? '').toLowerCase() === typed[1];
  return words(tile).some((word) => word.toLowerCase().includes(text));
};

const tileMatches = (tile: MatchTile, query: MatchQuery): boolean => {
  const terms = query.search.trim().split(/\s+/).filter((term) => term !== '');
  return terms.every((term) => termMatches(term, tile)) && query.filters.every((filter) => passes(filter, tile));
};

export { tileMatches };
