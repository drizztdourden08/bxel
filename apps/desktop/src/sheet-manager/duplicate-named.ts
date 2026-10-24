/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { SPRITE_LABEL } from '../sheet/sprite-label.constants';
import { spritesTarget } from '../sheet/sprites-target';
import { knownSprites } from './known-sprites';
import type { RenamePlan } from './manager.type';
import { selectMade } from './select-made';

const duplicateNamed = (plan: RenamePlan): boolean => {
  if (!plan.ok) return false;
  const before = knownSprites();
  const steps = plan.entries.map((entry) => ({
    name: COMMAND_NAME.spriteDuplicate,
    targets: spritesTarget([entry.id]),
    options: { name: entry.to },
  }));
  if (runDocument(SPRITE_LABEL.duplicate(steps.length), steps) === null) return false;
  selectMade(before);
  return true;
};

export { duplicateNamed };
