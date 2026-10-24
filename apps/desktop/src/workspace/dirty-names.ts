/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { assetFileName } from './asset-file-name';
import { keyOf } from './key-of';
import type { Workspace } from './workspace.type';

const dirtyNames = (workspace: Workspace, artwork: Artwork): readonly string[] =>
  [...workspace.dirty]
    .map(keyOf)
    .filter((key): key is AssetKey => key !== null)
    .map((key) => assetFileName(workspace, artwork, key));

export { dirtyNames };
