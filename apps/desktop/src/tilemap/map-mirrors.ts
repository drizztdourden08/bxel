/* @layer renderer-app @kind logic */
import type { CellFlags, Point, Rect, Tilemap } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';

type MapMirror = {
  readonly point: (cell: Point) => Point;
  readonly rect: (area: Rect) => Rect;
  readonly flags: (flags: CellFlags) => CellFlags;
};

const mapMirrors = (tilemap: Tilemap): MapMirror[] => {
  const { symmetryX, symmetryY } = useToolStore.getState();
  const make = (flipX: boolean, flipY: boolean): MapMirror => ({
    point: (cell) => ({ x: flipX ? tilemap.columns - 1 - cell.x : cell.x, y: flipY ? tilemap.rows - 1 - cell.y : cell.y }),
    rect: (area) => ({
      x: flipX ? tilemap.columns - area.x - area.width : area.x,
      y: flipY ? tilemap.rows - area.y - area.height : area.y,
      width: area.width,
      height: area.height,
    }),
    flags: (flags) => ({ ...flags, flipX: flipX ? !flags.flipX : flags.flipX, flipY: flipY ? !flags.flipY : flags.flipY }),
  });
  return [...(symmetryX ? [make(true, false)] : []), ...(symmetryY ? [make(false, true)] : []), ...(symmetryX && symmetryY ? [make(true, true)] : [])];
};

export { mapMirrors };
export type { MapMirror };
