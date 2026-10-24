/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, Stack, TextInput } from '@drizztdourden08/tessera';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import type { RenameFieldsProps } from '../ManagerDialogs.type';

const RenameFields = ({ spec, update }: RenameFieldsProps) => (
  <Stack gap="sm">
    <Field label={DIALOG_TEXT.pattern} hint={DIALOG_TEXT.patternHint}>
      <TextInput autoFocus value={spec.pattern} onChange={(event) => update({ pattern: event.target.value })} />
    </Field>
    <Flex gap="sm" wrap>
      <Field label={DIALOG_TEXT.find}>
        <TextInput value={spec.find} onChange={(event) => update({ find: event.target.value })} />
      </Field>
      <Field label={DIALOG_TEXT.replace}>
        <TextInput value={spec.replace} onChange={(event) => update({ replace: event.target.value })} />
      </Field>
      <Field label={DIALOG_TEXT.start}>
        <NumberInput size="sm" sizeToContent min={0} max={99999} step={1} value={spec.start} onChange={(start) => update({ start })} />
      </Field>
    </Flex>
  </Stack>
);

export { RenameFields };
