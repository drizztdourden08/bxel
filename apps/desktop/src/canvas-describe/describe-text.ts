/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import { currentTarget } from '../editor/current-target';
import { selectionMask } from '../editor/selection/selection-mask';
import { useReadoutStore } from '../stores/useReadoutStore';
import { useViewStore } from '../stores/useViewStore';
import { DESCRIBE_TEXT } from './canvas-describe.constants';
import { coloursUsed } from './colours-used';

const describeText = (): string => {
  const target = currentTarget();
  if (!target) return DESCRIBE_TEXT.nothing;
  const parts: string[] = [DESCRIBE_TEXT.size(target.sprite.width, target.sprite.height)];
  if (target.animation) {
    const { animation, frame } = target.animation;
    parts.push(DESCRIBE_TEXT.frame(animation.frames.findIndex((each) => each.id === frame.id) + 1, animation.frames.length));
  }
  parts.push(DESCRIBE_TEXT.layer(target.layer.name));
  parts.push(DESCRIBE_TEXT.colours(coloursUsed(target)));
  const mask = selectionMask(target);
  const bounds = mask === null ? null : maskBounds(mask);
  parts.push(bounds === null ? DESCRIBE_TEXT.noSelection : DESCRIBE_TEXT.selection(bounds.width, bounds.height, bounds.x, bounds.y));
  parts.push(DESCRIBE_TEXT.zoom(Math.round(useReadoutStore.getState().zoom * 100)));
  if (useViewStore.getState().mirror) parts.push(DESCRIBE_TEXT.mirrored);
  return `${parts.join(', ')}.`;
};

export { describeText };
