/* @layer renderer-app @kind component */
import { Button, EmptyState, Stack, Text, Tooltip } from '@drizztdourden08/tessera';
import { TRANSFORM_ACTIONS, TRANSFORM_PANEL_TEXT } from './TransformPanel.constants';
import { useSelectionNote } from './behavior/useSelectionNote';

const TransformPanel = () => {
  const note = useSelectionNote();
  if (note === null) return <EmptyState message={TRANSFORM_PANEL_TEXT.empty} />;
  return (
    <Stack gap="sm" role="group" aria-label={TRANSFORM_PANEL_TEXT.actions}>
      <Text variant="label">{TRANSFORM_PANEL_TEXT.title}</Text>
      <Text variant="caption" tone="muted">{note}</Text>
      {TRANSFORM_ACTIONS.map((action) => {
        const name = action.shortcut === null ? action.label : `${action.label} (${action.shortcut})`;
        return (
          <Tooltip key={action.id} content={name} placement="bottom">
            <Button variant="tertiary" size="sm" fullWidth onClick={action.run}>{action.label}</Button>
          </Tooltip>
        );
      })}
      <Text variant="caption" tone="muted">{TRANSFORM_PANEL_TEXT.note}</Text>
    </Stack>
  );
};

export { TransformPanel };
