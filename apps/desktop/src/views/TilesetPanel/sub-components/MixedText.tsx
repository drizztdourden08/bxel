/* @layer renderer-app @kind component */
import { useState } from 'react';
import { Field, TextInput } from '@drizztdourden08/tessera';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { MixedTextProps } from '../TilesetPanel.type';

const MixedText = ({ label, value, mixed, placeholder, disabled, onCommit }: MixedTextProps) => {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (mixed ? '' : (value ?? ''));
  const commit = (): void => {
    if (draft !== null && draft !== (value ?? '')) onCommit(draft);
    setDraft(null);
  };
  return (
    <Field label={label}>
      <TextInput
        size="sm"
        aria-label={label}
        value={shown}
        placeholder={mixed ? TILESET_TEXT.mixed : placeholder}
        disabled={disabled}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => event.key === 'Enter' && commit()}
      />
    </Field>
  );
};

export { MixedText };
