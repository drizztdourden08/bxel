/* @layer renderer-app @kind component */
import { AnchorPicker, Checkbox, Field, Stack, TextInput } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import type { MergeFieldsProps } from '../ComposeDialogs.type';

const MergeFields = ({ spec, first, update }: MergeFieldsProps) => (
  <Stack gap="sm">
    <Field label={COMPOSE_TEXT.name} hint={COMPOSE_TEXT.nameHint}>
      <TextInput autoFocus value={spec.name} placeholder={first} onChange={(event) => update({ name: event.target.value })} />
    </Field>
    <AnchorPicker label={COMPOSE_TEXT.anchor} variant="arrows" value={spec.anchor} onChange={(anchor) => update({ anchor })} />
    <Checkbox label={COMPOSE_TEXT.keep} checked={spec.keep} onChange={(keep) => update({ keep })} />
  </Stack>
);

export { MergeFields };
