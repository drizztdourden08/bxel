/* @layer renderer-app @kind component */
import { NumberInput } from '@drizztdourden08/tessera';
import type { SizeFieldProps } from '../TilemapDialog.type';

const SizeField = ({ range, field }: SizeFieldProps) => (
  <NumberInput size="sm" sizeToContent min={range.min} max={range.max} step={1} value={field.value} aria-label={field.label} onChange={field.onChange} />
);

export { SizeField };
