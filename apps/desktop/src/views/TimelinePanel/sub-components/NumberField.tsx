/* @layer renderer-app @kind component */
import { useState } from 'react';
import { NumberField as TesseraNumberField } from '@drizztdourden08/tessera';
import type { NumberFieldProps } from '../TimelinePanel.type';

const NumberField = ({ label, value, min, max, step, disabled, mixed = false, presets, suffix, onCommit }: NumberFieldProps) => {
  const [draft, setDraft] = useState(value);
  const [touched, setTouched] = useState(false);
  const commit = (next = draft): void => {
    if (!touched && next === value) return;
    if (Number.isNaN(next) || (next === value && !mixed)) return;
    if (!onCommit(next)) {
      setDraft(value);
      setTouched(false);
    }
  };
  return (
    <TesseraNumberField
      size="sm"
      min={min}
      max={max}
      step={step}
      value={draft}
      disabled={disabled}
      mixed={mixed && !touched}
      presets={presets}
      suffix={suffix}
      aria-label={label}
      onChange={(next) => {
        setDraft(next);
        setTouched(true);
        if (presets?.includes(next)) commit(next);
      }}
      onBlur={() => commit()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit();
      }}
    />
  );
};

export { NumberField };
