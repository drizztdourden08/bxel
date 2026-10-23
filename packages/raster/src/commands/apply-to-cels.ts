/* @layer core @kind logic */
import { ensureCel, requireSprite, writableCel } from '@bxel/document';
import type { Draft, ResolvedCel } from '@bxel/document';
import type { CelOperation } from './cel-operation.type';

const applyToCel = (draft: Draft, target: ResolvedCel, operate: CelOperation): void => {
  const { width, height } = requireSprite(draft.project, target.spriteId);
  if (target.celId) {
    operate({ pixels: writableCel(draft, target.spriteId, target.celId), width, height });
    return;
  }
  const scratch = { pixels: new Uint8Array(width * height), width, height };
  if (operate(scratch) === null) return;
  const celId = ensureCel(draft, target);
  writableCel(draft, target.spriteId, celId).set(scratch.pixels);
};

const applyToCels = (draft: Draft, cels: readonly ResolvedCel[], operate: CelOperation): void => {
  for (const target of cels) applyToCel(draft, target, operate);
};

export { applyToCels };
