/* @layer renderer-app @kind logic */
import { broadcastBlock } from '../sheet/broadcast-block';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useLayerViewStore } from '../stores/useLayerViewStore';
import { useLinkedPromptStore } from '../stores/useLinkedPromptStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import type { EditorTarget } from './editor.type';
import { layerBlock } from './layer-block';
import { isLinkedCel } from './linked-cel';
import type { PressPlan } from './press-plan.type';

const allowPress = (plan: PressPlan, target: EditorTarget): boolean => {
  if (plan.kind === 'pick' || plan.kind === 'zoom') return true;
  useTimelineStore.getState().pause();
  const layerBlocked = layerBlock(target.layer);
  const blocked = layerBlocked ?? broadcastBlock(target);
  if (blocked !== null) {
    if (layerBlocked !== null) useLayerViewStore.getState().flashLayer(target.layerId);
    useNoticeStore.getState().post(blocked);
    return false;
  }
  if (isLinkedCel(target) && useDrawingStore.getState().linkedChoice === 'ask') {
    useLinkedPromptStore.getState().show();
    return false;
  }
  return true;
};

export { allowPress };
