/* @layer renderer-app @kind logic */
import type { DragEvent } from 'react';
import { dragOutPaths } from '../../../../../drag-out/drag-out-paths';
import { itemPaths } from '../../../behavior/item-paths';
import type { ProjectPanelModel } from '../../../ProjectPanel.type';

const treeDragOut = (model: ProjectPanelModel) => (keys: readonly string[], event: DragEvent<HTMLElement>): void => {
  event.preventDefault();
  const paths = itemPaths(keys.flatMap((key) => model.browser.itemOf(key) ?? []));
  if (paths.length > 0) void dragOutPaths(paths);
};

export { treeDragOut };
