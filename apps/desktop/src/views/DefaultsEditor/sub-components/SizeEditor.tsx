/* @layer renderer-app @kind component */
import { Flex, Span } from '@drizztdourden08/tessera';
import { APP_ASSET_DEFAULTS, DEFAULT_RANGES, DEFAULTS_TEXT } from '../../../asset-defaults/asset-defaults.constants';
import type { SizeEditorProps, SizeValue } from '../DefaultsEditor.type';
import { NumberField } from './NumberField';

const isSize = (value: unknown): value is SizeValue =>
  typeof value === 'object' && value !== null && typeof (value as SizeValue).width === 'number' && typeof (value as SizeValue).height === 'number';

const SizeEditor = ({ value, fallback = APP_ASSET_DEFAULTS.size, labels = DEFAULTS_TEXT, onChange }: SizeEditorProps) => {
  const size = isSize(value) ? value : fallback;
  const { min, max } = DEFAULT_RANGES.size;
  return (
    <Flex gap="sm" align="center" wrap>
      <NumberField label={labels.width} value={size.width} min={min} max={max} onChange={(width) => onChange({ width, height: size.height })} />
      <Span tone="muted">by</Span>
      <NumberField label={labels.height} value={size.height} min={min} max={max} unit="px" onChange={(height) => onChange({ width: size.width, height })} />
    </Flex>
  );
};

export { SizeEditor };
