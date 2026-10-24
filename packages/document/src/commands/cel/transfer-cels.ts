/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { CelTransferOptions } from '../../schema/command-options.type';
import type { CommandInput } from '../command-def.type';
import { checkPairs } from './check-pairs';
import type { LockRule, SlotAction } from './cel.type';
import { pickSlots } from './pick-slots';

const transferCels = (draft: Draft, input: CommandInput<CelTransferOptions>, rule: LockRule, act: SlotAction): void => {
  const { from, to, allowLocked } = input.options;
  const sources = pickSlots(draft.artwork, input.sprites, from, 'from');
  const targets = pickSlots(draft.artwork, input.sprites, to, 'to');
  const pairs = sources.flatMap((source) => {
    const target = targets.find((item) => item.sprite.id === source.sprite.id);
    return target ? [{ source, target }] : [];
  });
  checkPairs(pairs, rule, allowLocked);
  for (const pair of pairs) act(draft, pair);
};

export { transferCels };
