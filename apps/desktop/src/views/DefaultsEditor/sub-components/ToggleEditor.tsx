/* @layer renderer-app @kind component */
import { Toggle } from '@drizztdourden08/tessera';
import { TOGGLE_LABEL } from '../DefaultsEditor.constants';

const ToggleEditor = ({ field, value, onChange }: { field: 'platformStrict' | 'transparent'; value: unknown; onChange: (value: unknown) => void }) => (
  <Toggle checked={value === true} onChange={onChange} aria-label={TOGGLE_LABEL[field]} />
);

export { ToggleEditor };
