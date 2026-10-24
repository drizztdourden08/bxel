/* @layer core @kind logic */
import { ERROR_CODE, fail, requireBank, requireSprite } from '@bxel/document';
import type { SpriteId, TargetIssue } from '@bxel/document';
import { rampSlots } from '../shade/ramp-slots';
import { targetIssue } from './target-issue';
import type { RampRequest } from './ramp-request.type';

const resolveRamps = ({ project, sprites, name, needs }: RampRequest): Map<SpriteId, readonly number[]> => {
  const found = new Map<SpriteId, readonly number[]>();
  const missing: TargetIssue[] = [];
  const short: TargetIssue[] = [];
  for (const spriteId of sprites) {
    const slots = rampSlots(requireBank(project, requireSprite(project, spriteId).bankId), name);
    if (!slots || slots.length === 0) {
      missing.push(targetIssue(spriteId, `the palette has no ramp "${name}" with colors`));
    } else if (slots.length < needs) {
      short.push(targetIssue(spriteId, `the ramp "${name}" has fewer than ${needs} colors`));
    } else {
      found.set(spriteId, slots);
    }
  }
  if (missing.length > 0) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Ramp "${name}" does not exist in every target palette.`, { details: missing });
  }
  if (short.length > 0) {
    throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, 'The ramp is shorter than the requested position.', { details: short });
  }
  return found;
};

export { resolveRamps };
