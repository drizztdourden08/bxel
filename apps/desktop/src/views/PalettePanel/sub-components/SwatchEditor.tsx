/* @layer renderer-app @kind component */
import { Anchored, Button, Stack, TextInput, Toggle } from '@drizztdourden08/tessera';
import { ColorPicker } from '@drizztdourden08/tessera/color-picker';
import type { ColorMode } from '@drizztdourden08/tessera/color-picker';
import { useState } from 'react';
import { alphaLimit } from '../../../palette-panel/alpha-limit';
import { EDITOR_MODES, EDITOR_TEXT } from '../PalettePanel.constants';
import type { SwatchEditorProps } from '../PalettePanel.type';
import { SameNotice } from './SameNotice';

const SwatchEditor = ({ panel }: SwatchEditorProps) => {
  const { editor } = panel;
  const [mode, setMode] = useState<ColorMode>('oklch');
  if (editor.index === null) return null;
  const limit = alphaLimit(panel.artwork, panel.target.sprite);
  const name = <TextInput size="sm" aria-label={EDITOR_TEXT.name} placeholder={EDITOR_TEXT.name} value={editor.name} onChange={(event) => editor.rename(event.target.value)} />;
  const footer = (
    <Stack gap="xs">
      {limit.binary ? (
        <Toggle checked={editor.alpha >= 1} onChange={(opaque) => editor.changeAlpha(opaque ? 1 : 0)} label={EDITOR_TEXT.opaque} description={limit.reason} />
      ) : null}
      <SameNotice panel={panel} />
      <Button size="sm" variant="tertiary" onClick={editor.cancel}>
        {EDITOR_TEXT.cancel}
      </Button>
    </Stack>
  );
  return (
    <Anchored
      anchorRef={editor.anchor}
      placement="left-start"
      dismissOnOutsidePress={false}
      onDismiss={editor.cancel}
      className="swatch-editor"
      role="dialog"
      aria-label={EDITOR_TEXT.dialog(editor.index)}
    >
      <ColorPicker
        title={EDITOR_TEXT.title(editor.index)}
        name={name}
        value={editor.value || '#000000'}
        onChange={editor.change}
        alpha={editor.alpha}
        onAlphaChange={editor.changeAlpha}
        disableAlpha={limit.binary}
        modes={EDITOR_MODES}
        mode={mode}
        onModeChange={setMode}
        original={editor.original}
        onReset={editor.reset}
        onClose={editor.done}
        footer={footer}
      />
    </Anchored>
  );
};

export { SwatchEditor };
