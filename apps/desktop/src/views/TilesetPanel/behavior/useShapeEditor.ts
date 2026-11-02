/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { tileShapes } from '@bxel/document';
import type { Point, Size, TileShape } from '@bxel/document';
import { nearestPoint } from '../../../tilemap/collision/nearest-point';
import { rectOfCorners } from '../../../tilemap/collision/rect-of-corners';
import { snapTo } from '../../../tilemap/collision/snap-to';
import { tileCanvas } from '../../../tilemap/tile-canvas';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { ShapeDrag, ShapeEditorHandle, ShapeEditorProps } from '../TilesetPanel.type';
import { drawShapeEditor } from './draw-shape-editor';
import { editorZoom } from './editor-zoom';
import { finishShapeDrag } from './finish-shape-drag';
import { EDITOR_LOOK } from './thumb.constants';
import { deletePickedPoint } from './delete-picked-point';
import { deletePickedShape } from './delete-picked-shape';
import { nudgePicked } from './nudge-picked';
import { replaceShape } from './replace-shape';
import { NUDGE_KEYS } from './shape-editor.constants';

const previewOf = (drag: ShapeDrag | null, layer: string): TileShape | null => {
  const rect = drag?.kind === 'rect' ? rectOfCorners(drag.from, drag.to) : null;
  return rect ? { ...rect, layer } : null;
};

const useShapeEditor = ({ model, tile, sprite }: ShapeEditorProps): ShapeEditorHandle => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef<ShapeDrag | null>(null);
  const [, redrawNow] = useState(0);
  const layer = useTilesetViewStore((state) => state.collisionLayer);
  const index = useTilesetViewStore((state) => state.shapeIndex);
  const snap = useTilesetViewStore((state) => state.shapeSnap);
  const point = useTilesetViewStore((state) => state.pointIndex);
  const { tileset, artwork } = model;
  const size: Size = { width: tileset.tileWidth, height: tileset.tileHeight };
  const shapes = tileShapes(tile);
  const selected = Math.min(index, shapes.length - 1);
  const zoom = editorZoom(size);
  const paint = useCallback((): void => {
    if (canvas.current) {
      drawShapeEditor(canvas.current, { tile: tileCanvas(artwork, sprite), tileset, shapes, selected, zoom, preview: previewOf(drag.current, layer), point });
    }
  }, [artwork, sprite, tileset, shapes, selected, zoom, layer, point]);
  useEffect(paint, [paint]);
  const cornerOf = (event: PointerEvent<HTMLCanvasElement> | MouseEvent<HTMLCanvasElement>): Point => {
    const box = event.currentTarget.getBoundingClientRect();
    const at = (offset: number, total: number, tiles: number): number => snapTo((offset / total) * tiles, snap, tiles);
    return { x: at(event.clientX - box.left, box.width, size.width), y: at(event.clientY - box.top, box.height, size.height) };
  };
  const picked = shapes[selected];
  return {
    canvas,
    pointerDown: (event) => {
      const corner = cornerOf(event);
      const near = picked?.kind === 'polygon' ? nearestPoint(picked.points, corner, Math.max(1, Math.ceil(EDITOR_LOOK.reach / zoom))) : -1;
      drag.current = { kind: near >= 0 ? 'point' : 'rect', from: corner, to: corner, index: near };
      useTilesetViewStore.getState().setPointIndex(near >= 0 ? near : null);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    pointerMove: (event) => {
      if (!drag.current) return;
      drag.current = { ...drag.current, to: cornerOf(event) };
      paint();
      redrawNow((tick) => tick + 1);
    },
    pointerUp: () => {
      const done = drag.current;
      drag.current = null;
      if (done) finishShapeDrag(done, tile, selected, size);
      paint();
    },
    keyDown: (event: KeyboardEvent<HTMLCanvasElement>) => {
      const step = NUDGE_KEYS[event.key];
      const done = step ? nudgePicked(step[0], step[1], event.shiftKey) : false;
      const removed = event.key === 'Delete' || event.key === 'Backspace' ? (point === null ? deletePickedShape() : deletePickedPoint()) : false;
      if (step || done || removed) event.preventDefault();
    },
    doubleClick: (event) => {
      if (picked?.kind !== 'polygon') return;
      const corner = cornerOf(event);
      const near = nearestPoint(picked.points, corner, 1);
      if (near >= 0 && picked.points.length > 3) replaceShape(tile, selected, { ...picked, points: picked.points.filter((_point, at) => at !== near) });
      else if (near < 0) replaceShape(tile, selected, { ...picked, points: [...picked.points, corner] });
    },
  };
};

export { useShapeEditor };
