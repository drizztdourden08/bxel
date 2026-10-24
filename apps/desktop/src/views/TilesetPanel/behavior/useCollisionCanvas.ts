/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import type { Point, Size } from '@bxel/document';
import { COLLISION_VIEW } from '../../../tilemap/collision/collision.constants';
import type { CollisionDrag } from '../../../tilemap/collision/collision.type';
import { collisionCorner } from '../../../tilemap/collision/collision-corner';
import { collisionScale } from '../../../tilemap/collision/collision-scale';
import { nearestPoint } from '../../../tilemap/collision/nearest-point';
import { previewShape } from '../../../tilemap/collision/preview-shape';
import { setCollision } from '../../../tilemap/set-collision';
import { tileCanvas } from '../../../tilemap/tile-canvas';
import type { CollisionCanvasHandle, CollisionProps } from '../TilesetPanel.type';
import { commitDrag } from './commit-drag';
import { paintCollisionEditor } from './paint-collision-editor';

const useCollisionCanvas = ({ artwork, tileset, tile, sprite }: CollisionProps): CollisionCanvasHandle => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef<CollisionDrag | null>(null);
  const size: Size = { width: tileset.tileWidth, height: tileset.tileHeight };
  const scale = collisionScale(size);
  const { collision, key } = tile;
  const redraw = useCallback((): void => {
    const element = canvas.current;
    if (!element) return;
    const colour = element.ownerDocument.defaultView?.getComputedStyle(element).getPropertyValue('--c-danger').trim() ?? '';
    paintCollisionEditor(element, { tile: tileCanvas(artwork, sprite), size: { width: tileset.tileWidth, height: tileset.tileHeight }, scale, shape: previewShape(collision, drag.current), colour });
  }, [artwork, sprite, tileset.tileWidth, tileset.tileHeight, scale, collision]);
  useEffect(redraw, [redraw]);
  const cornerOf = (event: PointerEvent<HTMLCanvasElement> | MouseEvent<HTMLCanvasElement>): Point => {
    const box = event.currentTarget.getBoundingClientRect();
    return collisionCorner({ x: event.clientX - box.left - COLLISION_VIEW.margin, y: event.clientY - box.top - COLLISION_VIEW.margin }, scale, size);
  };
  const reach = Math.max(1, Math.ceil(COLLISION_VIEW.reach / scale));
  return {
    canvas,
    pointerDown: (event) => {
      const corner = cornerOf(event);
      if (collision?.kind === 'polygon') {
        const index = nearestPoint(collision.points, corner, reach);
        if (index < 0) {
          setCollision(key, { kind: 'polygon', points: [...collision.points, corner] });
          return;
        }
        drag.current = { kind: 'point', from: corner, to: corner, index };
      } else if (collision?.kind === 'rect' || collision?.kind === 'full') {
        drag.current = { kind: 'rect', from: corner, to: corner, index: -1 };
      } else return;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    pointerMove: (event) => {
      if (!drag.current) return;
      drag.current = { ...drag.current, to: cornerOf(event) };
      redraw();
    },
    pointerUp: () => {
      const done = drag.current;
      drag.current = null;
      if (done) commitDrag(done, tile);
      redraw();
    },
    doubleClick: (event) => {
      if (collision?.kind !== 'polygon' || collision.points.length <= 3) return;
      const index = nearestPoint(collision.points, cornerOf(event), reach);
      if (index >= 0) setCollision(key, { kind: 'polygon', points: collision.points.filter((_, at) => at !== index) });
    },
  };
};

export { useCollisionCanvas };
