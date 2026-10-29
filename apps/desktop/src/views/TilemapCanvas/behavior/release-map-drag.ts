/* @layer renderer-app @kind logic */
import type { RefObject } from 'react';
import type { MapDrag, MapLive } from '../TilemapCanvas.type';

const releaseMapDrag = (live: RefObject<MapLive>, finish: (drag: MapDrag) => void): void => {
  const { drag } = live.current;
  live.current.drag = null;
  const taken = drag?.kind === 'capture' && (drag.from.x !== drag.to.x || drag.from.y !== drag.to.y);
  if (drag && (drag.kind !== 'capture' || taken)) finish(drag);
  live.current.captured = taken;
};

export { releaseMapDrag };
