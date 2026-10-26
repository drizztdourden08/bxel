/* @layer renderer-app @kind logic */
import { countColours } from './count-colours';
import type { OverviewPreview } from './asset-overview.type';

const colourCountOf = (preview: OverviewPreview): number => {
  if (preview.kind === 'frames') return countColours(preview.frames.map((frame) => frame.image));
  if (preview.kind === 'image') return countColours([preview.image]);
  return preview.kind === 'swatches' ? preview.colours.filter((colour) => !colour.transparent).length : 0;
};

export { colourCountOf };
