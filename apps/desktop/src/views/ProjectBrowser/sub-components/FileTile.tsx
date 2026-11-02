/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { entryBoxProps } from '../behavior/entry-box-props';
import { useEntryBox } from '../behavior/useEntryBox';
import type { TileProps } from '../ProjectBrowser.type';
import { EntryBadges } from './EntryBadges';
import { EntryMenu } from './EntryMenu';
import { EntryName } from './EntryName';
import { ThumbBox } from './ThumbBox';

const FileTile = ({ entry, cell }: TileProps) => {
  const { ref, handlers, over, label } = useEntryBox(entry);
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
