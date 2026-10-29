/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { Size, Tile } from '@bxel/document';
import { rectOfCorners } from '../../../tilemap/collision/rect-of-corners';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { ShapeDrag } from '../TilesetPanel.type';
import { addShape } from './add-shape';
import { hitShape } from './hit-shape';
import { replaceShape } from './replace-shape';

const moved = (drag: ShapeDrag): boolean => drag.from.x !== drag.to.x || drag.from.y !== drag.to.y;

const finishShapeDrag = (drag: ShapeDrag, tile: Tile, selected: number, size: Size): void => {
  const shapes = tileShapes(tile);
  const picked = shapes[selected];
  if (drag.kind === 'point') {
    if (picked?.kind === 'polygon' && moved(drag)) replaceShape(tile, selected, { ...picked, points: picked.points.map((point, at) => (at === drag.index ? drag.to : point)) });
    return;
  }
  const rect = rectOfCorners(drag.from, drag.to);
  if (rect) addShape(tile, rect);
  else useTilesetViewStore.getState().setShapeIndex(Math.max(0, hitShape(shapes, drag.to, size)));
};

export { finishShapeDrag };
