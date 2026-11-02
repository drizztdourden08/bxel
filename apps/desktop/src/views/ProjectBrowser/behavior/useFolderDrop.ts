/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import { useState } from 'react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import { useBrowserContext } from './useBrowserContext';
import type { FolderDropPayload } from './useFolderDrop.type';
import { useSpringFolder } from './useSpringFolder';

const useFolderDrop = (ref: RefObject<DndElement | null>, folder: string | null, assets = true): boolean => {
  const { actions, model } = useBrowserContext();
  const [over, setOver] = useState(false);
  const target = folder !== null && model.editable ? folder : null;
  useSpringFolder(target === model.folder ? null : target, over);
  useDropTarget<FolderDropPayload>(ref, {
    accepts: assets ? [dnd.files, ASSET_DRAG] : [dnd.files],
    canDrop: (payload) => target !== null && ('files' in payload || payload.every((asset) => asset.origin === undefined)),
    feedback: (feedback) => setOver(feedback.accepted && (feedback.phase === 'enter' || feedback.phase === 'over')),
    onDrop: (payload) => {
      if (target === null) return;
      if ('files' in payload) actions.dropFiles(payload.files.map((each) => each.file), target);
      else actions.moveInto(payload.map((asset) => asset.id), target);
    },
  });
  return over && target !== null;
};

export { useFolderDrop };
