/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { floatBox } from '../../../editor/pending/float-box';
import { guideScope } from '../../../guides/guide-scope';
import { snapOffset } from '../../../guides/snap-offset';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const snapFloat = (viewport: PixelViewportHandle | null, offset: Point): Point => {
  const { snap, guides } = useViewStore.getState();
  const box = floatBox();
  if (!viewport || !snap || !guides || !box) return offset;
  return snapOffset(box, offset, { lines: guideScope()?.lines(), zoom: viewport.view().zoom });
};

export { snapFloat };
