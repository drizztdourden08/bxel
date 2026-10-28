/* @layer renderer-app @kind component */
import { Button, Icon, Slider, Toggle } from '@drizztdourden08/tessera';
import type { OptionFieldProps } from '../OptionControls.type';
import { ChoiceField } from './ChoiceField';

const OptionField = ({ spec, value, disabledReason, onChange }: OptionFieldProps) => {
  const disabled = disabledReason !== undefined;
  if (spec.kind === 'number') {
    return (
      <Slider
        aria-label={spec.label}
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={Number(value)}
        disabled={disabled}
        input
        onChange={onChange}
      />
    );
  }
  if (spec.kind === 'choice') return <ChoiceField spec={spec} value={String(value)} disabled={disabled} onChange={onChange} />;
  if (spec.kind === 'toggle') return <Toggle aria-label={spec.label} checked={value === true} disabled={disabled} onChange={onChange} />;
  return (
    <Button size="sm" variant="secondary" disabled={disabled} icon={spec.icon ? <Icon name={spec.icon} /> : undefined} onClick={() => onChange(true)}>
      {spec.caption ?? spec.label}
    </Button>
  );
};

export { OptionField };
