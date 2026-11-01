/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import { paintScope } from '../sheet/paint-scope';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { celsScope } from './cels-scope';
import type { EditorTarget } from './editor.type';

const celsPaintScope = (target: EditorTarget): TargetScope => {
  if (useDrawingStore.getState().cels !== 'selected' || !target.animation) return paintScope(target);
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  if (!view) return paintScope(target);
  return celsScope(target, view.state.artwork, useTimelineStore.getState().selection.frames) ?? paintScope(target);
};

export { celsPaintScope };
