/* @layer renderer-app @kind component */
import { Button, Flex, Stack } from '@drizztdourden08/tessera';
import { SURROUND_EDITOR_TEXT } from './SurroundEditor.constants';
import { useSurroundEditor } from './behavior/useSurroundEditor';
import { PatternGrid } from './sub-components/PatternGrid';
import './SurroundEditor.css';

const SurroundEditor = () => {
  const editor = useSurroundEditor();
  return (
    <Stack gap="sm" className="surround-editor">
      <PatternGrid bits={editor.bits} look={editor.look} onChange={editor.setBits} />
      <Flex gap="sm" align="center" wrap role="group" aria-label={SURROUND_EDITOR_TEXT.toolsLabel}>
        <Button size="sm" variant="secondary" onClick={editor.clear}>
          {SURROUND_EDITOR_TEXT.clear}
        </Button>
        <Button size="sm" variant="secondary" onClick={editor.invert}>
          {SURROUND_EDITOR_TEXT.invert}
        </Button>
        <Button size="sm" variant="secondary" disabled={editor.kind === 'custom'} onClick={editor.copyChosen}>
          {SURROUND_EDITOR_TEXT.copyChosen}
        </Button>
      </Flex>
    </Stack>
  );
};

export { SurroundEditor };
