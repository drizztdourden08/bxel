/* @layer renderer-app @kind logic */
import { linePlace } from '../../../tilemap/line-place';
import { moveCells } from '../../../tilemap/move-cells';
import { rectPlace } from '../../../tilemap/rect-place';
import { scatterPlace } from '../../../tilemap/scatter-place';
import { strokeErase } from '../../../tilemap/stroke-erase';
import { strokePlace } from '../../../tilemap/stroke-place';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { MapDrag } from '../TilemapCanvas.type';
import { capturePick } from './capture-pick';
import { selectDragged } from './select-dragged';
import { spanRect } from './span-rect';

const finishDrag = (drag: MapDrag, target: MapTarget): void => {
  if (drag.kind === 'stroke') {
    if (drag.tool === 'place') strokePlace(drag.cells);
    else if (drag.tool === 'scatter') scatterPlace(drag.cells);
    else strokeErase(drag.cells);
  } else if (drag.kind === 'line') {
    linePlace(drag.from, drag.to);
  } else if (drag.kind === 'rect') {
    rectPlace(spanRect(drag.from, drag.to));
  } else if (drag.kind === 'pick' || drag.kind === 'capture') {
    capturePick(drag.from, drag.to);
  } else if (drag.kind === 'move') {
    moveCells({ x: drag.to.x - drag.from.x, y: drag.to.y - drag.from.y }, drag.copy);
  } else {
    selectDragged(drag, target);
  }
};

export { finishDrag };
