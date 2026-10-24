/* @layer renderer-app @kind component */
import { Button, ColorSwatch, Flex, Grid, Span, Stack, Text } from '@drizztdourden08/tessera';
import { SNAP_PREVIEW_LIMIT, SNAP_TEXT } from '../../../platform-preset/snap-platform.constants';
import type { SnapRowModel } from '../AssetControl.type';

const SnapPreview = ({ row }: { row: SnapRowModel }) => {
  const shown = row.changes.slice(0, SNAP_PREVIEW_LIMIT);
  return (
    <Stack gap="xs" aria-live="polite">
      <Text variant="label">{SNAP_TEXT.title}</Text>
      <Text variant="caption" tone="muted">
        {SNAP_TEXT.summary(row.changes.length, row.banks)}
      </Text>
      <Grid columns={2} gap="xs">
        {shown.map((change) => (
          <Flex key={change.swatchId} gap="2xs" align="center" role="group" aria-label={SNAP_TEXT.pair(change.bankName, change.index, change.before, change.after)}>
            <ColorSwatch size="sm" color={change.before} disabled tabIndex={-1} aria-label={`${SNAP_TEXT.before} ${change.before}`} />
            <Span>to</Span>
            <ColorSwatch size="sm" color={change.after} disabled tabIndex={-1} aria-label={`${SNAP_TEXT.after} ${change.after}`} />
          </Flex>
        ))}
      </Grid>
      {row.changes.length > shown.length && (
        <Text variant="caption" tone="muted">
          {SNAP_TEXT.more(row.changes.length - shown.length)}
        </Text>
      )}
      <Flex gap="xs" wrap>
        <Button size="sm" onClick={row.apply}>
          {SNAP_TEXT.apply}
        </Button>
        <Button size="sm" variant="secondary" onClick={row.cancel}>
          {SNAP_TEXT.cancel}
        </Button>
      </Flex>
    </Stack>
  );
};

export { SnapPreview };
