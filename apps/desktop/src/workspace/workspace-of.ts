/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { Workspace, WorkspaceSeed } from './workspace.type';

const workspaceOf = (documentId: DocumentId, seed: WorkspaceSeed): Workspace => ({
  documentId,
  kind: seed.kind,
  name: seed.name,
  root: seed.root,
  dirs: seed.dirs,
  projectFile: seed.projectFile,
  paths: seed.paths,
  saved: new Map(),
  dirty: seed.dirty,
  base: seed.artwork,
  last: seed.artwork,
  legacy: seed.legacy,
  migration: seed.migration ?? null,
  steps: { undo: [], redo: [] },
});

export { workspaceOf };
