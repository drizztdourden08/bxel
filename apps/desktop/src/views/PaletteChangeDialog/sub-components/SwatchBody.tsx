/* @layer renderer-app @kind component */
import { Field, Select, Stack, Text } from '@drizztdourden08/tessera';
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import { swatchChoices } from '../../../palette-change/swatch-choices';
import { useChangeStore } from '../../../stores/useChangeStore';
import { NO_REPLACEMENT } from '../PaletteChangeDialog.constants';
import type { ChangeBodyProps } from '../PaletteChangeDialog.type';
import { AffectedTable } from './AffectedTable';
import { BeforeAfter } from './BeforeAfter';

const SwatchBody = ({ request, state }: ChangeBodyProps) => {
  const { bank, preview } = state;
  const setOther = useChangeStore((store) => store.setOther);
  if (!bank || !preview) return null;
  const blank = request.kind === 'delete' ? [{ value: NO_REPLACEMENT, label: CHANGE_TEXT.noReplacement }] : [];
  const options = [...blank, ...swatchChoices(bank, request.swatch)];
  return (
    <Stack gap="md">
      <Text variant="label">{preview.swatchLine}</Text>
      <Field label={CHANGE_TEXT.pickLabels[request.kind]} hint={CHANGE_TEXT.pickHints[request.kind]}>
        <Select
          options={options}
          value={request.other === null ? NO_REPLACEMENT : String(request.other)}
          onChange={(value) => setOther(value === NO_REPLACEMENT ? null : Number(value))}
        />
      </Field>
      <Text aria-live="polite">{CHANGE_TEXT.affects(preview.affected.length, preview.totalSprites, preview.pixels)}</Text>
      {preview.affected.length > 0 && <AffectedTable affected={preview.affected} />}
      {preview.picture !== null && <BeforeAfter picture={preview.picture} />}
    </Stack>
  );
};

export { SwatchBody };
