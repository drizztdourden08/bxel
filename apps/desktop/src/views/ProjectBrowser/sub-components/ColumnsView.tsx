/* @layer renderer-app @kind component */
import { Box, Icon, Text, VirtualList } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from '../behavior/browser-context';
import { useEntryHandlers } from '../behavior/useEntryHandlers';
import { useFolderDrop } from '../behavior/useFolderDrop';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { ThumbBox } from './FileThumb';

const ColumnItem = ({ entry, open }: { readonly entry: BrowserEntry; readonly open: boolean }) => {
  const handlers = useEntryHandlers(entry);
  const drop = useFolderDrop(entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  return (
    <>
      <Box
        {...drop.handlers}
        className={`browser-row browser-row--column${handlers.selected || open ? ' browser-row--selected' : ''}${drop.over ? ' browser-row--drop' : ''}`}
        data-selected={handlers.selected || open}
        draggable={!handlers.renaming}
        onClick={handlers.onClick}
        onDoubleClick={handlers.onDoubleClick}
        onContextMenu={handlers.onContextMenu}
        onDragStart={handlers.onDragStart}
      >
        <Box className="browser-row__name">
          <ThumbBox entry={entry} />
          <EntryName entry={entry} rename={handlers.renaming} />
        </Box>
        {entry.kind === 'folder' && <Icon className="browser-row__chevron" name="chevron-right" size="sm" />}
      </Box>
      <EntryMenu point={handlers.point} groups={handlers.groups} label={label} onClose={handlers.closeMenu} />
    </>
  );
};

/** One column per folder level, from the root of the project to the folder shown. The preview pane is the last column. */
const ColumnsView = () => {
  const { model } = useBrowserContext();
  const trail = useMemo(() => model.crumbs.map((crumb) => crumb.path), [model.crumbs]);
  return (
    <Box className="browser-columns" role="group" aria-label={BROWSER_TEXT.columnsLabel}>
      {trail.map((path, level) => {
        const next = trail[level + 1] ?? null;
        const entries = path === model.folder ? model.entries : model.entriesIn(path);
        return (
          <Box key={path ?? 'project'} className="browser-columns__column">
            {entries.length === 0 ? (
              <Text as="span" variant="caption" tone="muted">
                {BROWSER_TEXT.emptyFolderTitle}
              </Text>
            ) : (
              <VirtualList
                label={`${BROWSER_TEXT.folders} ${level + 1}`}
                items={entries}
                getKey={(entry) => entry.id}
                rowSize="compact"
                renderItem={(entry) => <ColumnItem entry={entry} open={entry.kind === 'folder' && next !== null && entry.path.toLowerCase() === next.toLowerCase()} />}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export { ColumnsView };
