/* @layer renderer-app @kind component */
import { useState } from 'react';
import { NumberInput } from '@drizztdourden08/tessera';
import type { NumberFieldProps } from '../TimelinePanel.type';

const NumberField = ({ label, value, min, max, step, disabled, onCommit }: NumberFieldProps) => {
  const [draft, setDraft] = useState(value);
  const commit = (): void => {
    if (draft !== value && !onCommit(draft)) setDraft(value);
  };
  return (
    <NumberInput
      size="sm"
      sizeToContent
      min={min}
      max={max}
      step={step}
      value={draft}
      disabled={disabled}
      aria-label={label}
      onChange={setDraft}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit();
      }}
    />
  );
};

export { NumberField };
