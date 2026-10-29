/* @layer renderer-app @kind component */
import { NumberInput } from '@drizztdourden08/tessera';
import type { FieldValueEditorProps } from '../TilesetPanel.type';

const FieldNumberInput = ({ field, value, mixed, onChange }: FieldValueEditorProps) => (
  <NumberInput
    size="sm"
    aria-label={field.name}
    step={field.kind === 'int' ? 1 : 0.1}
    value={mixed || value === undefined ? '' : Number(value)}
    mixed={mixed}
    placeholder={String(field.default)}
    onChange={(next) => Number.isFinite(next) && onChange(field.kind === 'int' ? Math.round(next) : next)}
  />
);

export { FieldNumberInput };
