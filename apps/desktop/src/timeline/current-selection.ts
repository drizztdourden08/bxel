/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import { useTimelineStore } from '../stores/useTimelineStore';
import { effectiveSelection } from './effective-selection';
import type { EffectiveSelection } from './timeline.type';

const currentSelection = (target: EditorTarget): EffectiveSelection =>
  effectiveSelection(target.sprite, useTimelineStore.getState().selection, { layerId: target.layerId, frameId: target.frameId });

export { currentSelection };
