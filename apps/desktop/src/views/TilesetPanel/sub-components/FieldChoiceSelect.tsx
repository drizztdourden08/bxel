/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import { MIXED_VALUE, TILESET_TEXT } from '../TilesetPanel.constants';
import type { FieldValueEditorProps } from '../TilesetPanel.type';

const FieldChoiceSelect = ({ field, value, mixed, onChange }: FieldValueEditorProps) => {
  const options = (field.choices ?? []).map((choice) => ({ value: choice, label: choice }));
  const shown = mixed ? [{ value: MIXED_VALUE, label: TILESET_TEXT.mixed, disabled: true }, ...options] : options;
  return (
    <Select size="sm" aria-label={field.name} options={shown} value={mixed ? MIXED_VALUE : String(value ?? field.default)} onChange={(next) => next !== MIXED_VALUE && onChange(next)} />
  );
};

export { FieldChoiceSelect };
