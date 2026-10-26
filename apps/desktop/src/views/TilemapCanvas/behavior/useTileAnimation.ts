/* @layer renderer-app @kind hook */
import { useEffect, useMemo } from 'react';
import type { RefObject } from 'react';
import { findBank } from '@bxel/document';
import { bankRgba } from '../../../export/bank-rgba';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { createAnimator } from '../../../tile-animation/create-animator';
import { subscribeTileClock } from '../../../tile-animation/tile-clock';
import { tilePlan } from '../../../tile-animation/tile-plan';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { MapLive, MapView } from '../TilemapCanvas.type';

const useTileAnimation = (view: MapView, live: RefObject<MapLive>, viewport: RefObject<PixelViewportHandle | null>): void => {
  const animate = useTilemapStore((state) => state.animateTiles);
  const { target, image } = view;
  const { artwork, tilemap } = target;
  const plan = useMemo(() => tilePlan(artwork, tilemap), [artwork, tilemap]);
  useEffect(() => {
    const bank = findBank(artwork, target.tileset.bankId);
    if (!animate || plan.cells.length === 0 || !bank) return undefined;
    const animator = createAnimator(plan, image, bankRgba(bank));
    const stop = subscribeTileClock((now) => {
      if (live.current.drag === null && animator.advance(now)) viewport.current?.redraw();
    });
    return () => {
      stop();
      animator.restore();
      viewport.current?.redraw();
    };
  }, [animate, plan, image, artwork, target.tileset.bankId, live, viewport]);
};

export { useTileAnimation };
