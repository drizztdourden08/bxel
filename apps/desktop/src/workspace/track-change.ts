/* @layer renderer-app @kind logic */
import { assetsTouched } from '@bxel/document';
import type { Artwork, ChangeSet } from '@bxel/document';
import { expandTouched } from './expand-touched';
import { judgeAsset } from './judge-asset';
import { keyId } from './key-id';
import type { Workspace } from './workspace.type';

const trackChange = (workspace: Workspace, changes: ChangeSet, artwork: Artwork): Workspace => {
  const touched = expandTouched(workspace, artwork, assetsTouched(changes, workspace.last, artwork));
  if (touched.length === 0) return { ...workspace, last: artwork };
  const tally = { saved: new Map(workspace.saved), paths: new Map(workspace.paths) };
  const dirty = new Set(workspace.dirty);
  for (const key of touched) {
    if (judgeAsset(workspace, artwork, key, tally)) dirty.add(keyId(key));
    else dirty.delete(keyId(key));
  }
  return { ...workspace, saved: tally.saved, paths: tally.paths, dirty, last: artwork };
};

export { trackChange };
