/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import { rowCells } from '../../../project-browser/row-cells';
import { entryBoxProps } from '../behavior/entry-box-props';
import { useEntryBox } from '../behavior/useEntryBox';
import { rowClass } from '../behavior/row-class';
import type { RowProps } from '../ProjectBrowser.type';
import { EntryBadges } from './EntryBadges';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { RowCells } from './RowCells';
import { ThumbBox } from './ThumbBox';

const FileRow = ({ entry, column = false, open = false }: RowProps) => {
  const { ref, handlers, over, label } = useEntryBox(entry);
  const lit = handlers.selected || open;
  return (
    <>
      <Box
        ref={ref}
        className={rowClass({ column, lit, over })}
        data-selected={lit}
        {...entryBoxProps(handlers, column)}
      >
        <Box className="browser-row__name">
          <ThumbBox entry={entry} />
          <EntryName entry={entry} rename={handlers.renaming} />
          {!column && <EntryBadges entry={entry} />}
        </Box>
        {!column && <RowCells cells={rowCells(entry)} />}
        {entry.kind === 'folder' && !column && <Icon className="browser-row__chevron" name="chevron-right" size={14} />}
      </Box>
      <EntryMenu point={handlers.point} groups={handlers.groups} label={label} onClose={handlers.closeMenu} />
    </>
  );
};

export { FileRow };
