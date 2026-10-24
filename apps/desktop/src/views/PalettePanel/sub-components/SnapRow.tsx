/* @layer renderer-app @kind component */
import { Button, Stack, Text } from '@drizztdourden08/tessera';
import { SNAP_TEXT } from '../../../platform-preset/snap-platform.constants';
import { useSnapRow } from '../behavior/useSnapRow';
import { SnapPreview } from './SnapPreview';

const SnapRow = () => {
  const row = useSnapRow();
  if (row.open) return <SnapPreview row={row} />;
  const nothing = row.changes.length === 0;
  return (
    <Stack gap="2xs">
      <Button size="sm" variant="secondary" disabled={nothing} onClick={row.begin}>
        {SNAP_TEXT.action}
      </Button>
      {nothing && (
        <Text variant="caption" tone="muted">
          {SNAP_TEXT.nothing}
        </Text>
      )}
    </Stack>
  );
};

export { SnapRow };
