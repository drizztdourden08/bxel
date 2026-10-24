/* @layer renderer-app @kind component */
import { Flex, NumberInput, Span } from '@drizztdourden08/tessera';
import { useState } from 'react';
import type { NumberFieldProps } from '../DefaultsEditor.type';

const NumberField = ({ label, value, min, max, unit, onChange }: NumberFieldProps) => {
  const [draft, setDraft] = useState<number | null>(null);
  return (
    <Flex gap="xs" align="center">
      <NumberInput
        aria-label={label}
        value={draft ?? value}
        min={min}
        max={max}
        step={1}
        onChange={(next) => {
          setDraft(next);
          if (Number.isInteger(next)) onChange(next);
        }}
        onBlur={() => setDraft(null)}
      />
      {unit !== undefined && <Span tone="muted">{unit}</Span>}
    </Flex>
  );
};

export { NumberField };
