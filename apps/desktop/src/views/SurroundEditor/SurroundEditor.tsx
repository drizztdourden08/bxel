/* @layer renderer-app @kind component */
import { Button, Field, Flex, Select, Stack, Text } from '@drizztdourden08/tessera';
import { surroundKindOf } from '../../canvas-look/surround-kind-of';
import { SURROUND_OPTIONS, SURROUND_EDITOR_TEXT } from './SurroundEditor.constants';
import { useSurroundEditor } from './behavior/useSurroundEditor';
import { PatternGrid } from './sub-components/PatternGrid';
import { SurroundPreview } from './sub-components/SurroundPreview';
import './SurroundEditor.css';

const SurroundEditor = () => {
  const editor = useSurroundEditor();
  return (
    <Stack gap="md" className="surround-editor">
      <Field label={SURROUND_EDITOR_TEXT.kindLabel}>
        <Select options={SURROUND_OPTIONS} value={editor.kind} onChange={(value) => editor.setKind(surroundKindOf(value))} />
      </Field>
      <Stack gap="xs">
        <Text variant="label">{SURROUND_EDITOR_TEXT.previewTitle}</Text>
        <SurroundPreview look={editor.look} />
      </Stack>
      <Stack gap="xs">
        <Text variant="label">{SURROUND_EDITOR_TEXT.editorTitle}</Text>
        <Text variant="caption" tone="muted">{SURROUND_EDITOR_TEXT.hint}</Text>
        <PatternGrid bits={editor.bits} look={editor.look} onChange={editor.setBits} />
        <Flex gap="sm" align="center" wrap>
          <Button size="sm" variant="secondary" onClick={editor.clear}>{SURROUND_EDITOR_TEXT.clear}</Button>
          <Button size="sm" variant="secondary" onClick={editor.invert}>{SURROUND_EDITOR_TEXT.invert}</Button>
          <Button size="sm" variant="secondary" onClick={editor.copyChosen}>{SURROUND_EDITOR_TEXT.copyChosen}</Button>
        </Flex>
      </Stack>
    </Stack>
  );
};

export { SurroundEditor };
