/* @layer renderer-app @kind logic */
import type { SegmentOption, ShortcutKey } from '@drizztdourden08/tessera';
import type { HintedOption } from '../ActionHint.type';
import { optionTooltip } from './option-tooltip';

const segmentOption = <T extends string>(option: HintedOption<T>, keys?: readonly ShortcutKey[]): SegmentOption<T> => ({
  value: option.value,
  label: option.label,
  title: option.hint.name,
  disabled: option.disabled,
  tooltip: optionTooltip(option.hint, keys),
});

export { segmentOption };
