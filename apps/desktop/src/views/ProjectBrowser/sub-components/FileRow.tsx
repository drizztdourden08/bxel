/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { rowCells } from '../../../project-browser/row-cells';
import { entryBoxProps } from '../behavior/entry-box-props';
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
  const ref = useRef<HTMLElement>(null);
  const handlers = useEntryHandlers(entry, ref);
  const over = useFolderDrop(ref, entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  const lit = handlers.selected || open;
  return (
    <>
      <Box
        ref={ref}
        className={rowClass({ column, lit, over })}
        data-selected={lit}
        {...entryBoxProps(handlers)}
      >
        <Box className="browser-row__name">
          <ThumbBox entry={entry} />
          <EntryName entry={entry} rename={handlers.renaming} />
          {!column && <EntryBadges entry={entry} />}
        </Box>
        {!column && <RowCells cells={rowCells(entry)} />}
        {entry.kind === 'folder' && <Icon className="browser-row__chevron" name="chevron-right" size={14} />}
      </Box>
      <EntryMenu point={handlers.point} groups={handlers.groups} label={label} onClose={handlers.closeMenu} />
    </>
  );
};

export { FileRow };
