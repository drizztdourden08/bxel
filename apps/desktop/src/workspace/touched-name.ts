/* @layer renderer-app @kind logic */
import { assetsTouched } from '@bxel/document';
import type { Artwork, ChangeSet } from '@bxel/document';
import { assetName } from './asset-name';
import type { Workspace } from './workspace.type';

const touchedName = (workspace: Workspace, changes: ChangeSet, artwork: Artwork): string => {
  for (const key of assetsTouched(changes, workspace.last, artwork)) {
    const name = assetName(artwork, key) ?? assetName(workspace.last, key);
    if (name !== null) return name;
  }
  return workspace.name;
};

export { touchedName };
