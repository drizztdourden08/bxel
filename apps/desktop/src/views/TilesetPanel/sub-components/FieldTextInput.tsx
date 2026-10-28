/* @layer renderer-app @kind component */
import { useState } from 'react';
import { ColorSwatch, Flex, TextInput } from '@drizztdourden08/tessera';
import { COLOUR_PATTERN, TILESET_TEXT } from '../TilesetPanel.constants';
import type { FieldValueEditorProps } from '../TilesetPanel.type';

const FieldTextInput = ({ field, value, mixed, onChange }: FieldValueEditorProps) => {
  const [draft, setDraft] = useState<string | null>(null);
  const text = mixed || value === undefined ? '' : String(value);
  const shown = draft ?? text;
  const commit = (): void => {
    const valid = field.kind !== 'colour' || COLOUR_PATTERN.test(shown);
    if (draft !== null && draft !== text && valid) onChange(draft);
    setDraft(null);
  };
  return (
    <Flex gap="xs" align="center">
      {field.kind === 'colour' && COLOUR_PATTERN.test(shown) ? <ColorSwatch color={shown} size="sm" aria-label={field.name} /> : null}
      <TextInput
        size="sm"
        aria-label={field.name}
        value={shown}
        invalid={field.kind === 'colour' && shown !== '' && !COLOUR_PATTERN.test(shown)}
        placeholder={mixed ? TILESET_TEXT.mixed : String(field.default)}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => event.key === 'Enter' && commit()}
      />
    </Flex>
  );
};

export { FieldTextInput };
