/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { BrowserEntry, FileEntry } from '../../../project-browser/project-browser.type';
import { summaryOf } from '../../../project-browser/summary-of';
import { ThumbBox } from './ThumbBox';

const ManyPreview = ({ entries }: { readonly entries: readonly BrowserEntry[] }) => (
  <Box className="browser-preview__many">
    <Box className="browser-preview__stack">
      {entries.slice(0, 4).map((entry) => (
        <ThumbBox key={entry.id} entry={entry} />
      ))}
    </Box>
    <Text as="h3" variant="subtitle">
      {BROWSER_TEXT.selectedMany(entries.length)}
    </Text>
    <Text as="span" variant="caption" tone="muted">
      {summaryOf(entries.filter((entry): entry is FileEntry => entry.kind === 'file'))}
    </Text>
  </Box>
);

export { ManyPreview };
