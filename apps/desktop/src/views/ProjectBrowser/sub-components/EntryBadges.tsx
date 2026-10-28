/* @layer renderer-app @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';

/** Small marks on a file: unsaved, open in a tab, pinned, and how many files use it. Each has a name for a screen reader. */
const EntryBadges = ({ entry }: { readonly entry: BrowserEntry }) => {
  if (entry.kind === 'folder') return null;
  const { row, facts, pinned } = entry;
  const users = facts.usedBy.length;
  if (!row.dirty && !facts.open && !pinned && users === 0) return null;
  return (
    <Box className="browser-badges">
      {row.dirty && <Icon className="browser-badges__unsaved" name="circle-dot" size="sm" aria-label={BROWSER_TEXT.unsavedBadge} />}
      {facts.open && <Icon name="panel-right" size="sm" aria-label={BROWSER_TEXT.openBadge} />}
      {pinned && <Icon name="pin" size="sm" aria-label={BROWSER_TEXT.pinnedBadge} />}
      {users > 0 && (
        <Text as="span" variant="caption" tone="muted" title={BROWSER_TEXT.usedBy(users)}>
          {`x${users}`}
        </Text>
      )}
    </Box>
  );
};

export { EntryBadges };
