/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { PREVIEW_ROWS } from '../ManagerDialogs.constants';
import type { RenamePreviewProps } from '../ManagerDialogs.type';

const RenamePreview = ({ plan }: RenamePreviewProps) => {
  const bad = plan.entries.filter((entry) => entry.error !== null);
  const changed = plan.entries.filter((entry) => entry.from !== entry.to);
  return (
    <Stack gap="2xs" aria-live="polite">
      <Text variant="label">{DIALOG_TEXT.preview}</Text>
      {changed.length === 0 && <Text tone="dim">{DIALOG_TEXT.nothing}</Text>}
      {changed.slice(0, PREVIEW_ROWS).map((entry) => (
        <Text key={entry.id} variant="caption" tone={entry.error ? 'danger' : undefined}>
          {entry.error ?? DIALOG_TEXT.previewRow(entry.from, entry.to)}
        </Text>
      ))}
      {changed.length > PREVIEW_ROWS && <Text variant="caption" tone="dim">{`+ ${changed.length - PREVIEW_ROWS}`}</Text>}
      {bad.length > 0 && <Callout tone="danger">{DIALOG_TEXT.clash(bad.length)}</Callout>}
    </Stack>
  );
};

export { RenamePreview };
