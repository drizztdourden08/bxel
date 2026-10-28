/* @layer renderer-app @kind logic */
import type { CanvasLook } from '../../../canvas-look/canvas-look.type';
import type { ViewToggle } from '../../../stores/view-store.type';
import type { LineSwatchProps } from '../ViewPanel.type';

const swatchOf = (toggle: ViewToggle, look: CanvasLook): LineSwatchProps | undefined => {
  if (toggle === 'grid') return { colour: look.pixelLine.colour, opacity: look.pixelLine.opacity, gap: 1, label: 'Pixel grid line' };
  if (toggle === 'gridMajor') return { colour: look.majorLine.colour, opacity: look.majorLine.opacity, gap: 2, label: 'Major grid line' };
  if (toggle === 'gridTile') return { colour: look.tileLine.colour, opacity: look.tileLine.opacity, gap: 4, label: 'Tile grid line' };
  return undefined;
};

export { swatchOf };
