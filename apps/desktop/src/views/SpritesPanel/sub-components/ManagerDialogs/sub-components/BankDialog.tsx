/* @layer renderer-app @kind component */
import { Field, Select, Stack } from '@drizztdourden08/tessera';
import { assignBank } from '../../../../../sheet-manager/assign-bank';
import { BANK_PICK_TEXT } from '../../../../../sheet-manager/bank-text.constants';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { useBankForm } from '../behavior/useBankForm';
import { BankNotes } from './BankNotes';
import { DialogFrame } from './DialogFrame';

const BankDialog = ({ model }: ManagerModelProps) => {
  const form = useBankForm(model);
  const { plan, bankId } = form;
  const banks = model.artwork.banks;
  return (
    <DialogFrame
      title={BANK_PICK_TEXT.title(form.targets.length)}
      canApply={plan?.blocker === null}
      onApply={() => bankId !== null && assignBank(model.ids, bankId)}
    >
      <Stack gap="md">
        <Field label={BANK_PICK_TEXT.field}>
          <Select
            size="sm"
            aria-label={BANK_PICK_TEXT.field}
            options={banks.map((bank) => ({ value: bank.id, label: bank.name }))}
            value={bankId ?? ''}
            onChange={(value) => form.update(banks.find((bank) => bank.id === value)?.id ?? null)}
          />
        </Field>
        <BankNotes plan={plan} name={banks.find((bank) => bank.id === bankId)?.name ?? ''} />
      </Stack>
    </DialogFrame>
  );
};

export { BankDialog };
