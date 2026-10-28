/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { FolderEntry } from '../../../project-browser/project-browser.type';
import { ThumbBox } from './ThumbBox';

const FolderPreview = ({ entry }: { readonly entry: FolderEntry }) => (
  <Box className="browser-preview__many">
    <ThumbBox entry={entry} />
    <Text as="h3" variant="subtitle">
      {entry.name}
    </Text>
    <Text as="span" variant="caption" tone="muted">
      {BROWSER_TEXT.statusFiles(entry.count)}
    </Text>
  </Box>
);

export { FolderPreview };
