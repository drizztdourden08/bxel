/* @layer renderer-app @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera';
import { KIND_LABEL } from '../../../asset-list/asset-list.constants';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useEntryHandlers } from '../behavior/useEntryHandlers';
import { useFolderDrop } from '../behavior/useFolderDrop';
import type { EntryProps } from '../ProjectBrowser.type';
import { EntryBadges } from './EntryBadges';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { ThumbBox } from './FileThumb';

const when = (ms: number): string => (ms === 0 ? '' : new Date(ms).toLocaleDateString());

/** One row of the table: a small picture and the name, then the columns of facts. */
const FileRow = ({ entry }: EntryProps) => {
  const handlers = useEntryHandlers(entry);
  const drop = useFolderDrop(entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  const file = entry.kind === 'file' ? entry : null;
  const facts = file?.facts;
  return (
    <>
      <Box
        {...drop.handlers}
        className={`browser-row${handlers.selected ? ' browser-row--selected' : ''}${drop.over ? ' browser-row--drop' : ''}`}
        data-selected={handlers.selected}
        draggable={!handlers.renaming}
        onClick={handlers.onClick}
        onDoubleClick={handlers.onDoubleClick}
        onContextMenu={handlers.onContextMenu}
        onDragStart={handlers.onDragStart}
      >
        <Box className="browser-row__name">
          <ThumbBox entry={entry} />
          <EntryName entry={entry} rename={handlers.renaming} />
          <EntryBadges entry={entry} />
        </Box>
        <Text as="span" variant="caption" tone="muted" className="browser-row__cell">
          {file ? KIND_LABEL[file.row.kind] : BROWSER_TEXT.folderCount(entry.kind === 'folder' ? entry.count : 0)}
        </Text>
        <Text as="span" variant="caption" tone="muted" className="browser-row__cell browser-row__cell--size">
          {facts && facts.width !== null && facts.height !== null ? BROWSER_TEXT.pixels(facts.width, facts.height) : ''}
        </Text>
        <Text as="span" variant="caption" tone="muted" className="browser-row__cell browser-row__cell--frames">
          {facts?.frames ?? ''}
        </Text>
        <Text as="span" variant="caption" tone="muted" className="browser-row__cell browser-row__cell--palette">
          {facts?.palette ?? ''}
        </Text>
        <Text as="span" variant="caption" tone="muted" className="browser-row__cell browser-row__cell--folder">
          {file?.row.folder ?? ''}
        </Text>
        <Text as="span" variant="caption" tone="muted" className="browser-row__cell browser-row__cell--modified">
          {file ? when(file.row.modified) : ''}
        </Text>
        <Text as="span" variant="caption" tone="muted" className="browser-row__cell browser-row__cell--users">
          {facts && facts.usedBy.length > 0 ? facts.usedBy.length : ''}
        </Text>
        {entry.kind === 'folder' && <Icon className="browser-row__chevron" name="chevron-right" size="sm" />}
      </Box>
      <EntryMenu point={handlers.point} groups={handlers.groups} label={label} onClose={handlers.closeMenu} />
    </>
  );
};

export { FileRow };
