/* @layer renderer-app @kind component */
import { useState } from 'react';
import { NumberInput } from '@drizztdourden08/tessera';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { NumberFieldProps } from '../TimelinePanel.type';

const NumberField = ({ label, value, min, max, step, disabled, mixed = false, onCommit }: NumberFieldProps) => {
  const [draft, setDraft] = useState(mixed ? Number.NaN : value);
  const commit = (): void => {
    if (Number.isNaN(draft) || (draft === value && !mixed)) return;
    if (!onCommit(draft)) setDraft(mixed ? Number.NaN : value);
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
      placeholder={mixed ? TIMELINE_PANEL_TEXT.mixed : undefined}
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
