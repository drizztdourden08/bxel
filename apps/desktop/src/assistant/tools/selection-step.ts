/* @layer renderer-app @kind logic */
import type { CombineMode } from '@bxel/raster';
import { currentTarget } from '../../editor/current-target';
import { mergeMask } from '../../editor/selection/merge-mask';
import { selectionMask } from '../../editor/selection/selection-mask';
import { setSelection } from '../../editor/selection/set-selection';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { incomingFailure } from './incoming-failure';
import { REPLACING } from './selection-step.constants';
import { shapeIncoming } from './shape-incoming';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const selectionStep: ViewStep = (patch) => {
  const { selection } = patch;
  if (!selection) return null;
  const target = currentTarget();
  if (!target) return viewFail(APP_TOOL_TEXT.noSelectionTarget, 'selection');
  const { shape } = selection;
  if (shape.kind === 'none') {
    setSelection(target, null);
    return null;
  }
  const incoming = shapeIncoming(shape, target);
  if (typeof incoming === 'string') return incomingFailure(shape, incoming);
  const op: CombineMode = REPLACING.has(shape.kind) ? 'replace' : selection.op;
  setSelection(target, mergeMask(selectionMask(target), incoming, op));
  return null;
};

export { selectionStep };
