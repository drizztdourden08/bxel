/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { PREVIEW_PANE_LABEL } from './PreviewSplit.constants';
import type { PreviewSplitProps } from './PreviewSplit.type';
import './PreviewSplit.css';

const PreviewSplit = ({ main, preview }: PreviewSplitProps) => (
  <Box className="preview-split">
    <Box className="preview-split__body">
      <Box className="preview-split__main">{main}</Box>
      <Box as="aside" aria-label={PREVIEW_PANE_LABEL} className="preview-split__preview">
        {preview}
      </Box>
    </Box>
  </Box>
);

export { PreviewSplit };
