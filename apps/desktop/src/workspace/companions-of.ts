/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { assetName } from './asset-name';
import { keyId } from './key-id';
import { onDisk } from './on-disk';
import type { Workspace } from './workspace.type';

const linkedKeys = (artwork: Artwork, key: AssetKey): readonly AssetKey[] => {
  if (key.kind === 'sprite') {
    const sprite = artwork.sprites.find((each) => each.id === key.id);
    return sprite ? [{ kind: 'palette', id: sprite.bankId }] : [];
  }
  if (key.kind === 'tileset') {
    const tileset = artwork.tilesets.find((each) => each.id === key.id);
    return tileset ? [{ kind: 'palette', id: tileset.bankId }] : [];
  }
  if (key.kind === 'sheet') {
    const sheet = artwork.sheets.find((each) => each.id === key.id);
    return [...new Set(sheet?.entries.map((entry) => entry.spriteId) ?? [])].map((id) => ({ kind: 'sprite', id }));
  }
  const tilemap = key.kind === 'tilemap' ? artwork.tilemaps.find((each) => each.id === key.id) : undefined;
  return tilemap ? [{ kind: 'tileset', id: tilemap.tilesetId }] : [];
};

const companionsOf = (workspace: Workspace, artwork: Artwork, key: AssetKey): readonly AssetKey[] => {
  const needed = (linked: AssetKey): boolean =>
    !onDisk(workspace, linked) || (linked.kind === 'palette' && workspace.dirty.has(keyId(linked)));
  const extra = linkedKeys(artwork, key).filter(
    (linked) => workspace.paths.has(linked.id) && assetName(artwork, linked) !== null && needed(linked),
  );
  return [key, ...extra];
};

export { companionsOf };
