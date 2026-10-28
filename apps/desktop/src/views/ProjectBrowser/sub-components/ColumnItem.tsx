/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import { useEntryHandlers } from '../behavior/useEntryHandlers';
import { useFolderDrop } from '../behavior/useFolderDrop';
import type { ColumnItemProps } from '../ProjectBrowser.type';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { ThumbBox } from './ThumbBox';

const ColumnItem = ({ entry, open }: ColumnItemProps) => {
  const handlers = useEntryHandlers(entry);
  const drop = useFolderDrop(entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  const lit = handlers.selected || open;
  return (
    <>
      <Box
        {...drop.handlers}
        className={`browser-row browser-row--column${lit ? ' browser-row--selected' : ''}${drop.over ? ' browser-row--drop' : ''}`}
        data-selected={lit}
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

export { ColumnItem };
