/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { BankId } from '../../model/ids.type';
import { requireBank } from '../../read/require-bank';
import { checkSize } from '../../validate/check-size';
import type { AnimationPlan } from './animation-plan.type';
import type { BlankSource } from './anim-source.type';
import { buildAnimFrame } from './build-anim-frame';

const planBlank = (draft: Draft, source: BlankSource): AnimationPlan => {
  checkSize(source);
  const bankId = (source.bankId ?? draft.artwork.defaultBankId) as BankId;
  requireBank(draft.artwork, bankId);
  const frames = Array.from({ length: source.frames }, () =>
    buildAnimFrame(draft.ids, { spriteId: null }, { durationMs: source.durationMs }),
  );
  return { width: source.width, height: source.height, bankId, frames };
};

export { planBlank };
