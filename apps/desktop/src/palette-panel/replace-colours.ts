/* @layer renderer-app @kind logic */
import type { SpriteId, TargetScope } from '@bxel/document';
import { ADVANCED_COMMAND } from '@bxel/raster';
import { cellScope } from '../editor/cell-scope';
import { currentTarget } from '../editor/current-target';
import type { EditorTarget } from '../editor/editor.type';
import { runSelectionStep } from '../editor/selection/run-selection-step';
import { selectionMask } from '../editor/selection/selection-mask';
import { useToolStore } from '../stores/useToolStore';
import { REPLACE_TEXT } from './palette-panel.constants';
import type { ReplaceScope } from './palette-panel.type';

const everything = (sprites: readonly SpriteId[]): TargetScope => ({ sprites: [...sprites], layers: { by: 'all' }, frames: { by: 'all' } });

/** The cels a replace reaches: this layer and frame, the whole sprite, every sprite of the animation, or the selection on this layer and frame. */
const replaceScope = (target: EditorTarget, scope: ReplaceScope): TargetScope => {
  if (scope === 'sprite') return everything([target.sprite.id]);
  if (scope === 'animation' && target.animation) return everything([...new Set(target.animation.animation.frames.flatMap((frame) => (frame.spriteId ? [frame.spriteId] : [])))]);
  return cellScope(target);
};

const withMask = (scope: ReplaceScope, mask: ReturnType<typeof selectionMask>): { mask?: NonNullable<ReturnType<typeof selectionMask>> } => (scope === 'selection' && mask ? { mask } : {});

/** Replaces the pixels of one swatch with the front colour. */
const replaceWithFront = (index: number, scope: ReplaceScope): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const to = useToolStore.getState().foreground;
  return runSelectionStep(REPLACE_TEXT.front, { name: ADVANCED_COMMAND.pixelsReplace, options: { from: index, to, ...withMask(scope, selectionMask(target)) } }, (found) => replaceScope(found, scope));
};

/** Replaces every step of one ramp with the step at the same place on another ramp. */
const replaceRampSteps = (from: string, to: string, scope: ReplaceScope): boolean => {
  const target = currentTarget();
  if (!target) return false;
  return runSelectionStep(REPLACE_TEXT.ramp, { name: ADVANCED_COMMAND.pixelsReplaceRamp, options: { from, to, ...withMask(scope, selectionMask(target)) } }, (found) => replaceScope(found, scope));
};

export { replaceRampSteps, replaceWithFront };
