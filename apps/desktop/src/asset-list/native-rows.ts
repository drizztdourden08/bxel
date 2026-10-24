/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { Artwork, AssetKey, SpriteId } from '@bxel/document';
import { assetKeys } from '../workspace/asset-keys';
import { assetName } from '../workspace/asset-name';
import { keyId } from '../workspace/key-id';
import { referrersOf } from '../workspace/referrers-of';
import type { Workspace } from '../workspace/workspace.type';
import type { AssetRow, FileStat, RowKind } from './asset-list.type';
import { folderLabel } from './folder-label';
import { spriteThumb } from './sprite-thumb';

const thumbOf = (artwork: Artwork, key: AssetKey): string | null => {
  const sprite = key.kind === 'sprite' ? findSprite(artwork, key.id as SpriteId) : undefined;
  return sprite ? spriteThumb(artwork, sprite) : null;
};

const nativeRow = (workspace: Workspace, artwork: Artwork, stats: ReadonlyMap<string, FileStat>, key: AssetKey): AssetRow | null => {
  const name = assetName(artwork, key);
  if (name === null || key.kind === 'project') return null;
  const path = workspace.paths.get(key.id) ?? '';
  return {
    id: path === '' ? keyId(key) : path,
    kind: key.kind as RowKind,
    assetId: key.id,
    name,
    path,
    folder: folderLabel(path, workspace.name),
    modified: stats.get(path.toLowerCase())?.modified ?? 0,
    dirty: path === '' || workspace.dirty.has(keyId(key)),
    loaded: true,
    usedBy: key.kind === 'sprite' ? referrersOf(artwork, key).map((each) => each.id) : [],
    preview: thumbOf(artwork, key),
  };
};

const nativeRows = (workspace: Workspace, artwork: Artwork, stats: ReadonlyMap<string, FileStat>): readonly AssetRow[] =>
  assetKeys(artwork).flatMap((key) => {
    const row = nativeRow(workspace, artwork, stats, key);
    return row ? [row] : [];
  });

export { nativeRows };
