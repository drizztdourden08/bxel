/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTarget } from './current-target';
import type { EditorTarget } from './editor.type';
import { layerBlock } from './layer-block';

const unlockedTarget = (): EditorTarget | null => {
  const target = currentTarget();
  if (!target) return null;
  const blocked = layerBlock(target.layer);
  if (blocked === null) return target;
  useNoticeStore.getState().post(blocked);
  return null;
};

export { unlockedTarget };
