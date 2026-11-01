/* @layer renderer-app @kind logic */
import type { BankId } from '@bxel/document';
import { assignBank } from '../../sheet-manager/assign-bank';
import { bankPlan } from '../../sheet-manager/bank-plan';
import type { Direct } from './direct-commands.type';
import { withTargets } from './with-targets';

const setPalette: Direct = (args) =>
  withTargets(args, ({ artwork }, sprites) => {
    const bankId = (args as { bankId: BankId }).bankId;
    const plan = bankPlan(artwork, sprites, bankId);
    if (plan.blocker !== null) return plan.blocker;
    return assignBank(sprites.map((sprite) => sprite.id), bankId) ? null : 'The palette did not change.';
  });

export { setPalette };
