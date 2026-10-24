/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { referrersOf } from './referrers-of';
import type { Workspace } from './workspace.type';

const expandKey = (workspace: Workspace, artwork: Artwork, key: AssetKey): readonly AssetKey[] => {
  if (key.kind === 'project') return workspace.kind === 'project' ? [key] : [];
  if (key.kind !== 'palette' || workspace.paths.has(key.id)) return [key];
  const users = referrersOf(artwork, key);
  return workspace.kind === 'project' ? [key, ...users] : users;
};

const expandTouched = (workspace: Workspace, artwork: Artwork, touched: readonly AssetKey[]): readonly AssetKey[] =>
  touched.flatMap((key) => expandKey(workspace, artwork, key));

export { expandTouched };
