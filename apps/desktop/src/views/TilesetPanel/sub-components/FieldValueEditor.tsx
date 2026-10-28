/* @layer renderer-app @kind component */
import { Checkbox } from '@drizztdourden08/tessera';
import type { FieldValueEditorProps } from '../TilesetPanel.type';
import { FieldChoiceSelect } from './FieldChoiceSelect';
import { FieldNumberInput } from './FieldNumberInput';
import { FieldTextInput } from './FieldTextInput';

const FieldValueEditor = (props: FieldValueEditorProps) => {
  const { field, value, mixed, onChange } = props;
  if (field.kind === 'bool') return <Checkbox checked={value === true} indeterminate={mixed} ariaLabel={field.name} onChange={onChange} />;
  if (field.kind === 'int' || field.kind === 'number') return <FieldNumberInput {...props} />;
  if (field.kind === 'choice') return <FieldChoiceSelect {...props} />;
  return <FieldTextInput {...props} />;
};

export { FieldValueEditor };
