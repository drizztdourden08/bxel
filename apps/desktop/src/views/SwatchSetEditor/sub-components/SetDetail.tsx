/* @layer renderer-app @kind component */
import { Button, Field, PanelContainer, Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { SetBarProps } from '../SwatchSetEditor.type';
import { ColorDetail } from './ColorDetail';
import { ColorGrid } from './ColorGrid';

const SetDetail = ({ model }: SetBarProps) => {
  const current = model.current;
  if (current === null) return null;
  return (
    <PanelContainer title={SWATCH_EDITOR_TEXT.detailTitle(current.name)} level={3}>
      <Stack gap="md">
        <Field label={SWATCH_EDITOR_TEXT.nameLabel}>
          <TextInput value={current.name} onChange={(event) => model.rename(event.target.value)} />
        </Field>
        <Stack gap="xs">
          <Text variant="label">{SWATCH_EDITOR_TEXT.colorsTitle}</Text>
          <Text variant="caption" tone="muted">
            {SWATCH_EDITOR_TEXT.colorsHint}
          </Text>
          <ColorGrid model={model} />
        </Stack>
        <ColorDetail model={model} />
        {model.hasProject && (
          <Field hint={SWATCH_EDITOR_TEXT.toProjectHint}>
            <Button size="sm" variant="secondary" onClick={model.copyToProject}>
              {SWATCH_EDITOR_TEXT.toProject}
            </Button>
          </Field>
        )}
      </Stack>
    </PanelContainer>
  );
};

export { SetDetail };
