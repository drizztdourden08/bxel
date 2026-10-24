/* @layer renderer-app @kind component */
import { Field, NumberInput } from '@drizztdourden08/tessera';
import { useEffect, useState } from 'react';
import type { StyleNumberProps } from '../AtlasView.type';

const StyleNumber = ({ label, value, min, max, onCommit }: StyleNumberProps) => {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const commit = (): void => {
    if (draft !== value && draft >= min && draft <= max) onCommit(draft);
    else setDraft(value);
  };
  return (
    <Field label={label}>
      <NumberInput
        size="sm"
        sizeToContent
        min={min}
        max={max}
        step={1}
        value={draft}
        onChange={setDraft}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
        }}
      />
    </Field>
  );
};

export { StyleNumber };
