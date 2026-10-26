/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../../../editor/editor.type';
import type { PivotFrame } from './canvas-tools.type';

const pivotFrame = (target: EditorTarget): PivotFrame => {
  const clip = target.animation?.frame.clip;
  return {
    x: clip?.x ?? 0,
    y: clip?.y ?? 0,
    width: clip?.width ?? target.sprite.width,
    height: clip?.height ?? target.sprite.height,
    imageWidth: target.sprite.width,
    imageHeight: target.sprite.height,
  };
};

export { pivotFrame };
