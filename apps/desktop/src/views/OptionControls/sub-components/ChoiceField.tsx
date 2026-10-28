/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import type { SegmentOption } from '@drizztdourden08/tessera';
import type { OptionChoice } from '../../../editor/tool-options/tool-options.type';
import type { ChoiceFieldProps } from '../OptionControls.type';

const segmentOf = (choice: OptionChoice): SegmentOption => {
  const hint = { label: choice.label, description: choice.description };
  if (choice.icon !== undefined) return { value: choice.value, icon: choice.icon, hint };
  if (choice.glyph !== undefined) return { value: choice.value, icon: <span className="option-glyph">{choice.glyph}</span>, hint };
  return { value: choice.value, label: choice.label };
};

const ChoiceField = ({ spec, value, disabled, onChange }: ChoiceFieldProps) => (
  <SegmentedControl
    aria-label={spec.label}
    size="sm"
    value={value}
    disabled={disabled}
    options={(spec.choices ?? []).map(segmentOf)}
    onChange={onChange}
  />
);

export { ChoiceField };
