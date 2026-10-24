/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { pathInDir } from './path-in-dir';
import type { Workspace } from './workspace.type';

const newAssetPath = (workspace: Workspace, artwork: Artwork, key: AssetKey): string | null =>
  (workspace.kind === 'project' ? pathInDir(workspace, artwork, key) : null);

export { newAssetPath };
