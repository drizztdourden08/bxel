/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import { useState } from 'react';
import type { RefObject } from 'react';
import type { AnimationId, SpriteId, TagId } from '@bxel/document';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import { animationKey } from '../../../sheet-manager/animation-key';
import { assetEntries } from '../../../sheet-manager/asset-entries';
import { removeEntries } from '../../../sheet-manager/remove-entries';
import type { ManagerModel } from '../SpritesPanel.type';

const useLibraryDrop = (ref: RefObject<DndElement | null>, model: ManagerModel): boolean => {
  const [over, setOver] = useState(false);
  useDropTarget<readonly DragAsset[]>(ref, {
    accepts: ASSET_DRAG,
    canDrop: (assets) => model.sheet !== null && assets.length > 0 && assets.every((asset) => asset.origin === 'sheet'),
    feedback: (feedback) => setOver(feedback.accepted && (feedback.phase === 'enter' || feedback.phase === 'over')),
    onDrop: (assets) => {
      const entries = assetEntries(assets);
      const sprites = entries.filter((entry) => entry.kind === 'sprite').map((entry) => entry.assetId as SpriteId);
      const keys = entries.filter((entry) => entry.kind === 'animation').map((entry) => animationKey(entry.assetId as AnimationId, (entry.tagId ?? null) as TagId | null));
      removeEntries(sprites, keys, model.sheet?.id ?? null);
    },
  });
  return over;
};

export { useLibraryDrop };
