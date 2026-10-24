/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { currentSelection } from './current-selection';

const runOnCels = (label: string, name: string): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const { frames, layers } = currentSelection(target);
  const targets = { sprites: [target.sprite.id], layers: { by: 'ids', ids: layers }, frames: { by: 'ids', ids: frames } } as const;
  return runDocument(label, [{ name, targets, options: {} }]) !== null;
};

export { runOnCels };
