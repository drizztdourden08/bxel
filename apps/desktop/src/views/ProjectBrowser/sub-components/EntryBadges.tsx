/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import type { EntryProps } from '../ProjectBrowser.type';
import { UsedByMark } from './UsedByMark';

const hasMarks = (entry: FileEntry): boolean => entry.row.dirty || entry.facts.open || entry.pinned || entry.facts.usedBy.length > 0;

const EntryBadges = ({ entry }: EntryProps) => {
  if (entry.kind === 'folder' || !hasMarks(entry)) return null;
  return (
    <Box className="browser-badges">
      {entry.row.dirty && <Icon className="browser-badges__unsaved" name="circle-dot" size={14} aria-label={BROWSER_TEXT.unsavedBadge} />}
      {entry.facts.open && <Icon name="panel-right" size={14} aria-label={BROWSER_TEXT.openBadge} />}
      {entry.pinned && <Icon name="pin" size={14} aria-label={BROWSER_TEXT.pinnedBadge} />}
      {entry.facts.usedBy.length > 0 && <UsedByMark users={entry.facts.usedBy.length} />}
    </Box>
  );
};

export { EntryBadges };
