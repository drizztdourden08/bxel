/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { useEntryHandlers } from '../behavior/useEntryHandlers';
import { useFolderDrop } from '../behavior/useFolderDrop';
import type { TileProps } from '../ProjectBrowser.type';
import { EntryBadges } from './EntryBadges';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { ThumbBox } from './ThumbBox';

const FileTile = ({ entry, cell }: TileProps) => {
  const handlers = useEntryHandlers(entry);
  const drop = useFolderDrop(entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  return (
    <>
      <Box
        {...cell}
        {...drop.handlers}
        className={`${cell.className} browser-tile${handlers.selected ? ' browser-tile--selected' : ''}${drop.over ? ' browser-tile--drop' : ''}`}
        aria-label={label}
        aria-selected={handlers.selected}
        draggable={!handlers.renaming}
        onClick={handlers.onClick}
        onDoubleClick={handlers.onDoubleClick}
        onContextMenu={handlers.onContextMenu}
        onDragStart={handlers.onDragStart}
      >
        <ThumbBox entry={entry} />
        <EntryBadges entry={entry} />
        <EntryName entry={entry} rename={handlers.renaming} />
      </Box>
      <EntryMenu point={handlers.point} groups={handlers.groups} label={label} onClose={handlers.closeMenu} />
    </>
  );
};

export { FileTile };
