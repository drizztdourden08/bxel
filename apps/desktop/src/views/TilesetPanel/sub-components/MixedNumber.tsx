/* @layer renderer-app @kind component */
import { Field, NumberInput } from '@drizztdourden08/tessera';
import type { MixedNumberProps } from '../TilesetPanel.type';

const MixedNumber = ({ label, value, mixed, min, max, step, onCommit }: MixedNumberProps) => (
  <Field label={label}>
    <NumberInput
      size="sm"
      aria-label={label}
      value={mixed ? '' : (value ?? '')}
      mixed={mixed}
      min={min}
      max={max}
      step={step}
      onChange={(next) => Number.isFinite(next) && onCommit(next)}
    />
  </Field>
);

export { MixedNumber };
