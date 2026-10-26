/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';

const runGuide = (label: string, name: string, options: object): boolean => {
  const target = currentTarget();
  if (!target) return false;
  return runDocument(label, [{ name, targets: spritesTarget([target.sprite.id]), options }]) !== null;
};

export { runGuide };
