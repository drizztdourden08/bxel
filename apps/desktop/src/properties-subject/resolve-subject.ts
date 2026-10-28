/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { AssetKey } from '@bxel/document';
import { assetFileName } from '../workspace/asset-file-name';
import { assetKeys } from '../workspace/asset-keys';
import { assetName } from '../workspace/asset-name';
import { keyId } from '../workspace/key-id';
import { tabOf } from '../workspace/tab-of';
import { toSlashes } from '../workspace/to-slashes';
import type { OpenTab, Workspace } from '../workspace/workspace.type';
import { NO_SUBJECT } from './properties-subject.constants';
import type { Subject, SubjectInputs, SubjectRef, SubjectState } from './properties-subject.type';

const keyHolds = (inputs: SubjectInputs, key: AssetKey): OpenTab | null => {
  for (const workspace of Object.values(inputs.workspaces)) {
    const artwork = inputs.views[workspace.documentId]?.state.artwork;
    if (artwork && assetKeys(artwork).some((each) => each.kind === key.kind && each.id === key.id)) return tabOf(workspace.documentId, key);
  }
  return null;
};

const pathHolds = (inputs: SubjectInputs, path: string): OpenTab | null => {
  const wanted = toSlashes(path);
  for (const workspace of Object.values(inputs.workspaces)) {
    const artwork = inputs.views[workspace.documentId]?.state.artwork;
    const id = [...workspace.paths].find(([, known]) => isSamePath(known, wanted))?.[0];
    const key = artwork && id !== undefined ? assetKeys(artwork).find((each) => each.id === id) : undefined;
    if (key) return tabOf(workspace.documentId, key);
  }
  return null;
};

const pinnedTab = (inputs: SubjectInputs, pin: SubjectRef): OpenTab | null =>
  (pin.path === null ? null : pathHolds(inputs, pin.path)) ?? (pin.key === null ? null : keyHolds(inputs, pin.key));

const relativeTo = (workspace: Workspace, path: string | undefined): string | null => {
  if (path === undefined) return null;
  const root = workspace.root === null ? null : toSlashes(workspace.root).replace(/\/$/, '');
  return root !== null && toSlashes(path).toLowerCase().startsWith(`${root.toLowerCase()}/`) ? toSlashes(path).slice(root.length + 1) : toSlashes(path);
};

const subjectOf = (inputs: SubjectInputs, tab: OpenTab, pinned: boolean): SubjectState => {
  const view = inputs.views[tab.documentId];
  const workspace = inputs.workspaces[tab.documentId];
  const name = view ? assetName(view.state.artwork, tab.key) : null;
  if (!view || !workspace || name === null) return { status: 'missing', ref: { path: null, key: tab.key } };
  const path = workspace.paths.get(tab.key.id);
  const subject: Subject = {
    focus: { documentId: tab.documentId, key: tab.key, artwork: view.state.artwork, readOnly: view.state.readOnly },
    kind: tab.key.kind,
    name,
    fileName: assetFileName(workspace, view.state.artwork, tab.key),
    path: path === undefined ? null : toSlashes(path),
    relativePath: relativeTo(workspace, path),
    dirty: path === undefined || workspace.dirty.has(keyId(tab.key)),
    hasTab: inputs.tabs.some((each) => each.id === tab.id),
    pinned,
    inProject: workspace.kind === 'project',
  };
  return { status: 'ready', subject };
};

const resolveSubject = (inputs: SubjectInputs): SubjectState => {
  const { pin, follow } = inputs;
  if (pin === null) return follow === null ? NO_SUBJECT : subjectOf(inputs, follow, false);
  const tab = pinnedTab(inputs, pin);
  return tab === null ? { status: 'missing', ref: pin } : subjectOf(inputs, tab, true);
};

export { resolveSubject };
