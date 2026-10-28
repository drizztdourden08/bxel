/* @layer renderer-app @kind component */
import { FormRow } from '@drizztdourden08/tessera';
import { readOption } from '../../../editor/tool-options/read-option';
import { resetOption } from '../../../editor/tool-options/reset-option';
import { setOption } from '../../../editor/tool-options/set-option';
import type { OptionRowProps } from '../OptionControls.type';
import { OptionField } from './OptionField';

const OptionRow = ({ spec, compact = false }: OptionRowProps) => {
  const value = readOption(spec);
  const reason = spec.disabledReason?.();
  const changed = spec.kind !== 'action' && value !== spec.default;
  return (
    <FormRow
      label={spec.label}
      description={reason ?? spec.description}
      descriptionLines={compact ? 1 : 2}
      descriptionOverflow={compact ? 'hint' : 'more'}
      changed={changed}
      onReset={changed ? () => resetOption(spec) : undefined}
    >
      <OptionField spec={spec} value={value} disabledReason={reason} onChange={(next) => (spec.kind === 'action' ? spec.write(next) : setOption(spec, next))} />
    </FormRow>
  );
};

export { OptionRow };
