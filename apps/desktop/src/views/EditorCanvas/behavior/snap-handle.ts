/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { guideScope } from '../../../guides/guide-scope';
import { snapPoint } from '../../../guides/snap-point';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const snapHandle = (viewport: PixelViewportHandle | null, raw: Point, kind: string): Point => {
  const { snap, guides } = useViewStore.getState();
  if (!viewport || !snap || !guides || kind === 'body' || kind === 'rotate') return raw;
  return snapPoint(raw, { lines: guideScope()?.lines(), zoom: viewport.view().zoom });
};

export { snapHandle };
