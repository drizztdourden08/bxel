/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { currentTarget } from '../../../editor/current-target';
import { hasPreview } from '../../../editor/pending/has-preview';
import { selectionMask } from '../../../editor/selection/selection-mask';
import { currentContext } from '../../../ui-context/current-context';
import type { PixelViewportHandle } from '../../PixelViewport';
import { canvasBaseEntries } from './canvas-base-entries';
import { canvasHere } from './canvas-here';
import { canvasSelectionEntries } from './canvas-selection-entries';

const canvasMenuEntries = (context: ContextMenuContext, viewport: PixelViewportHandle | null): readonly ContextMenuEntry[] => {
  const target = currentTarget();
  if (!target) return [];
  const here = canvasHere(context, viewport);
  const mask = selectionMask(target);
  const pending = hasPreview();
  const outside = mask !== null && here !== null && context.trigger !== 'keyboard' && mask.bits[here.y * mask.width + here.x] === 0;
  const tile = currentContext().editTarget === 'tile';
  return (mask !== null || pending) && !outside ? canvasSelectionEntries(here, pending, tile) : canvasBaseEntries(here, tile);
};

export { canvasMenuEntries };
