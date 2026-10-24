/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { Point, SpriteId } from '@bxel/document';
import { bandIds } from '../../../sheet-manager/band-ids';
import { bandRect } from '../../../sheet-manager/band-rect';
import { selectIds } from '../../../sheet-manager/select-ids';
import { clearSpriteSelection } from '../../../sheet/clear-selection';
import { BAND_MIN } from '../SpritesPanel.constants';
import type { BandState } from '../SpritesPanel.type';
import { drawBand } from './draw-band';
import { localPoint } from './local-point';
import { tileBoxes } from './tile-boxes';

const useBandSelect = (picked: readonly SpriteId[]): BandState => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const origin = useRef<Point | null>(null);
  return {
    canvas,
    onPointerDown: (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (event.button !== 0 || !canvas.current || target?.closest('[data-sprite-id]')) return;
      canvas.current.width = event.currentTarget.clientWidth;
      canvas.current.height = event.currentTarget.clientHeight;
      origin.current = localPoint(event.currentTarget, event.clientX, event.clientY);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event) => {
      if (!origin.current || !canvas.current) return;
      drawBand(canvas.current, bandRect(origin.current, localPoint(event.currentTarget, event.clientX, event.clientY)));
    },
    onPointerUp: (event) => {
      const from = origin.current;
      origin.current = null;
      if (!from || !canvas.current) return;
      drawBand(canvas.current, null);
      const band = bandRect(from, localPoint(event.currentTarget, event.clientX, event.clientY));
      if (band.width < BAND_MIN && band.height < BAND_MIN) {
        clearSpriteSelection();
        return;
      }
      const hits = bandIds(tileBoxes(event.currentTarget), band);
      selectIds(event.ctrlKey || event.shiftKey ? [...new Set([...picked, ...hits])] : hits);
    },
  };
};

export { useBandSelect };
