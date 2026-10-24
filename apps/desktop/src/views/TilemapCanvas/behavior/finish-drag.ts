/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { rectPlace } from '../../../tilemap/rect-place';
import { readCell } from '../../../tilemap/read-cell';
import { strokeErase } from '../../../tilemap/stroke-erase';
import { strokePlace } from '../../../tilemap/stroke-place';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { MapDrag } from '../TilemapCanvas.type';
import { spanRect } from './span-rect';

const finishDrag = (drag: MapDrag, target: MapTarget): void => {
  if (drag.kind === 'stroke') {
    if (drag.tool === 'place') strokePlace(drag.cells);
    else strokeErase(drag.cells);
  } else if (drag.kind === 'rect') {
    rectPlace(spanRect(drag.from, drag.to));
  } else {
    const from = readCell(target.tilemap, target.layer, drag.from)?.key ?? 0;
    useTilemapStore.getState().setSelection({ rect: spanRect(drag.from, drag.to), from });
  }
};

export { finishDrag };
