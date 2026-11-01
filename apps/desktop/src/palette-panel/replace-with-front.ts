/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND } from '@bxel/raster';
import { currentTarget } from '../editor/current-target';
import { runSelectionStep } from '../editor/selection/run-selection-step';
import { selectionMask } from '../editor/selection/selection-mask';
import { useToolStore } from '../stores/useToolStore';
import { REPLACE_TEXT } from './palette-panel.constants';
import type { ReplaceScope } from './palette-panel.type';
import { replaceScope } from './replace-scope';
import { withMask } from './with-mask';

const replaceWithFront = (index: number, scope: ReplaceScope): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const to = useToolStore.getState().foreground;
  return runSelectionStep(REPLACE_TEXT.front, { name: ADVANCED_COMMAND.pixelsReplace, options: { from: index, to, ...withMask(scope, selectionMask(target)) } }, (found) => replaceScope(found, scope));
};

export { replaceWithFront };
