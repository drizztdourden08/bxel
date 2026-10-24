/* @layer renderer-app @kind component */
import { Checkbox, Field, Flex, NumberInput, Stack, TextInput } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import type { PieceFieldsProps } from '../ComposeDialogs.type';

const PieceFields = ({ pattern, start, keep, update }: PieceFieldsProps) => (
  <Stack gap="sm">
    <Field label={COMPOSE_TEXT.pattern} hint={COMPOSE_TEXT.patternHint}>
      <TextInput value={pattern} onChange={(event) => update({ pattern: event.target.value })} />
    </Field>
    <Flex gap="md" align="center" wrap>
      <Field label={COMPOSE_TEXT.start}>
        <NumberInput size="sm" sizeToContent min={0} max={99999} step={1} value={start} onChange={(next) => update({ start: next })} />
      </Field>
      <Checkbox label={COMPOSE_TEXT.keep} checked={keep} onChange={(next) => update({ keep: next })} />
    </Flex>
  </Stack>
);

export { PieceFields };
