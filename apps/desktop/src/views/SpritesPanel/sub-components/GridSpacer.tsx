/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { spacerBlocks } from '../../../sheet-manager/spacer-blocks';
import type { GridSpacerProps } from '../SpritesPanel.type';

const GridSpacer = ({ at, rows }: GridSpacerProps) => (
  <>
    {spacerBlocks(at, rows).map((block) => (
      <Box key={block.at} aria-hidden="true" className="sprites-panel__vspace" data-rows={block.size} />
    ))}
  </>
);

export { GridSpacer };
