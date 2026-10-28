/* @layer renderer-app @kind component */
import { Field, Select } from '@drizztdourden08/tessera';
import { MIXED_VALUE, TILESET_TEXT } from '../TilesetPanel.constants';
import type { MixedChoiceProps } from '../TilesetPanel.type';

const MixedChoice = ({ label, value, mixed, options, onCommit }: MixedChoiceProps) => (
  <Field label={label}>
    <Select
      size="sm"
      aria-label={label}
      options={mixed ? [{ value: MIXED_VALUE, label: TILESET_TEXT.mixed, disabled: true }, ...options] : [...options]}
      value={mixed ? MIXED_VALUE : (value ?? '')}
      onChange={(next) => next !== MIXED_VALUE && onCommit(next)}
    />
  </Field>
);

export { MixedChoice };
