/* @layer renderer-app @kind component */
import { Button, Callout, EmptyState, Icon, ListItemList, ListItemRow, Stack, Text } from '@drizztdourden08/tessera';
import { formatSize } from '../../../project/format-size';
import { PANEL_TEXT } from '../../../project/project.constants';
import type { PanelPartProps } from '../ProjectPanel.type';
import { EntryMenu } from './EntryMenu';

const EntryList = ({ model }: PanelPartProps) => {
  if (model.folder && !model.folder.granted) {
    return (
      <EmptyState
        message={PANEL_TEXT.notGranted}
        action={
          <Button variant="secondary" size="sm" onClick={model.grantFolder}>
            {PANEL_TEXT.grant}
          </Button>
        }
      />
    );
  }
  if (model.error !== null) return <Callout tone="danger">{model.error}</Callout>;
  const { listing } = model;
  if (listing === null) return null;
  const needle = model.search.trim().toLowerCase();
  const entries = listing.entries.filter((entry) => entry.name.toLowerCase().includes(needle));
  if (entries.length === 0) return <EmptyState message={PANEL_TEXT.empty} />;
  return (
    <Stack gap="xs">
      <ListItemList label={PANEL_TEXT.filesLabel}>
        {entries.map((entry) => (
          <ListItemRow
            key={entry.name}
            icon={<Icon name={entry.kind === 'folder' ? 'folder' : 'file'} />}
            name={entry.name}
            meta={entry.kind === 'folder' ? undefined : formatSize(entry.bytes)}
            selected={model.selected === entry.name}
            action={<EntryMenu model={model} entry={entry} />}
            actionVisibility="always"
            onClick={() => (entry.kind === 'folder' ? model.openEntry(entry) : model.select(entry.name))}
            onDoubleClick={() => model.openEntry(entry)}
          />
        ))}
      </ListItemList>
      {listing.skipped > 0 && (
        <Text variant="caption" tone="muted">
          {PANEL_TEXT.skipped(listing.skipped)}
        </Text>
      )}
    </Stack>
  );
};

export { EntryList };
