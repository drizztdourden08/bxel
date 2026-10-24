/* @layer renderer-app @kind logic */
import { celUses } from '@bxel/document';
import { TIMELINE_TEXT } from '../timeline/timeline.constants';
import type { EditorTarget } from './editor.type';

const linkedBlock = (target: EditorTarget): string | null => {
  const celId = target.layer.cels[target.frameId];
  if (celId === undefined) return null;
  return celUses(target.sprite, celId).length > 1 ? TIMELINE_TEXT.linked : null;
};

export { linkedBlock };
