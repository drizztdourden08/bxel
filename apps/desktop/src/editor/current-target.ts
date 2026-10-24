/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useToolStore } from '../stores/useToolStore';
import { activeTarget } from './active-target';
import type { EditorTarget } from './editor.type';

const currentTarget = (): EditorTarget | null => {
  const { host, activeId } = useDocumentStore.getState();
  return activeTarget(activeId === null ? null : host.view(activeId), useToolStore.getState().layerId);
};

export { currentTarget };
