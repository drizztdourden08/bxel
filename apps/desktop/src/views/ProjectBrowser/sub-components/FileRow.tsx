/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import { rowCells } from '../../../project-browser/row-cells';
import { useEntryHandlers } from '../behavior/useEntryHandlers';
import { useFolderDrop } from '../behavior/useFolderDrop';
import type { EntryProps } from '../ProjectBrowser.type';
import { EntryBadges } from './EntryBadges';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { RowCellText } from './RowCellText';
import { ThumbBox } from './ThumbBox';

const FileRow = ({ entry }: EntryProps) => {
  const handlers = useEntryHandlers(entry);
  const drop = useFolderDrop(entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  const cells = rowCells(entry);
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
        <RowCellText value={cells.kind} />
        <RowCellText value={cells.size} suffix="size" />
        <RowCellText value={cells.frames} suffix="frames" />
        <RowCellText value={cells.palette} suffix="palette" />
        <RowCellText value={cells.folder} suffix="folder" />
        <RowCellText value={cells.modified} suffix="modified" />
        <RowCellText value={cells.users} suffix="users" />
        {entry.kind === 'folder' && <Icon className="browser-row__chevron" name="chevron-right" size="sm" />}
      </Box>
      <EntryMenu point={handlers.point} groups={handlers.groups} label={label} onClose={handlers.closeMenu} />
    </>
  );
};

export { FileRow };
