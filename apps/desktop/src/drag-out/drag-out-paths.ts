/* @layer renderer-app @kind logic */
import { dnd } from '@drizztdourden08/brock-react';
import { ensureDragOutHost } from './ensure-drag-out-host';

const dragOutPaths = (paths: readonly string[]): Promise<boolean> => {
  ensureDragOutHost();
  return dnd.dragOut(paths.filter((path) => path !== ''));
};

export { dragOutPaths };
