/* @layer renderer-app @kind hook */
import { useDropTarget } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { dropFolder } from './drop-folder';

const useFolderDropTarget = (ref: RefObject<HTMLElement | null>, item: BrowserItem, model: ProjectPanelModel): void => {
  const folder = dropFolder(item);
  const { tree } = model.data;
  useDropTarget(ref, {
    accepts: ASSET_DRAG,
    canDrop: (assets) => folder !== undefined && model.drag.canMoveInto(assets.map((each) => each.path), folder.key),
    onDrop: (assets) => {
      if (folder !== undefined) model.drag.moveKeys(assets.flatMap((each) => tree.items.get(each.path)?.key ?? []), folder.key);
    },
  });
};

export { useFolderDropTarget };
