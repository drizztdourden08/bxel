/* @layer renderer-app @kind component */
import { DEFAULT_RANGES } from '../../../asset-defaults/asset-defaults.constants';
import { NUMBER_LABEL, NUMBER_UNIT } from '../DefaultsEditor.constants';
import { NumberField } from './NumberField';

const NumberEditor = ({ field, value, onChange }: { field: 'colorLimit' | 'frameDurationMs'; value: unknown; onChange: (value: unknown) => void }) => (
  <NumberField
    label={NUMBER_LABEL[field]}
    value={typeof value === 'number' ? value : DEFAULT_RANGES[field].min}
    min={DEFAULT_RANGES[field].min}
    max={DEFAULT_RANGES[field].max}
    unit={NUMBER_UNIT[field]}
    onChange={onChange}
  />
);

export { NumberEditor };
