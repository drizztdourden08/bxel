/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import { useEffectiveDefaults } from '../../../asset-defaults/useEffectiveDefaults';
import { dropFiles } from '../../../file-ops/drop-files';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { dropFolder } from './drop-folder';
import type { FolderRowPayload } from './useFolderDropTarget.type';

const useFolderDropTarget = (ref: RefObject<HTMLElement | null>, item: BrowserItem, model: ProjectPanelModel): void => {
  const folder = dropFolder(item);
  const defaults = useEffectiveDefaults();
  const { tree } = model.data;
  useDropTarget<FolderRowPayload>(ref, {
    accepts: [dnd.files, ASSET_DRAG],
    canDrop: (payload) => folder !== undefined && ('files' in payload || model.drag.canMoveInto(payload.map((each) => each.path), folder.key)),
    feedback: (feedback) => {
      if (folder !== undefined) model.drag.markDrop(folder.key, feedback.accepted && (feedback.phase === 'enter' || feedback.phase === 'over'));
    },
    onDrop: (payload) => {
      if (folder === undefined) return;
      if ('files' in payload) void dropFiles(payload.files.map((each) => each.file), folder.path, defaults);
      else model.drag.moveKeys(payload.flatMap((each) => tree.items.get(each.path)?.key ?? []), folder.key);
    },
  });
};

export { useFolderDropTarget };
