/* @layer renderer-app @kind component */
import { Field, Select } from '@drizztdourden08/tessera';
import { BANK_TEXT } from '../../../palette-bank/palette-bank.constants';
import { useBankRow } from '../behavior/useBankRow';

const BankRow = () => {
  const row = useBankRow();
  if (row === null) return null;
  return (
    <Field label={BANK_TEXT.label} hint={BANK_TEXT.hint}>
      <Select options={row.options} value={row.value} onChange={row.choose} />
    </Field>
  );
};

export { BankRow };
