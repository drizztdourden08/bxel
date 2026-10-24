/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { assetName } from './asset-name';
import { keyOf } from './key-of';
import type { DirtyKeys, Workspace } from './workspace.type';

const dirtyKeys = (workspace: Workspace, artwork: Artwork): DirtyKeys => {
  const keys = [...workspace.dirty].map(keyOf).filter((key): key is AssetKey => key !== null);
  const assets = keys.filter((key) => key.kind !== 'project');
  return {
    live: assets.filter((key) => assetName(artwork, key) !== null),
    gone: assets.filter((key) => assetName(artwork, key) === null),
    project: keys.find((key) => key.kind === 'project') ?? null,
  };
};

export { dirtyKeys };
