/* @layer renderer-app @kind component */
import { Field, Select } from '@drizztdourden08/tessera';
import type { MixedChoiceProps } from '../TilesetPanel.type';

const MixedChoice = ({ label, value, mixed, options, onCommit }: MixedChoiceProps) => (
  <Field label={label}>
    <Select size="sm" aria-label={label} mixed={mixed} options={[...options]} value={value ?? ''} onChange={onCommit} />
  </Field>
);

export { MixedChoice };
