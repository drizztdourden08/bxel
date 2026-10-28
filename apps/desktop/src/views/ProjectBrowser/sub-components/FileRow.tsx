/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import { rowCells } from '../../../project-browser/row-cells';
import { rowClass } from '../behavior/row-class';
import { useEntryHandlers } from '../behavior/useEntryHandlers';
import { useFolderDrop } from '../behavior/useFolderDrop';
import type { RowProps } from '../ProjectBrowser.type';
import { EntryBadges } from './EntryBadges';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { RowCells } from './RowCells';
import { ThumbBox } from './ThumbBox';

const FileRow = ({ entry, column = false, open = false }: RowProps) => {
  const handlers = useEntryHandlers(entry);
  const drop = useFolderDrop(entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  const lit = handlers.selected || open;
  return (
    <>
      <Box
        {...drop.handlers}
        className={rowClass({ column, lit, over: drop.over })}
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
          {!column && <EntryBadges entry={entry} />}
        </Box>
        {!column && <RowCells cells={rowCells(entry)} />}
        {entry.kind === 'folder' && <Icon className="browser-row__chevron" name="chevron-right" size="sm" />}
      </Box>
      <EntryMenu point={handlers.point} groups={handlers.groups} label={label} onClose={handlers.closeMenu} />
    </>
  );
};

export { FileRow };
