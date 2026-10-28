/* @layer renderer-app @kind component */
import { Checkbox, NumberInput, Select } from '@drizztdourden08/tessera';
import { MIXED_VALUE, TILESET_TEXT } from '../TilesetPanel.constants';
import type { FieldValueEditorProps } from '../TilesetPanel.type';
import { FieldTextInput } from './FieldTextInput';

const FieldValueEditor = (props: FieldValueEditorProps) => {
  const { field, value, mixed, onChange } = props;
  if (field.kind === 'bool') {
    return <Checkbox checked={value === true} indeterminate={mixed} ariaLabel={field.name} onChange={onChange} />;
  }
  if (field.kind === 'int' || field.kind === 'number') {
    return (
      <NumberInput
        size="sm"
        aria-label={field.name}
        step={field.kind === 'int' ? 1 : 0.1}
        value={mixed || value === undefined ? '' : Number(value)}
        placeholder={mixed ? TILESET_TEXT.mixed : String(field.default)}
        onChange={(next) => Number.isFinite(next) && onChange(field.kind === 'int' ? Math.round(next) : next)}
      />
    );
  }
  if (field.kind === 'choice') {
    const options = (field.choices ?? []).map((choice) => ({ value: choice, label: choice }));
    const shown = mixed ? [{ value: MIXED_VALUE, label: TILESET_TEXT.mixed, disabled: true }, ...options] : options;
    return (
      <Select size="sm" aria-label={field.name} options={shown} value={mixed ? MIXED_VALUE : String(value ?? field.default)} onChange={(next) => next !== MIXED_VALUE && onChange(next)} />
    );
  }
  return <FieldTextInput {...props} />;
};

export { FieldValueEditor };
