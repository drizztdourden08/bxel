/* @layer renderer-app @kind component */
import { Anchored, Box, Button, Flex, SegmentedControl, Stack, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { EDITOR_MODELS, EDITOR_TEXT } from '../PalettePanel.constants';
import type { EditorModel, SwatchEditorProps } from '../PalettePanel.type';
import { BeforeAfter } from './BeforeAfter';
import { EditorFields } from './EditorFields';
import { SameNotice } from './SameNotice';

const SwatchEditor = ({ panel }: SwatchEditorProps) => {
  const { editor } = panel;
  const [model, setModel] = useState<EditorModel>('oklch');
  if (editor.index === null) return null;
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
      <Stack gap="sm" className="swatch-editor__body">
        <Flex align="center" justify="between" gap="sm">
          <Text variant="label">{EDITOR_TEXT.title(editor.index)}</Text>
          <BeforeAfter before={editor.original} after={editor.value} alpha={editor.alpha} />
        </Flex>
        <SegmentedControl size="sm" label={EDITOR_TEXT.models} value={model} options={EDITOR_MODELS} onChange={setModel} />
        <EditorFields model={model} editor={editor} />
        <SameNotice panel={panel} />
        <Box className="swatch-editor__actions">
          <Button size="sm" variant="tertiary" onClick={editor.reset}>
            {EDITOR_TEXT.reset}
          </Button>
          <Button size="sm" variant="secondary" onClick={editor.cancel}>
            {EDITOR_TEXT.cancel}
          </Button>
          <Button size="sm" variant="primary" onClick={editor.done}>
            {EDITOR_TEXT.done}
          </Button>
        </Box>
      </Stack>
    </Anchored>
  );
};

export { SwatchEditor };
