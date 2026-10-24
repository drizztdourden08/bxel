/* @layer renderer-app @kind component */
import { Callout, Text } from '@drizztdourden08/tessera';
import { BANK_PICK_TEXT } from '../../../../../sheet-manager/bank-text.constants';
import type { BankNotesProps } from '../ManagerDialogs.type';

const BankNotes = ({ plan, name }: BankNotesProps) => {
  if (plan === null) return null;
  return (
    <>
      {plan.blocker === null && <Text>{BANK_PICK_TEXT.moving(plan.movers.length, name)}</Text>}
      {plan.blocker === null && <Text tone="dim">{BANK_PICK_TEXT.colours(plan.colours, plan.merged)}</Text>}
      {plan.skipped > 0 && <Text tone="dim">{BANK_PICK_TEXT.skipped(plan.skipped)}</Text>}
      {plan.blocker !== null && <Callout tone="warning">{plan.blocker}</Callout>}
    </>
  );
};

export { BankNotes };
