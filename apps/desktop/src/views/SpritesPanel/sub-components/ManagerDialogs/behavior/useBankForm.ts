/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import type { BankId } from '@bxel/document';
import { bankPlan } from '../../../../../sheet-manager/bank-plan';
import type { ManagerModel } from '../../../SpritesPanel.type';
import type { BankForm } from '../ManagerDialogs.type';
import { useTargets } from './useTargets';

const useBankForm = (model: ManagerModel): BankForm => {
  const targets = useTargets(model);
  const first = targets[0]?.bankId;
  const other = model.artwork.banks.find((bank) => bank.id !== first) ?? model.artwork.banks[0];
  const [bankId, setBankId] = useState<BankId | null>(other?.id ?? null);
  const plan = useMemo(() => (bankId === null ? null : bankPlan(model.artwork, targets, bankId)), [model.artwork, targets, bankId]);
  return { bankId, plan, targets, update: setBankId };
};

export { useBankForm };
