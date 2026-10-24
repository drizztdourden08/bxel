/* @layer renderer-app @kind component */
import { Callout, Field, Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { SWATCH_EDITOR_TEXT } from './SwatchSetEditor.constants';
import { useSwatchSetEditor } from './behavior/useSwatchSetEditor';
import { ColorDetail } from './sub-components/ColorDetail';
import { ColorGrid } from './sub-components/ColorGrid';
import { CopyBar } from './sub-components/CopyBar';
import { SetBar } from './sub-components/SetBar';
import './SwatchSetEditor.css';

const SwatchSetEditor = () => {
  const model = useSwatchSetEditor();
  return (
    <Stack gap="md" className="swatch-set-editor">
      <SetBar model={model} />
      <CopyBar model={model} />
      {model.error !== null && <Callout tone="danger">{model.error}</Callout>}
      {model.current !== null && (
        <Stack gap="sm">
          <Field label={SWATCH_EDITOR_TEXT.nameLabel}>
            <TextInput value={model.current.name} onChange={(event) => model.rename(event.target.value)} />
          </Field>
          <Text variant="label">{SWATCH_EDITOR_TEXT.colorsTitle}</Text>
          <Text variant="caption" tone="muted">
            {SWATCH_EDITOR_TEXT.colorsHint}
          </Text>
          <ColorGrid model={model} />
          <ColorDetail model={model} />
        </Stack>
      )}
    </Stack>
  );
};

export { SwatchSetEditor };
