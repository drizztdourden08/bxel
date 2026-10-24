/* @layer renderer-app @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import type { RoleFieldProps } from '../ProjectControl.type';

const RoleField = ({ role, value, onCommit }: RoleFieldProps) => {
  const [draft, setDraft] = useState<string | null>(null);
  const finish = (): void => {
    if (draft !== null && draft !== value) onCommit(draft);
    setDraft(null);
  };
  return (
    <Field label={`Folder for ${role}`}>
      <TextInput
        value={draft ?? value}
        placeholder="Not set"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={finish}
        onKeyDown={(event) => {
          if (event.key === 'Enter') finish();
        }}
      />
    </Field>
  );
};

export { RoleField };
