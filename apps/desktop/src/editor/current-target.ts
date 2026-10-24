/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { activeTarget } from './active-target';
import type { EditorTarget } from './editor.type';

const currentTarget = (): EditorTarget | null => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  return activeTarget(view, useToolStore.getState().layerId, useSpriteStore.getState().activeId, useTimelineStore.getState().frameId);
};

export { currentTarget };
