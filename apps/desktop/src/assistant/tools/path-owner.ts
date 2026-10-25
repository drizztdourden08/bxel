/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { toSlashes } from '../../workspace/to-slashes';
import type { ToolContext } from '../assistant.type';
import type { PathOwner } from './tool-input.type';

const pathOwner = (context: ToolContext, path: string): PathOwner | null => {
  const wanted = toSlashes(path);
  for (const workspace of Object.values(useWorkspaceStore.getState().workspaces)) {
    const id = [...workspace.paths].find(([, known]) => isSamePath(known, wanted))?.[0];
    if (id !== undefined) return { documentId: workspace.documentId, id };
  }
  const loose = context.paths.documentAt(path);
  return loose === undefined ? null : { documentId: loose, id: null };
};

export { pathOwner };
