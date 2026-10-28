/* @layer renderer-app @kind component */
import { isHexColor } from '@bxel/palette';
import { TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { EDITOR_TEXT } from '../PalettePanel.constants';
import type { ModelPaneProps } from '../PalettePanel.type';

const HexField = ({ value, onChange }: ModelPaneProps) => {
  const [text, setText] = useState<string | null>(null);
  const shown = text ?? value.slice(1, 7).toUpperCase();
  const commit = (next: string) => {
    const hex = `#${next.replace(/^#/, '')}`;
    if (isHexColor(hex)) onChange(hex.toLowerCase());
  };
  return (
    <TextInput
      size="sm"
      aria-label={EDITOR_TEXT.hex}
      value={shown}
      invalid={!isHexColor(`#${shown}`)}
      onChange={(event) => {
        setText(event.target.value);
        commit(event.target.value);
      }}
      onBlur={() => setText(null)}
    />
  );
};

export { HexField };
