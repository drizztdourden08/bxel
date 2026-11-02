/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import { useState } from 'react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { SourceDrop } from '../ProjectBrowser.type';
import type { FolderDropPayload } from './useFolderDrop.type';

const useSourceDrop = (ref: RefObject<DndElement | null>, key: string, drop: SourceDrop | undefined): boolean => {
  const [over, setOver] = useState(false);
  const allowed = drop?.canDrop(key) === true;
  useDropTarget<FolderDropPayload>(ref, {
    accepts: drop?.files === true ? [dnd.files, ASSET_DRAG] : [ASSET_DRAG],
    canDrop: (payload) => allowed && ('files' in payload || payload.every((asset) => asset.origin === undefined)),
    feedback: (feedback) => setOver(feedback.accepted && (feedback.phase === 'enter' || feedback.phase === 'over')),
    onDrop: (payload) => {
      if (drop !== undefined && allowed) drop.onDrop(key, payload);
    },
  });
  return over && allowed;
};

export { useSourceDrop };
