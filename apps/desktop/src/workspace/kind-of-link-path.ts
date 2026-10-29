/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import type { AssetKind } from '@bxel/document';

const LINKABLE: readonly AssetKind[] = ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap'];

/** The kind of file a stored link points at, read from the ending of its path. */
const kindOfLinkPath = (path: string): AssetKind | null => {
  const lower = path.toLowerCase();
  return LINKABLE.find((kind) => lower.endsWith(ASSET_FORMAT[kind].extension)) ?? null;
};

export { kindOfLinkPath };
