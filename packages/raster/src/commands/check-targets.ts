/* @layer core @kind logic */
import { ERROR_CODE, fail, requireBank, requireSprite } from '@bxel/document';
import type { TargetIssue } from '@bxel/document';
import { targetIssue } from './target-issue';
import type { TargetRules } from './target-rules.type';

const checkTargets = ({ artwork, sprites, index, mask }: TargetRules): void => {
  const mismatched: TargetIssue[] = [];
  const tooHigh: TargetIssue[] = [];
  for (const spriteId of sprites) {
    const sprite = requireSprite(artwork, spriteId);
    if (mask && (mask.width !== sprite.width || mask.height !== sprite.height)) {
      mismatched.push(targetIssue(spriteId, 'the mask size differs from the sprite size'));
    }
    if (index >= requireBank(artwork, sprite.bankId).slots.length) {
      tooHigh.push(targetIssue(spriteId, 'the index is past the last slot'));
    }
  }
  if (mismatched.length > 0) {
    throw fail(ERROR_CODE.INCOMPATIBLE_TARGETS, 'The mask must match the size of every target sprite.', {
      details: mismatched,
    });
  }
  if (tooHigh.length > 0) {
    throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, 'The index is at or above the palette size.', { details: tooHigh });
  }
};

export { checkTargets };
