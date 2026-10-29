/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTarget } from '../current-target';
import { celPixels } from './cel-pixels';
import { commitSelection } from './commit-selection';
import { mergeMask } from './merge-mask';
import { opaqueOf } from './opaque-of';
import { selectionMask } from './selection-mask';

const selectOpaque = (): void => {
  const target = currentTarget();
  if (!target) return;
  const { width, height } = target.sprite;
  commitSelection(target, mergeMask(selectionMask(target), opaqueOf(celPixels(target), width, height), useSelectionStore.getState().mode));
};

export { selectOpaque };
