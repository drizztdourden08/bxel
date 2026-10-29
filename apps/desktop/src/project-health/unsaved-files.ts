/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyOf } from '../workspace/key-of';

const unsavedFiles = (): number => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project');
  return workspace === undefined ? 0 : [...workspace.dirty].filter((id) => keyOf(id)?.kind !== 'project').length;
};

export { unsavedFiles };
