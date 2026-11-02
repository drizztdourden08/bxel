/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { entryBoxProps } from '../behavior/entry-box-props';
import { useEntryHandlers } from '../behavior/useEntryHandlers';
import { useFolderDrop } from '../behavior/useFolderDrop';
import type { TileProps } from '../ProjectBrowser.type';
import { EntryBadges } from './EntryBadges';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { ThumbBox } from './ThumbBox';

const FileTile = ({ entry, cell }: TileProps) => {
  const ref = useRef<HTMLElement>(null);
  const handlers = useEntryHandlers(entry, ref);
  const over = useFolderDrop(ref, entry.kind === 'folder' ? entry.path : null);
  const label = entry.kind === 'folder' ? entry.name : entry.row.name;
  return (
    <>
      <Box
        ref={ref}
        {...cell}
        className={`${cell.className} browser-tile${handlers.selected ? ' browser-tile--selected' : ''}${over ? ' browser-tile--drop' : ''}`}
        aria-label={label}
        aria-selected={handlers.selected}
        {...entryBoxProps(handlers)}
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
