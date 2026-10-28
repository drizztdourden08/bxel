/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import type { EntryProps } from '../ProjectBrowser.type';
import { FileThumb } from './FileThumb';

const ThumbBox = ({ entry }: EntryProps) => (
  <Box className="browser-thumb">
    <FileThumb entry={entry} />
  </Box>
);

export { ThumbBox };
