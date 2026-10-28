/* @layer renderer-app @kind component */
import { Box, Button, Center, EmptyState } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../EntryBrowser.constants';
import type { EntryBrowserContentProps } from '../EntryBrowser.type';
import { EntryGrid } from './EntryGrid';
import { EntryRows } from './EntryRows';

const EntryBrowserContent = ({ total, view, body, emptyMessage, noMatchMessage, onClear }: EntryBrowserContentProps) => (
  <Box className="entry-browser__body">
    {total === 0 && (
      <Center direction="column">
        <EmptyState size="sm" message={emptyMessage} />
      </Center>
    )}
    {total > 0 && body.shown.length === 0 && (
      <Center direction="column">
        <EmptyState size="sm" message={noMatchMessage ?? BROWSER_TEXT.noMatch} />
        <Button size="xs" variant="ghost" onClick={onClear}>
          {BROWSER_TEXT.clear}
        </Button>
      </Center>
    )}
    {body.shown.length > 0 && (view === 'grid' ? <EntryGrid {...body} /> : <EntryRows {...body} />)}
  </Box>
);

export { EntryBrowserContent };
