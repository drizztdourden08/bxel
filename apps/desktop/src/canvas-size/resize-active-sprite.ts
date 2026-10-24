/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { resizeSprites } from '../sheet-manager/resize-sprites';
import type { ResizeSpec } from '../sheet-manager/manager.type';

const resizeActiveSprite = (spec: ResizeSpec): boolean => {
  const target = currentTarget();
  return target !== null && resizeSprites([target.sprite.id], spec);
};

export { resizeActiveSprite };
