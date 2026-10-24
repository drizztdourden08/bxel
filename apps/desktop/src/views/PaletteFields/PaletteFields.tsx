/* @layer renderer-app @kind component */
import { Checkbox, Stack } from '@drizztdourden08/tessera';
import { LIMIT_TEXT } from '../../palette-limit/palette-limit.constants';
import type { PaletteFieldsProps } from './PaletteFields.type';
import { LimitFields } from './sub-components/LimitFields';
import { SourceSelect } from './sub-components/SourceSelect';

const PaletteFields = ({ value, limitError, paletteError, withSource, onChange }: PaletteFieldsProps) => (
  <Stack gap="sm">
    {withSource && <SourceSelect source={value.source} error={paletteError} onChange={(source) => onChange({ source })} />}
    <LimitFields limit={value.limit} error={limitError} onChange={(limit) => onChange({ limit })} />
    <Checkbox label={LIMIT_TEXT.transparency} checked={value.transparent} onChange={(transparent) => onChange({ transparent })} />
  </Stack>
);

export { PaletteFields };
