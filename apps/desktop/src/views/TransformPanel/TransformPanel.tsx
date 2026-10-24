/* @layer renderer-app @kind component */
import { Button, EmptyState, Stack, Text } from '@drizztdourden08/tessera';
import { ActionHint } from '../ActionHint';
import { TRANSFORM_ACTIONS, TRANSFORM_PANEL_TEXT } from './TransformPanel.constants';
import { useSelectionNote } from './behavior/useSelectionNote';

const TransformPanel = () => {
  const note = useSelectionNote();
  if (note === null) return <EmptyState message={TRANSFORM_PANEL_TEXT.empty} />;
  return (
    <Stack gap="sm" role="group" aria-label={TRANSFORM_PANEL_TEXT.actions}>
      <Text variant="label">{TRANSFORM_PANEL_TEXT.title}</Text>
      <Text variant="caption" tone="muted">{note}</Text>
      {TRANSFORM_ACTIONS.map((action) => (
        <ActionHint key={action.id} hint={action.hint}>
          <Button variant="tertiary" size="sm" fullWidth onClick={action.run}>{action.hint.name}</Button>
        </ActionHint>
      ))}
      <Text variant="caption" tone="muted">{TRANSFORM_PANEL_TEXT.note}</Text>
    </Stack>
  );
};

export { TransformPanel };
