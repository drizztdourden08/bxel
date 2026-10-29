/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { dropIndex } from '../../../add-frames/drop-index';
import { dropSprite } from '../../../add-frames/drop-sprite';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { AnimationFocus } from '../../../timeline/timeline.type';

const spritesOf = (assets: readonly { readonly kind: string; readonly assetId: string | null }[]): readonly string[] =>
  assets.flatMap((asset) => (asset.kind === 'sprite' && asset.assetId !== null ? [asset.assetId] : []));

const useStripAssetDrop = (ref: RefObject<HTMLElement | null>, focus: AnimationFocus): void =>
  useDropTarget(ref, {
    accepts: ASSET_DRAG,
    canDrop: (assets) => !focus.readOnly && spritesOf(assets).length > 0,
    index: (point, element) => dropIndex(document.elementFromPoint(point.x, point.y) ?? element, point.x, focus),
    onDrop: (assets, info) => {
      spritesOf(assets).forEach((id, offset) => dropSprite(id, (info.index ?? focus.animation.frames.length) + offset, false));
    },
  });

export { useStripAssetDrop };
