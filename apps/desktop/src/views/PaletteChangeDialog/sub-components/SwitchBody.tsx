/* @layer renderer-app @kind component */
import type { BankId } from '@bxel/document';
import { Field, Select, Stack, Text } from '@drizztdourden08/tessera';
import { bankOptions } from '../../../palette-bank/bank-options';
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import { useChangeStore } from '../../../stores/useChangeStore';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import type { ChangeBodyProps } from '../PaletteChangeDialog.type';
import { BeforeAfter } from './BeforeAfter';

const SwitchBody = ({ request, state }: ChangeBodyProps) => {
  const { preview } = state;
  const setTarget = useChangeStore((store) => store.setTarget);
  const artwork = useDocumentStore((store) => store.views[request.documentId]?.state.artwork);
  if (!preview || !artwork) return null;
  const options = bankOptions(artwork).filter((option) => option.value !== request.bankId);
  return (
    <Stack gap="md">
      <Field label={CHANGE_TEXT.pickLabels.switch} hint={CHANGE_TEXT.pickHints.switch}>
        <Select options={options} value={request.toBankId ?? ''} placeholder={CHANGE_TEXT.choosePalette} onChange={(value) => setTarget(value as BankId)} />
      </Field>
      <Stack gap="2xs" aria-live="polite">
        <Text>{`${CHANGE_TEXT.before}: ${preview.countBefore}`}</Text>
        <Text>{`${CHANGE_TEXT.after}: ${preview.countAfter}`}</Text>
      </Stack>
      {preview.picture !== null && <BeforeAfter picture={preview.picture} />}
    </Stack>
  );
};

export { SwitchBody };
