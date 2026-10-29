/* @layer renderer-app @kind component */
import { Field, Stack, Text, TextInput, Toggle } from '@drizztdourden08/tessera';
import { SLICE_DIALOG_TEXT } from '../SliceDialog.constants';
import type { SliceFieldsProps } from '../SliceDialog.type';
import { PivotFields } from './PivotFields';
import { RectFields } from './RectFields';

const SliceFields = ({ model }: SliceFieldsProps) => {
  const { form, update } = model;
  return (
    <Stack gap="md">
      <Field label={SLICE_DIALOG_TEXT.name}>
        <TextInput size="sm" value={form.name} aria-label={SLICE_DIALOG_TEXT.name} onChange={(event) => update({ name: event.target.value })} />
      </Field>
      <RectFields rect={form.rect} label="Rectangle" onChange={(rect) => update({ rect })} />
      <PivotFields model={model} />
      <Toggle size="sm" label={SLICE_DIALOG_TEXT.centreOn} description={SLICE_DIALOG_TEXT.centreHint} checked={form.centreOn} onChange={(centreOn) => update({ centreOn })} />
      {form.centreOn && <RectFields rect={form.centre} label={SLICE_DIALOG_TEXT.centre} onChange={(centre) => update({ centre })} />}
      {!model.valid && <Text tone="dim">{SLICE_DIALOG_TEXT.invalid}</Text>}
    </Stack>
  );
};

export { SliceFields };
