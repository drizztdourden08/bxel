/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import type { AssetReport } from '@bxel/document/native';
import { keyAt } from './key-at';
import { parentOf } from './parent-of';
import { sameDirs } from './same-dirs';
import type { AssetFile, MergedWorkspace, WorkspaceSeed } from './workspace.type';

const migratedFocus = (merged: MergedWorkspace): AssetKey | null =>
  merged.migration?.keys.find((key) => key.kind === 'animation') ?? null;

const looseFileSeed = (first: AssetFile, report: AssetReport, merged: MergedWorkspace): WorkspaceSeed => {
  const dir = parentOf(first.path);
  return {
    kind: 'loose',
    name: report.slice?.name ?? merged.artwork.name,
    root: dir,
    dirs: sameDirs(dir),
    projectFile: null,
    paths: merged.paths,
    dirty: merged.dirty,
    legacy: null,
    artwork: merged.artwork,
    readOnly: report.readOnly,
    unsaved: false,
    ...(merged.migration ? { migration: merged.migration } : {}),
    focus: migratedFocus(merged) ?? keyAt(merged.paths, first.path, first.manifest.kind),
  };
};

export { looseFileSeed };
