/* @layer renderer-app @kind logic */
import { matchMask } from '@bxel/raster';
import type { Connectivity, MaskView, Point } from '@bxel/raster';
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { EditorTarget } from '../editor.type';
import { isTransparentSlot } from './is-transparent-slot';
import { matchRule } from './match-rule';
import { samplePixels } from './sample-pixels';
import { selectionMask } from './selection-mask';

const pointMask = (target: EditorTarget, by: 'wand' | 'colour', at: Point, connectivity?: Connectivity): MaskView => {
  const { width, height } = target.sprite;
  const store = useSelectionStore.getState();
  return matchMask({
    target: { pixels: samplePixels(target), width, height },
    seed: at,
    contiguous: by === 'wand',
    connectivity: connectivity ?? store.connectivity,
    matches: matchRule(store.match, target.bank, store.distance),
    ...(store.ignoreTransparent ? { ignore: isTransparentSlot(target.bank) } : {}),
    within: store.inSelection ? selectionMask(target) : null,
  });
};

export { pointMask };
