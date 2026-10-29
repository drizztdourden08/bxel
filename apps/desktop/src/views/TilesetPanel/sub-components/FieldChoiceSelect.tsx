/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import type { FieldValueEditorProps } from '../TilesetPanel.type';

const FieldChoiceSelect = ({ field, value, mixed, onChange }: FieldValueEditorProps) => {
  const options = (field.choices ?? []).map((choice) => ({ value: choice, label: choice }));
  return (
    <Select size="sm" aria-label={field.name} mixed={mixed} options={options} value={String(value ?? field.default)} onChange={onChange} />
  );
};

export { FieldChoiceSelect };
