/* @layer renderer-app @kind logic */
import { broadcastBlock } from '../sheet/broadcast-block';
import { useNoticeStore } from '../stores/useNoticeStore';
import type { EditorTarget } from './editor.type';
import { layerBlock } from './layer-block';
import type { PressPlan } from './press-plan.type';

const allowPress = (plan: PressPlan, target: EditorTarget): boolean => {
  if (plan.kind === 'pick' || plan.kind === 'zoom') return true;
  const blocked = layerBlock(target.layer) ?? broadcastBlock(target);
  if (blocked === null) return true;
  useNoticeStore.getState().post(blocked);
  return false;
};

export { allowPress };
