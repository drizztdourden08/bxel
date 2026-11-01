/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND } from '@bxel/raster';
import { currentTarget } from '../editor/current-target';
import { runSelectionStep } from '../editor/selection/run-selection-step';
import { selectionMask } from '../editor/selection/selection-mask';
import { REPLACE_TEXT } from './palette-panel.constants';
import type { ReplaceScope } from './palette-panel.type';
import { replaceScope } from './replace-scope';
import { withMask } from './with-mask';

const replaceRampSteps = (from: string, to: string, scope: ReplaceScope): boolean => {
  const target = currentTarget();
  if (!target) return false;
  return runSelectionStep(REPLACE_TEXT.ramp, { name: ADVANCED_COMMAND.pixelsReplaceRamp, options: { from, to, ...withMask(scope, selectionMask(target)) } }, (found) => replaceScope(found, scope));
};

export { replaceRampSteps };
