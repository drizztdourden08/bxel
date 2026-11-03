/* @layer renderer-app @kind logic */
import { dnd } from '@drizztdourden08/brock-react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import { crumbCanDrop } from './crumb-can-drop';
import { crumbDropOver } from './crumb-drop-over';
import { crumbDropTarget } from './crumb-drop-target';
import type { CrumbDropBinding } from './useCrumbDrops.type';
import type { FolderDropPayload } from './useFolderDrop.type';

const bindCrumbDrop = (element: HTMLElement, id: string, binding: CrumbDropBinding): (() => void) =>
  dnd.target<FolderDropPayload>(element, {
    accepts: [dnd.files, ASSET_DRAG],
    canDrop: (payload) => crumbCanDrop(binding.read(), id, payload),
    feedback: (feedback) => binding.setOverId(crumbDropOver(feedback, id)),
    onDrop: (payload) => {
      const state = binding.read();
      const target = crumbDropTarget(state, id);
      if (target === null) return;
      if ('files' in payload) state.actions.dropFiles(payload.files.map((each) => each.file), target);
      else state.actions.moveInto(payload.map((asset) => asset.id), target);
    },
  });

export { bindCrumbDrop };
