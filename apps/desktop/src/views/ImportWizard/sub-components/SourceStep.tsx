/* @layer renderer-app @kind component */
import { Callout, Field, SegmentedControl, Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import { KIND_OPTIONS, TARGET_OPTIONS } from '../ImportWizard.constants';
import type { StepProps } from '../ImportWizard.type';

const SourceStep = ({ image, wizard }: StepProps) => {
  const { form, errors, context, update, setTarget } = wizard;
  const targets = TARGET_OPTIONS.map((option) =>
    option.value === 'file' && context.documentId === null ? { ...option, disabled: IMPORT_TEXT.noFile } : option,
  );
  return (
    <Stack gap="md">
      <Text tone="muted">{IMPORT_TEXT.imageLine(image.width, image.height)}</Text>
      <Field label={IMPORT_TEXT.target}>
        <SegmentedControl aria-label={IMPORT_TEXT.target} value={form.target} options={targets} onChange={setTarget} />
      </Field>
      <Field label={IMPORT_TEXT.kind}>
        <SegmentedControl aria-label={IMPORT_TEXT.kind} value={form.kind} options={KIND_OPTIONS} onChange={(kind) => update({ kind })} />
      </Field>
      {form.kind === 'sprite' && (
        <Field label={IMPORT_TEXT.name} error={errors.name ?? undefined}>
          <TextInput value={form.name} onChange={(event) => update({ name: event.target.value })} />
        </Field>
      )}
      {errors.size !== null && <Callout tone="danger">{errors.size}</Callout>}
    </Stack>
  );
};

export { SourceStep };
