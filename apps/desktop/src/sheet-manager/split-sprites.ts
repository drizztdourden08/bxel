/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import type { SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { COMPOSE_LABEL } from './compose-text.constants';
import type { SplitSpec } from './compose.type';
import { knownSprites } from './known-sprites';
import { selectMade } from './select-made';
import { spriteSteps } from './sprite-steps';

const splitSprites = (ids: readonly SpriteId[], spec: SplitSpec): boolean => {
  const before = knownSprites();
  const steps = spriteSteps(TRANSFORM_COMMAND.spriteSplit, ids, { pattern: spec.pattern, start: spec.start, keep: spec.keep });
  if (ids.length === 0 || runDocument(COMPOSE_LABEL.split(ids.length), steps) === null) return false;
  selectMade(before);
  return true;
};

export { splitSprites };
